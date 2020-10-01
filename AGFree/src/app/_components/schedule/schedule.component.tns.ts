import { Component } from "@angular/core";
import { RouterExtensions } from "@nativescript/angular";
import { User } from "../../_models/User";
import { AuthenticationService } from "../../_services/authentication.service";
import { RemoteService } from "../../_services/remote.service";
import { StorageService } from "../../_services/storage.service";
import { ScheduleComponentCommon } from "./schedule.component.common";

@Component({
    selector: "app-schedule",
    templateUrl: "./schedule.component.html",
    styleUrls: ["./schedule.component.scss"],
})
export class ScheduleComponent extends ScheduleComponentCommon {
    constructor(
        remoteService: RemoteService,
        authenticationService: AuthenticationService,
        storageService: StorageService,
        private router: RouterExtensions,
    ) {
        super(remoteService, authenticationService, storageService);
    }
    public openMobileModalWindow(selectedPeriod: number,
        selectedDay: number, usersToShow: User[]): void {
        this.router.navigate(["schedule-modal"], {
            transition: { name: "slideLeft" },
            queryParams: {
                selectedDay,
                selectedPeriod,
                title: `${this.periods.find((p) => p.id == selectedPeriod).name} - ${this.days.find((d) => d.id == selectedDay).name}`,
                usersToShow: JSON.stringify(usersToShow),
            },
        });
    }
}
