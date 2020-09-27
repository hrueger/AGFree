import { Component } from "@angular/core";
import { Application, Utils } from "@nativescript/core";
import { DrawerTransitionBase, RadSideDrawer, SlideInOnTopTransition } from "nativescript-ui-sidedrawer";
import { NavigationEnd, Router } from "@angular/router";
import { filter } from "rxjs/operators";
import * as appversion from "nativescript-appversion";
import { RouterExtensions } from "@nativescript/angular";
import { AppComponentCommon } from "./app.component.common";
import { AuthenticationService } from "./_services/authentication.service";

@Component({
    selector: "app-root",
    styleUrls: ["./app.component.scss"],
    templateUrl: "./app.component.html",
})
export class AppComponent extends AppComponentCommon {
    private _activatedUrl: string;
    private _sideDrawerTransition: DrawerTransitionBase;
    public version = "";
    public currentYear = new Date().getFullYear().toString();

    constructor(
        authenticationService: AuthenticationService,
        router: Router,
        private routerExtensions: RouterExtensions,
    ) {
        super(authenticationService, router);
    }

    ngOnInit(): void {
        appversion.getVersionName().then((v: string) => {
            this.version = v;
        });
        this._activatedUrl = "/home";
        this._sideDrawerTransition = new SlideInOnTopTransition();

        this.router.events
            .pipe(filter((event: any) => event instanceof NavigationEnd))
            .subscribe((event: NavigationEnd) => {
                this._activatedUrl = event.urlAfterRedirects;
            });
    }

    public logout(): void {
        this.closeSidedrawer();
        this.authenticationService.logout();
        this.router.navigate(["/login"]);
    }

    get sideDrawerTransition(): DrawerTransitionBase {
        return this._sideDrawerTransition;
    }

    isComponentSelected(url: string): boolean {
        return this._activatedUrl === url;
    }

    onNavItemTap(navItemRoute: string): void {
        this.routerExtensions.navigate([navItemRoute], {
            transition: {
                name: "fade",
            },
        });

        this.closeSidedrawer();
    }

    private closeSidedrawer() {
        const sideDrawer = Application.getRootView() as RadSideDrawer;
        sideDrawer.closeDrawer();
    }

    public goToGitHub(): void {
        Utils.openUrl("https://github.com/hrueger/AGFree");
    }
}
