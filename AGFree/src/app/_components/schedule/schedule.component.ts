import { Component, Input } from "@angular/core";
import { AuthenticationService } from "../../_services/authentication.service";
import { RemoteService } from "../../_services/remote.service";

type Period = {
    name: string;
    nameShort: string;
    id: number;
    dayId?: number;
};

type Day = {
    name: string;
    nameShort: string;
    id: number;
};

type Row = Period[];

type Userdata = {
    dayId: number,
    periodId: number,
}[];

@Component({
    selector: "app-schedule",
    templateUrl: "./schedule.component.html",
    styleUrls: ["./schedule.component.scss"],
})
export class ScheduleComponent {
    public _edit = false;
    public _userdata: Userdata;
    public users: any[] = [];
    public usersToShow: any[] = [];
    public myId: number;
    public showSchedules = false;
    @Input() public set edit(m: boolean) {
        this.selectedPeriod = undefined;
        this.selectedDay = undefined;
        this._edit = m;
    }
    public get edit(): boolean {
        return this._edit;
    }
    @Input() public set userdata(u: Userdata) {
        this._userdata = u && Array.isArray(u) ? u : [];
    }
    public get userdata(): Userdata {
        return this._userdata;
    }
    @Input() public small = false;
    public saving = false;
    public selectedDay: number;
    public selectedPeriod: number;
    public days: Day[] = [
        {
            id: 1,
            name: "Montag",
            nameShort: "Mo",
        },
        {
            id: 2,
            name: "Dienstag",
            nameShort: "Di",
        },
        {
            id: 3,
            name: "Mittwoch",
            nameShort: "Mi",
        },
        {
            id: 4,
            name: "Donnerstag",
            nameShort: "Do",
        },
        {
            id: 5,
            name: "Freitag",
            nameShort: "Fr",
        },
    ];
    public periods: Period[] = [
        {
            id: 1,
            name: "1. Stunde",
            nameShort: "1.",
        },
        {
            id: 2,
            name: "2. Stunde",
            nameShort: "2.",
        },
        {
            id: 3,
            name: "3. Stunde",
            nameShort: "3.",
        },
        {
            id: 4,
            name: "Pause",
            nameShort: "--",
        },
        {
            id: 5,
            name: "4. Stunde",
            nameShort: "4.",
        },
        {
            id: 6,
            name: "5. Stunde",
            nameShort: "5.",
        },
        {
            id: 7,
            name: "6. Stunde",
            nameShort: "6.",
        },
        {
            id: 8,
            name: "Mittagspause",
            nameShort: "--",
        },
        {
            id: 9,
            name: "7. Stunde",
            nameShort: "7.",
        },
        {
            id: 10,
            name: "8. Stunde",
            nameShort: "8.",
        },
        {
            id: 11,
            name: "Pause",
            nameShort: "--",
        },
        {
            id: 12,
            name: "9. Stunde",
            nameShort: "9.",
        },
        {
            id: 13,
            name: "10. Stunde",
            nameShort: "10.",
        },
    ];

    constructor(
        private remoteService: RemoteService,
        private authenticationService: AuthenticationService,
    ) {
        this.myId = this.authenticationService.currentUserValue.id;
    }

    public ngOnInit(): void {
        if (this.edit || !this.userdata) {
            this.remoteService.get("/users/schedule").subscribe((d) => {
                this._userdata = d && Array.isArray(d) ? d : [];
            });
            this.remoteService.get("/users").subscribe((u) => {
                this.users = u;
            });
        }
    }

    public getRows(): Row[] {
        const r: Row[] = [];
        for (let i = 0; i < this.periods.length; i++) {
            const s: Row = [];
            for (let j = 0; j < this.days.length; j++) {
                s.push({
                    ...this.periods[i],
                    dayId: this.days[j].id,
                });
            }
            r.push(s);
        }
        return r;
    }

    public isBreak(row: Row): boolean {
        return row[0].name == "Pause";
    }

    public isLaunchBreak(row: Row): boolean {
        return row[0].name == "Mittagspause";
    }

    public isFree(period: Period): boolean {
        return this.userdata.filter(
            (u) => u.periodId == period.id && u.dayId == period.dayId,
        ).length == 0;
    }

    public getUserdata(u: Record<string, any>): Userdata {
        return u.data && Array.isArray(u.data) ? u.data : [];
    }

    public select(period: Period): void {
        if (!this.edit) {
            if (!this.small) {
                this.selectedDay = period.dayId;
                this.selectedPeriod = period.id;
                this.usersToShow = this.users.filter((u) => this.getUserdata(u).findIndex(
                    (d) => d.dayId === this.selectedDay && d.periodId === this.selectedPeriod,
                ) === -1 && u.id !== this.myId).map((u) => {
                    u.noPreviousPeriods = false;
                    u.noFollowingPeriods = false;
                    if (this.selectedPeriod === this.periods[0].id) {
                        // the first period is a free period
                        u.noPreviousPeriods = true;
                    } else if (this.selectedPeriod === this.periods[this.periods.length - 1].id) {
                        // the last period is a free period
                        u.noFollowingPeriods = true;
                    } else {
                        // eslint-disable-next-line no-lonely-if
                        if (this.getUserdata(u).filter((d) => d.dayId == this.selectedDay
                                && d.periodId < this.selectedPeriod).length === 0) {
                            // there are no lessons before this period
                            u.noPreviousPeriods = true;
                        } else if (this.getUserdata(u).filter((d) => d.dayId == this.selectedDay
                                && d.periodId > this.selectedPeriod).length === 0) {
                            // there are no lessons after this period
                            u.noFollowingPeriods = true;
                        }
                    }
                    return u;
                });
            }
            return;
        }
        if (this.isFree(period)) {
            this.userdata.push({ dayId: period.dayId, periodId: period.id });
        } else {
            this.userdata = this.userdata.filter(
                (u) => u.periodId != period.id || u.dayId != period.dayId,
            );
        }
        this.save();
    }

    public save(): void {
        if (this.saving) {
            return;
        }
        this.saving = true;
        this.remoteService.post("/users/schedule", { data: this.userdata }).subscribe(() => {
            this.saving = false;
        }, () => {
            this.saving = false;
        });
    }
}
