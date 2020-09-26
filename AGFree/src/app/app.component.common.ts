import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { RouterExtensions } from "@nativescript/angular";
import { AuthenticationService } from "./_services/authentication.service";

@Component({ template: "" })
export class AppComponentCommon {
    public currentUser: any;
    public pushMessage: any;
    public showNav = false;
    public isShare: boolean;
    public showEverything = true;
    constructor(
        public authenticationService: AuthenticationService,
        public router: Router,
        public routerExtensions: RouterExtensions,
    ) {
        this.authenticationService.currentUser.subscribe(
            (x) => { this.currentUser = x; },
        );
    }

    public logout(): void {
        this.authenticationService.logout();
        this.router.navigate(["/login"]);
    }
}
