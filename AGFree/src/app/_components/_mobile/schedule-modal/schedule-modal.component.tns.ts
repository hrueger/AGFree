import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { RouterExtensions } from "@nativescript/angular";
import { User } from "../../../_models/User";

@Component({
    selector: "app-schedule-modal",
    templateUrl: "./schedule-modal.component.html",
    styleUrls: ["./schedule-modal.component.scss"],
})
export class ScheduleModalComponent {
    public title = "";
    public user: User;
    constructor(private router: RouterExtensions, private route: ActivatedRoute) { }

    public ngOnInit(): void {
        if (this.route.snapshot.queryParams.user) {
            this.user = JSON.parse(this.route.snapshot.queryParams.user);
            this.title = this.user.username;
        }
    }

    public back(): void {
        this.router.back();
    }
}
