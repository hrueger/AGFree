import { Component } from "@angular/core";
import { User } from "../../_models/User";
import { Group } from "../../_models/Group";
import { RemoteService } from "../../_services/remote.service";

@Component({
    selector: "app-groups",
    styleUrls: ["./groups.component.scss"],
    templateUrl: "./groups.component.html",
})
export class GroupsComponent {
    public newGroupMode = false;
    public users: User[] = [];
    public groups: Group[] = [];
    public searchTerm = "";
    constructor(private remoteService: RemoteService) { }

    public ngOnInit(): void {
        this.remoteService.get("groups").subscribe((groups: Group[]) => {
            this.groups = groups;
        });
        this.remoteService.get("users").subscribe((users: User[]) => {
            this.users = users;
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
}
