import { Component } from "@angular/core";
import { Group } from "../../_models/Group";
import { GroupsComponentCommon } from "./groups.component.common";

@Component({
    selector: "app-groups",
    styleUrls: ["./groups.component.scss"],
    templateUrl: "./groups.component.html",
})
export class GroupsComponent extends GroupsComponentCommon {
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
            this.selectionModeTitle = `${l} Gruppe${l < 1 ? "n" : ""}`;
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

    public endSelectionMode(): void {
        for (const g of this.groups) {
            if (g.selected) {
                g.selected = false;
            }
        }
        this.selectionMode = false;
        this.selectionModeTitle = "";
    }
}
