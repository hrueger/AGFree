import { ChangeDetectorRef, Component } from "@angular/core";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { AuthenticationService } from "./_services/authentication.service";
import { RemoteService } from "./_services/remote.service";

@Component({
    selector: "app-root",
    styleUrls: ["./app.component.scss"],
    templateUrl: "./app.component.html",
})
export class AppComponent {
    public currentUser: any;
    public pushMessage: any;
    public showNav = false;
    public isShare: boolean;
    public showEverything = true;
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService,
        // private pushService: PushService,
        private translateService: TranslateService,
        private remoteService: RemoteService,
        private cdr: ChangeDetectorRef,
    ) {
        translateService.setDefaultLang(translateService.getBrowserLang());
        this.authenticationService.currentUser.subscribe(
            (x) => { this.currentUser = x; },
        );
    }

    public logout(): void {
        this.authenticationService.logout();
        this.router.navigate(["/login"]);
    }
}
