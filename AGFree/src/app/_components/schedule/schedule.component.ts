import { Component } from "@angular/core";

type Period = {
    name: string;
};

type Day = {
    name: string;
    periods: Period[];
};

type Row = string[];

@Component({
    selector: "app-schedule",
    templateUrl: "./schedule.component.html",
    styleUrls: ["./schedule.component.scss"],
})
export class ScheduleComponent {
    public days: string[] = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag"];
    public periods: string[] = ["1. Stunde", "2. Stunde", "3. Stunde", "Pause", "4. Stunde", "5. Stunde", "6. Stunde", "Mittagspause", "7. Stunde", "8.Stunde", "Pause", "9. Stunde", "10. Stunde"]

    public getRows(): Row[] {
        const r = [];
        for (let i = 0; i < this.periods.length; i++) {
            const s = [];
            for (let j = 0; j < this.days.length; j++) {
                s.push(this.periods[i]);
            }
            r.push(s);
        }
        return r;
    }

    public isBreak(row: Row): boolean {
        return row[0] == "Pause";
    }

    public isLaunchBreak(row: Row): boolean {
        return row[0] == "Mittagspause";
    }
}
