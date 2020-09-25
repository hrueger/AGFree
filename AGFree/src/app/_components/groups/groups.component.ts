import { Component } from "@angular/core";
import { User } from "../../_models/User";
import { Group } from "../../_models/Group";
import { RemoteService } from "../../_services/remote.service";
import { AlertService } from "../../_services/alert.service";
import { AuthenticationService } from "../../_services/authentication.service";

@Component({
    selector: "app-groups",
    styleUrls: ["./groups.component.scss"],
    templateUrl: "./groups.component.html",
})
export class GroupsComponent {
    public newGroupMode = false;
    public newGroupName = "";
    public users: User[] = [];
    public groups: Group[];
    public searchTerm = "";
    noGroupNameWarning: boolean;
    noUsersSelectedWarning: boolean;
    constructor(
        public authenticationService: AuthenticationService,
        private remoteService: RemoteService,
        private alertService: AlertService,
    ) { }

    public ngOnInit(): void {
        this.groups = undefined;
        this.remoteService.get("groups").subscribe((groups: Group[]) => {
            this.groups = groups;
        });
        this.remoteService.get("users").subscribe((users: User[]) => {
            this.users = users.filter(
                (u) => u.id !== this.authenticationService.currentUserValue.id,
            );
        });
    }

    public toggleUser(user: User): void {
        this.users = this.users.map((u) => {
            if (u.id == user.id) {
                u.selected = !u.selected;
            }
            return u;
        }).sort((u) => (u.selected ? -1 : 1));
        this.searchTerm = "";
    }

    public getUsers(): User[] {
        if (this.searchTerm.trim() == "") {
            return this.users;
        }
        return this.users.filter(
            (u) => u.username.toLowerCase().indexOf(this.searchTerm.trim().toLowerCase()) !== -1,
        );
    }

    public createGroup(): void {
        this.noGroupNameWarning = false;
        this.noUsersSelectedWarning = false;
        if (!this.newGroupName) {
            this.noGroupNameWarning = true;
            return;
        }
        if (this.users.filter((u) => u.selected).length === 0) {
            this.noUsersSelectedWarning = true;
            return;
        }
        this.remoteService.post("groups", {
            users: this.users.filter((u) => u.selected).map((u) => u.id),
            name: this.newGroupName,
        }).subscribe((d) => {
            if (d?.success) {
                this.newGroupMode = false;
                this.ngOnInit();
                this.alertService.success("Gruppe erfolgreich erstellt!");
            }
        });
    }

    public getUsersList(group: Group): string {
        return group.users.map((u) => u.username).join(", ");
    }

    public deleteGroup(group: Group): void {
        // eslint-disable-next-line
        if (confirm(`Willst Du die Gruppe "${group.name}" wirklich löschen? Dies kann nicht rückgängig gemacht werden!`)) {
            this.remoteService.delete(`groups/${group.id}`).subscribe((d) => {
                if (d?.success) {
                    this.alertService.success("Die Gruppe wurde gelöscht.");
                    this.ngOnInit();
                }
            });
        }
    }
}
