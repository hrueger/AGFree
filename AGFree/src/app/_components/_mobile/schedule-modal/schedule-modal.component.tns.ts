import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { RouterExtensions } from "@nativescript/angular";
import { User } from "../../../_models/User";
import { StorageService } from "../../../_services/storage.service";

@Component({
    selector: "app-schedule-modal",
    templateUrl: "./schedule-modal.component.html",
    styleUrls: ["./schedule-modal.component.scss"],
})
export class ScheduleModalComponent {
    public title = "";
    public user: User;
    public usersToShow: User[];
    public selectedPeriod: number;
    public selectedDay: number;
    constructor(
        private router: RouterExtensions,
        private route: ActivatedRoute,
        private storageService: StorageService,
    ) {}

    public ngOnInit(): void {
        if (this.route.snapshot.queryParams.user) {
            this.user = JSON.parse(this.route.snapshot.queryParams.user);
            this.title = this.user.username;
        }
        if (this.route.snapshot.queryParams.selectedDay
            && this.route.snapshot.queryParams.selectedPeriod) {
            this.usersToShow = JSON.parse(this.route.snapshot.queryParams.usersToShow);
            this.title = this.route.snapshot.queryParams.title;
            this.selectedDay = this.route.snapshot.queryParams.selectedDay;
            this.selectedPeriod = this.route.snapshot.queryParams.selectedPeriod;
        }
    }

    public back(): void {
        this.router.back();
    }
}
