import { Request, Response } from "express";
import * as i18n from "i18n";
import { getRepository } from "typeorm";
import { User } from "../entity/User";
import { sendMail } from "../utils/mailer";

class UserController {
    public static listAll = async (req: Request, res: Response): Promise<void> => {
        const userRepository = getRepository(User);
        const users = await userRepository.find();
        res.send(users);
    }

    public static getSchedule = async (req: Request, res: Response): Promise<void> => {
        const userRepository = getRepository(User);
        try {
            const user = await userRepository.findOneOrFail(res.locals.jwtPayload.userId);
            res.send(user.data);
        } catch {
            res.status(404).send("Benutzer nicht gefunden!");
        }
    }

    public static newUser = async (req: Request, res: Response): Promise<void> => {
        const {
            username, password1, password2, email,
        } = req.body;
        if (!(username && email && password1 && password2)) {
            res.status(400).send({ message: i18n.__("errors.notAllFieldsProvided") });
            return;
        }
        if (password1 != password2) {
            res.status(400).send({ message: i18n.__("errors.passwordsDontMatch") });
            return;
        }

        const user = new User();
        user.username = username;
        user.email = email;
        user.password = password1;

        user.hashPassword();

        const userRepository = getRepository(User);
        try {
            await userRepository.save(user);
        } catch (e) {
            // eslint-disable-next-line no-console
            console.log(e);
            res.status(409).send({ message: i18n.__("errors.existingUsername") });
            return;
        }
        const d = new Date();
        sendMail(res, email, {
            btnText: i18n.__("welcomeMail.editSchedule"),
            btnUrl: res.app.locals.config.URL,
            cardSubtitle: i18n.__("welcomeMail.clickTheButton"),
            cardTitle: i18n.__("welcomeMail.startNow"),
            content: i18n.__("welcomeMail.content"),
            secondTitle: i18n.__("welcomeMail.helloUser").replace("%s", user.username),
            subject: i18n.__("welcomeMail.subject").replace("%s", user.username),
            subtitle: i18n.__("welcomeMail.at").replace("%s", `${d.getDate()}.${d.getMonth()}.${d.getFullYear()}, ${d.getHours()}:${d.getMinutes() == 0 ? "00" : d.getMinutes()}`),
            summary: i18n.__("welcomeMail.summary").replace("%s", user.username),
            title: i18n.__("welcomeMail.welcome"),
        });
        res.status(200).send({ success: true });
    }

    public static sendCompleteProfileMail = async (req: Request, res: Response): Promise<void> => {
        try {
            const users = await getRepository(User).find();
            for (const user of users) {
                if (!(user?.data && Array.isArray(user.data) && user.data.length > 0)) {
                    const d = new Date();
                    sendMail(res, user.email, {
                        btnText: i18n.__("completeProfileMail.editSchedule"),
                        btnUrl: res.app.locals.config.URL,
                        cardSubtitle: i18n.__("completeProfileMail.clickTheButton"),
                        cardTitle: i18n.__("completeProfileMail.startNow"),
                        content: i18n.__("completeProfileMail.content"),
                        secondTitle: i18n.__("completeProfileMail.helloUser").replace("%s", user.username),
                        subject: i18n.__("completeProfileMail.subject").replace("%s", user.username),
                        subtitle: i18n.__("completeProfileMail.at").replace("%s", `${d.getDate()}.${d.getMonth()}.${d.getFullYear()}, ${d.getHours()}:${d.getMinutes() == 0 ? "00" : d.getMinutes()}`),
                        summary: i18n.__("completeProfileMail.summary").replace("%s", user.username),
                        title: i18n.__("completeProfileMail.welcome"),
                    });
                }
            }
            res.send({ success: true });
        } catch {
            res.status(500).send({ message: "Internal error" });
        }
    }

    public static changeAdminStatus = async (req: Request, res: Response): Promise<void> => {
        const { id } = req.params;
        const { admin } = req.body;

        if (id == res.locals.jwtPayload.userId) {
            res.status(500).send({ message: "Du kannst dir nicht selbst den Admin-Status entfernen!" });
            return;
        }

        const userRepository = getRepository(User);
        try {
            const user = await userRepository.findOne(id);
            user.isAdmin = admin;
            await userRepository.save(user);
        } catch (e) {
            res.status(500).send({ message: "Konnte den Adminstatus nicht ändern!" });
            return;
        }
        res.status(200).send({ success: true });
    }

    public static editCurrent = async (req: Request, res: Response): Promise<void> => {
        const id = res.locals.jwtPayload.userId;

        const {
            username, email, pwNew, pwNew2, pwOld,
        } = req.body;

        const userRepository = getRepository(User);
        let user: User;
        try {
            user = await userRepository.createQueryBuilder("user")
                .addSelect("user.password")
                .where("user.id = :id", { id })
                .getOne();
        } catch (error) {
            res.status(404).send({ message: i18n.__("errors.userNotFound") });
            return;
        }

        if (!(username && email && pwOld)) {
            res.status(400).send({ message: i18n.__("errors.notAllFieldsProvided") });
        }

        if (pwNew != pwNew2) {
            res.status(400).send({ message: i18n.__("errors.passwordsDontMatch") });
            return;
        }

        if (!user.checkIfUnencryptedPasswordIsValid(pwOld)) {
            res.status(401).send({ message: i18n.__("errors.oldPasswordWrong") });
            return;
        }

        // Validate the new values on model
        user.username = username;
        user.email = email;
        if (pwNew && pwNew2) {
            user.password = pwNew;
            user.hashPassword();
        }

        try {
            await userRepository.save(user);
        } catch (e) {
            res.status(409).send({ message: i18n.__("errors.existingUsername") });
            return;
        }

        res.status(200).send({ success: true });
    }

    public static saveSchedule = async (req: Request, res: Response): Promise<void> => {
        const id = res.locals.jwtPayload.userId;

        const { data } = req.body;

        const userRepository = getRepository(User);
        let user: User;
        try {
            user = await userRepository.findOneOrFail(id);
        } catch (error) {
            res.status(404).send({ message: i18n.__("errors.userNotFound") });
            return;
        }

        user.data = data;

        try {
            await userRepository.save(user);
        } catch (e) {
            res.status(409).send({ message: i18n.__("errors.error") });
            return;
        }

        res.status(200).send({ success: true });
    }

    public static deleteUser = async (req: Request, res: Response): Promise<void> => {
        const { id } = req.params;

        const userRepository = getRepository(User);
        try {
            await userRepository.delete(id);
        } catch (e) {
            res.status(500).send({ message: i18n.__("errors.errorWhileDeletingUser") });
            return;
        }

        res.status(200).send({ success: true });
    }
}

export default UserController;
