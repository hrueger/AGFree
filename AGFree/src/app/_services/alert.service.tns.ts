import { Injectable, TemplateRef } from "@angular/core";
import { Feedback } from "nativescript-feedback";
import { FastTranslateService } from "./fast-translate.service";

@Injectable({ providedIn: "root" })
export class AlertService {
    private feedback: Feedback;

    constructor(private fts: FastTranslateService) {
        this.feedback = new Feedback();
    }

    // eslint-disable-next-line
    public custom(textOrTpl: string | TemplateRef<any>, options: any = {}): void {
        //
    }

    // eslint-disable-next-line
    public remove(toast: any) {
        //
    }

    public removeAll(): void {
        //
    }

    public async success(msg: string): Promise<void> {
        this.feedback.success({
            title: `${await this.fts.t("general.success")}!`,
            message: msg,
        });
    }
    public async error(msg: string): Promise<void> {
        if (typeof msg !== "string") {
            console.log(`AlertService: ${msg}`);
            return;
        }
        this.feedback.error({
            title: `${await this.fts.t("general.error")}!`,
            message: msg,
        });
    }
    public async info(msg: string): Promise<void> {
        this.feedback.info({
            title: `${await this.fts.t("general.info")}!`,
            message: msg,
        });
    }
    public async warning(msg: string): Promise<void> {
        this.feedback.warning({
            title: `${await this.fts.t("general.warning")}!`,
            message: msg,
        });
    }
}
