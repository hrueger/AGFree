import * as EmailTemplates from "email-templates";
import * as i18n from "i18n";
import * as nodeMailer from "nodemailer";
import * as path from "path";
import { Response } from "express";

export function sendMail(res: Response, to: string, data: {summary: string,
    title: string, subtitle: string, secondTitle: string, content: string, subject: string,
    // tslint:disable-next-line: align
    cardTitle: string, cardSubtitle: string, btnText: string, btnUrl: string}, template = "base"): Promise<any> {
    const locals: any = data;
    locals.sentTo = i18n.__("mail.sentTo").replace("%s", to);
    locals.unsubscribe = i18n.__("mail.unsubscribe");
    locals.info = i18n.__("mail.info");
    return new Promise<any>((resolve, reject) => {
        const transporter = nodeMailer.createTransport({
            auth: {
                pass: res.app.locals.config.MAIL_SERVER_PASSWORD,
                user: res.app.locals.config.MAIL_SERVER_USER,
            },
            host: res.app.locals.config.MAIL_SERVER_HOST,
            port: res.app.locals.config.MAIL_SERVER_PORT,
        });
        const email = new EmailTemplates({
            message: { from: res.app.locals.config.MAIL_SENDER_ADDRESS },
            preview: false,
            send: true,
            transport: transporter,
            views: {
                options: {
                    extension: "ejs",
                },
                root: path.resolve(__dirname, "../../assets/mail-templates"),
            },
        });
        email
            .send({
                locals,
                message: { to },
                template,
            })
            .then((info) => {
                resolve(info);
            })
            .catch((err) => {
                reject(err);
            });
    });
}
