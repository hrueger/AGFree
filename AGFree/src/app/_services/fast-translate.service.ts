import { Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";

@Injectable({
    providedIn: "root",
})
export class FastTranslateService {
    constructor(private translateService: TranslateService) { }

    public t(key: string): Promise<string> {
        return this.translateService.get(key).toPromise();
    }
    public setLang(lang: string): void {
        this.translateService.use(lang);
    }
}
