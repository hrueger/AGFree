import { Request, Response } from "express";
import * as i18n from "i18n";
import { getRepository } from "typeorm";
import { Group } from "../entity/Group";
import { User } from "../entity/User";

class GroupController {
    public static listAll = async (req: Request, res: Response): Promise<void> => {
        const groupRepository = getRepository(Group);
        const groups = await groupRepository.find({ relations: ["creator", "users"] });
        res.send(groups
            .filter((g) => g.users.findIndex((u) => u.id == res.locals.jwtPayload.userId) !== -1));
    }

    public static newGroup = async (req: Request, res: Response): Promise<void> => {
        const groupRepository = getRepository(Group);
        const userIds = req.body.users;
        const { name }: { name: string } = req.body;
        if (!(userIds && Array.isArray(userIds) && userIds.length > 0 && name)) {
            res.status(400).send({ message: i18n.__("errors.notAllFieldsProvided") });
            return;
        }

        const group = new Group();
        group.name = name;
        try {
            group.creator = await getRepository(User).findOneOrFail(res.locals.jwtPayload.userId);
            group.users = [];
            for (const userId of userIds) {
                group.users.push(await getRepository(User).findOneOrFail(userId));
            }
            group.users.push(group.creator);
            await groupRepository.save(group);
        } catch (e) {
            res.status(500).send({ message: `${i18n.__("errors.error")}` });
            return;
        }

        res.status(200).send({ success: true });
    }

    public static deleteGroup = async (req: Request, res: Response): Promise<void> => {
        const { id } = req.params;
        const groupRepository = getRepository(Group);
        try {
            const g = await groupRepository.findOneOrFail(id, { relations: ["creator"] });
            if (g.creator.id !== res.locals.jwtPayload.userId) {
                res.status(401).send({ message: "Nur die Person, die eine Gruppe erstellt hat, kann sie auch löschen!" });
                return;
            }
            groupRepository.delete(id);
        } catch (error) {
            res.status(404).send({ message: i18n.__("errors.groupNotFound") });
            return;
        }
        res.status(200).send({ success: true });
    }
}

export default GroupController;
