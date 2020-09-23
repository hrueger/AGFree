import { Component, Input } from "@angular/core";

type Period = {
    name: string;
    id: number;
    dayId?: number;
};

type Day = {
    name: string;
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
    @Input() public userdata: Userdata = [];
    public days: Day[] = [
        {
            id: 1,
            name: "Montag",
        },
        {
            id: 2,
            name: "Dienstag",
        },
        {
            id: 3,
            name: "Mittwoch",
        },
        {
            id: 4,
            name: "Donnerstag",
        },
        {
            id: 5,
            name: "Freitag",
        },
    ];
    public periods: Period[] = [
        {
            id: 1,
            name: "1. Stunde",
        },
        {
            id: 2,
            name: "2. Stunde",
        },
        {
            id: 3,
            name: "3. Stunde",
        },
        {
            id: 4,
            name: "Pause",
        },
        {
            id: 5,
            name: "4. Stunde",
        },
        {
            id: 6,
            name: "5. Stunde",
        },
        {
            id: 7,
            name: "6. Stunde",
        },
        {
            id: 8,
            name: "Mittagspause",
        },
        {
            id: 9,
            name: "7. Stunde",
        },
        {
            id: 10,
            name: "8. Stunde",
        },
        {
            id: 11,
            name: "Pause",
        },
        {
            id: 12,
            name: "9. Stunde",
        },
        {
            id: 13,
            name: "10. Stunde",
        },
    ];

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
        this.userdata.push({ dayId: period.dayId, periodId: period.id });
    }
}
