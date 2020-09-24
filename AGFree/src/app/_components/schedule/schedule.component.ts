import { Component, Input } from "@angular/core";
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
    @Input() public edit: false;
    @Input() public userdata: Userdata;
    @Input() public small = false;
    public saving = false;
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

    constructor(private remoteService: RemoteService) {}

    public ngOnInit(): void {
        if (this.edit || !this.userdata) {
            this.remoteService.get("/users/schedule").subscribe((d) => {
                this.userdata = d && Array.isArray(d) ? d : [];
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

    public select(period: Period): void {
        if (!this.edit) {
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
