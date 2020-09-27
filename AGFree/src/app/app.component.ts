import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { AppComponentCommon } from "./app.component.common";
import { AuthenticationService } from "./_services/authentication.service";

@Component({
    selector: "app-root",
    styleUrls: ["./app.component.scss"],
    templateUrl: "./app.component.html",
})
export class AppComponent extends AppComponentCommon {
    constructor(
        router: Router,
        authenticationService: AuthenticationService,
        translateService: TranslateService,
    ) {
        super(authenticationService, router);
        translateService.setDefaultLang("de");
    }
}
