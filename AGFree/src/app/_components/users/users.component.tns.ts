import { Component } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { RouterExtensions } from "@nativescript/angular";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { User } from "../../_models/User";
import { AlertService } from "../../_services/alert.service";
import { AuthenticationService } from "../../_services/authentication.service";
import { FastTranslateService } from "../../_services/fast-translate.service";
import { RemoteService } from "../../_services/remote.service";
import { UsersComponentCommon } from "./users.component.common";

@Component({
    selector: "app-users",
    styleUrls: ["./users.component.scss"],
    templateUrl: "./users.component.html",
})
export class UsersComponent extends UsersComponentCommon {
    public selectionMode = false;
    public selectionModeTitle = "";

    constructor(
        authenticationService: AuthenticationService,
        remoteService: RemoteService,
        modalService: NgbModal,
        fb: FormBuilder,
        alertService: AlertService,
        fts: FastTranslateService,
        private router: RouterExtensions,
    ) {
        super(
            authenticationService,
            remoteService,
            modalService,
            fb,
            alertService,
            fts,
        );
    }

    public ngOnInit(): void {
        setTimeout(() => {
            this.loadUsers();
        }, 500);
        this.createForms();
    }

    public search(term: string | undefined): void {
        this.users = term ? this.users.filter((u) => u.username.indexOf(term) !== -1)
            : this.allUsers;
    }

    public tap(user: User): void {
        if (this.selectionMode) {
            const u = this.users.filter((h) => h.id == user.id)[0];
            u.selected = !u.selected;
            const l = this.users.filter((h) => h.selected).length;
            if (l == 0) {
                this.selectionMode = false;
                this.selectionModeTitle = "";
                return;
            }
            this.selectionModeTitle = `${l} Person${l < 1 ? "en" : ""}`;
            return;
        }
        this.router.navigate(["schedule-modal"], {
            transition: { name: "slideLeft" },
            queryParams: {
                user: JSON.stringify(user),
            },
        });
    }
    public longPress(group: User): void {
        this.selectionMode = true;
        const u = this.users.filter((h) => h.id == group.id)[0];
        u.selected = true;
        this.selectionModeTitle = "1 Person";
    }

    public endSelectionMode(): void {
        for (const u of this.users) {
            if (u.selected) {
                u.selected = false;
            }
        }
        this.selectionMode = false;
        this.selectionModeTitle = "";
    }
}
