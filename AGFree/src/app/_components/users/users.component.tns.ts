import { Component } from "@angular/core";
import { User } from "../../_models/User";
import { UsersComponentCommon } from "./users.component.common";

@Component({
    selector: "app-users",
    styleUrls: ["./users.component.scss"],
    templateUrl: "./users.component.html",
})
export class UsersComponent extends UsersComponentCommon {
    public selectionMode = false;
    public selectionModeTitle = "";
    public tap(group: User): void {
        if (this.selectionMode) {
            const u = this.users.filter((h) => h.id == group.id)[0];
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
        // eslint-disable-next-line no-alert
        alert(group.username);
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
