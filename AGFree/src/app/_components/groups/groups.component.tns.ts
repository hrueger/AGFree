import { Component } from "@angular/core";
import { Group } from "../../_models/Group";
import { AlertService } from "../../_services/alert.service";
import { AuthenticationService } from "../../_services/authentication.service";
import { RemoteService } from "../../_services/remote.service";
import { GroupsComponentCommon } from "./groups.component.common";

@Component({
    selector: "app-groups",
    styleUrls: ["./groups.component.scss"],
    templateUrl: "./groups.component.html",
})
export class GroupsComponent extends GroupsComponentCommon {
    public navbarItems = [
        {
            text: "Gruppe hinzufügen",
            id: "add",
            icon: "~/assets/actionIcons/plus.png",
        },
    ];
    public saveItems = [
        {
            text: "Speichern",
            id: "save",
            icon: "~/assets/actionIcons/save.png",
        },
    ]
    public selectionMode = false;
    public selectionModeTitle = "";

    public tap(group: Group): void {
        if (this.selectionMode) {
            const g = this.groups.filter((h) => h.id == group.id)[0];
            g.selected = !g.selected;
            const l = this.groups.filter((h) => h.selected).length;
            if (l == 0) {
                this.selectionMode = false;
                this.selectionModeTitle = "";
                return;
            }
            this.selectionModeTitle = `${l} Gruppe${l > 1 ? "n" : ""}`;
            return;
        }
        // eslint-disable-next-line no-alert
        alert(group.name);
    }
    public longPress(group: Group): void {
        this.selectionMode = true;
        const g = this.groups.filter((h) => h.id == group.id)[0];
        g.selected = true;
        this.selectionModeTitle = "1 Gruppe";
    }

    public itemTapped(event: string): void {
        if (event == "add") {
            this.newGroupMode = true;
        } else if (event == "save") {
            this.createGroup();
        }
    }

    public endModalMode(): void {
        if (this.newGroupMode) {
            this.newGroupMode = false;
            return;
        }
        for (const g of this.groups) {
            if (g.selected) {
                g.selected = false;
            }
        }
        this.selectionMode = false;
        this.selectionModeTitle = "";
    }

    public ngOnInit(): void {
        setTimeout(() => {
            this.loadGroups();
        }, 500);
    }
}
