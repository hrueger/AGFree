import {
    Component,
    EventEmitter,
    Output,
} from "@angular/core";
import { Router } from "@angular/router";
import { AuthenticationService } from "../../_services/authentication.service";

@Component({
    selector: "navbar",
    styleUrls: ["./navbar.component.scss"],
    templateUrl: "./navbar.component.html",
})
export class NavbarComponent {
    public headline = "";
    public showMenu = false;
    @Output() public toggleNav = new EventEmitter<any>();

    constructor(
        private router: Router,
        private authenticationService: AuthenticationService,
    ) { }
    public logout(): void {
        this.authenticationService.logout();
        this.router.navigate(["/login"]);
    }
    public toggleNavOnMobile(event: Event): void {
        event.preventDefault();
        event.stopPropagation();
        this.toggleNav.emit(Math.random());
    }
}
