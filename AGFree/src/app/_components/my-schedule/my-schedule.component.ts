import { Component } from "@angular/core";

@Component({
    selector: "app-my-schedule",
    templateUrl: "./my-schedule.component.html",
    styleUrls: ["./my-schedule.component.scss"],
})
export class MyScheduleComponent {
    public editMode = false;
    public navbarItems = [];

    public itemTapped(event: string): void {
        if (event == "edit") {
            this.editMode = true;
            this.navbarItems = [
                {
                    text: "Speichern",
                    id: "editingDone",
                    icon: "~/assets/actionIcons/save.png",
                },
            ];
        } else if (event == "editingDone") {
            this.editMode = false;
            this.setDefaultNavbarItems();
        }
    }

    constructor() {
        this.setDefaultNavbarItems();
    }

    public setDefaultNavbarItems(): void {
        this.navbarItems = [
            {
                text: "Stundenplan bearbeiten",
                id: "edit",
                icon: "~/assets/actionIcons/pen.png",
            },
        ];
    }
}
