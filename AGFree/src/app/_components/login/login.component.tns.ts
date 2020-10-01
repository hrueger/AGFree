import { HttpClient } from "@angular/common/http";
import { Component } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { ApplicationSettings, Dialogs, Page } from "@nativescript/core";
import { AlertService } from "../../_services/alert.service";
import { AuthenticationService } from "../../_services/authentication.service";
import { RemoteService } from "../../_services/remote.service";
import { DATA_INFO, LoginComponentCommon } from "./login.component.common";

@Component({
    styleUrls: ["./login.component.scss"],
    templateUrl: "login.component.html",
})
export class LoginComponent extends LoginComponentCommon {
    constructor(
        formBuilder: FormBuilder,
        router: Router,
        authenticationService: AuthenticationService,
        alertService: AlertService,
        remoteService: RemoteService,
        route: ActivatedRoute,
        private page: Page,
        private httpClient: HttpClient,
    ) {
        super(formBuilder, router, authenticationService, alertService, remoteService, route);
        this.page.actionBarHidden = true;
    }
    public domain: string;
    public domainKnown = !!ApplicationSettings.getString("domain");

    public checkDomain(): void {
        if (this.domain) {
            this.loading = true;
            this.httpClient.get(`${this.domain}/config.json`).subscribe((d: any) => {
                this.loading = false;
                if (d && d.agfree) {
                    ApplicationSettings.setString("domain", this.domain);
                    this.domainKnown = true;
                } else {
                    this.alertService.error("Ungültige Domain!");
                }
            }, () => {
                this.loading = false;
                this.alertService.error("Ungültige Domain!");
            });
        } else {
            this.alertService.error("Du musst eine Domain eingeben!");
        }
    }

    public confirmPrivacyPolicy(): Promise<void> {
        return new Promise((resolve, reject) => {
            Dialogs.confirm({
                title: "Datenverarbeitung",
                message: DATA_INFO,
                okButtonText: "Einverstanden",
            }).then((r) => {
                if (r) {
                    Dialogs.confirm({
                        title: "Datenschutz",
                        message: "Ich akzeptiere die Datenschutzvereinbarung (zu finden unter domain.tls/privacy-policy).",
                        okButtonText: "Einverstanden",
                    }).then((s) => {
                        if (s) {
                            resolve();
                        } else {
                            reject();
                        }
                    });
                } else {
                    reject();
                }
            });
        });
    }
}
