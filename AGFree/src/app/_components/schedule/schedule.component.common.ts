import { Component, Input } from "@angular/core";
import { StorageService } from "../../_services/storage.service";
import { Group } from "../../_models/Group";
import { User } from "../../_models/User";
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

type MobileCachedPeriod = {
    row: number;
    col: number;
    class: string;
    selected: boolean;
    period: Period,
};

@Component({ template: "" })
export class ScheduleComponentCommon {
    public _edit = false;
    public _userdata: Userdata;
    public users: User[] = [];
    public usersToShow: User[] = [];
    public myId: number;
    public showSchedules = false;
    @Input() public set edit(m: boolean) {
        this.selectedPeriod = undefined;
        this.selectedDay = undefined;
        this.mobilePeriodSelected = false;
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
    @Input() public nonInteractive = false;
    @Input() public group: Group;
    public saving = false;
    @Input() public selectedDay: number;
    @Input() public selectedPeriod: number;
    public mobilePeriodCache: MobileCachedPeriod[] = [];
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
    public mobilePeriodSelected = false;

    constructor(
        private remoteService: RemoteService,
        private authenticationService: AuthenticationService,
        private storageService: StorageService,
    ) {
        this.showSchedules = this.storageService.get("showSchedules") == "true";
        this.myId = this.authenticationService.currentUser.id;
    }

    public ngOnInit(): void {
        if (this.group) {
            this.users = this.group.users;
        } else if (this.edit || !this.userdata) {
            this.remoteService.get("/users/schedule").subscribe((d: Userdata) => {
                this._userdata = d && Array.isArray(d) ? d : [];
                this.buildMobileCache();
            });
            this.remoteService.get("/users").subscribe((u: User[]) => {
                this.users = u;
            });
        } else if (this.userdata) {
            this.buildMobileCache();
        }
    }

    private buildMobileCache() {
        for (const period of this.periods) {
            for (const day of this.days) {
                this.mobilePeriodCache.push({
                    row: period.id,
                    col: day.id,
                    class: this.isFree({ ...period, dayId: day.id }) ? "free" : "lesson",
                    selected: false,
                    period: {
                        ...period,
                        dayId: day.id,
                    },
                });
            }
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

    public toggleSchedules(): void {
        this.showSchedules = !this.showSchedules;
        this.storageService.set("showSchedules", this.showSchedules ? "true" : "false");
    }

    public isBreak(row: Row): boolean {
        return row[0].name == "Pause";
    }

    public isLaunchBreak(row: Row): boolean {
        return row[0].name == "Mittagspause";
    }

    public isFree(period: Period, userdata?: Userdata): boolean {
        let ud = (userdata || this.userdata);
        if (!ud || !Array.isArray(ud)) {
            ud = [];
        }
        return ud.filter(
            (u) => u.periodId == period.id && u.dayId == period.dayId,
        ).length == 0;
    }

    public getLessonColor(period: Period): string {
        if (!this.group) {
            return "#ffffff";
        }
        let lessonCount = 0;
        for (const user of this.users) {
            if (!this.isFree(period, user.data)) {
                lessonCount++;
            }
        }
        // eslint-disable-next-line no-use-before-define
        return pickHex("#fcbc53", "#55efc4", lessonCount / this.users.length);
    }

    public getUserdata(u: User): Userdata {
        return u.data && Array.isArray(u.data) ? u.data : [];
    }

    public select(period: Period, mobile = false): void {
        if (!this.edit) {
            if (!this.small && !this.nonInteractive) {
                if (mobile) {
                    this.selectedDay = (period as unknown as MobileCachedPeriod).period.dayId;
                    this.selectedPeriod = (period as unknown as MobileCachedPeriod).period.id;
                    this.updateUsersToShow();
                    this.openMobileModalWindow(this.selectedPeriod,
                        this.selectedDay, this.usersToShow);
                } else {
                    this.selectedDay = period.dayId;
                    this.selectedPeriod = period.id;
                    this.updateUsersToShow();
                }
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

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public openMobileModalWindow(selectedPeriod: number,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        selectedDay: number, usersToShow: User[]): void {
        //
    }

    public selectMobile(period: Period): void {
        this.select(period, true);
        this.mobilePeriodSelected = true;
    }

    private updateUsersToShow() {
        this.usersToShow = this.checkForPreviousAndFollowingPeriods(this.group
            ? this.users
            : this.users.filter((u) => this.getUserdata(u).findIndex(
                (d) => d.dayId === this.selectedDay && d.periodId === this.selectedPeriod,
            ) === -1 && u.id !== this.myId));
    }

    private checkForPreviousAndFollowingPeriods(users: User[]): User[] {
        return users.map((u) => {
            u.noPreviousPeriods = false;
            u.noFollowingPeriods = false;
            if (this.selectedPeriod === this.periods[0].id) {
                // the first period is a free period
                u.noPreviousPeriods = true;
            } else if (this.selectedPeriod === this.periods[this.periods.length - 1]
                .id) {
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

    public getGridLayoutRows(): string {
        return new Array(this.periods.length + 1).fill("auto").join(",");
    }

    public getGridLayoutColumns(): string {
        const columnsArray = new Array(this.days.length + 1).fill("*");
        if (!this.small) {
            columnsArray[0] = "2*";
        }
        return columnsArray.join(",");
    }
}

// from https://stackoverflow.com/a/5624139/13485777
function rgbToHex(r, g, b) {
    function componentToHex(c) {
        const hex = c.toString(16);
        return hex.length == 1 ? `0${hex}` : hex;
    }
    return `#${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}`;
}
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16),
    ] : null;
}

// from https://stackoverflow.com/a/30144587/13485777
function pickHex(color1: string, color2: string, weight: number): string {
    const c1 = hexToRgb(color1);
    const c2 = hexToRgb(color2);
    const w1 = weight;
    const w2 = 1 - w1;
    return rgbToHex(Math.round(c1[0] * w1 + c2[0] * w2),
        Math.round(c1[1] * w1 + c2[1] * w2),
        Math.round(c1[2] * w1 + c2[2] * w2));
}
