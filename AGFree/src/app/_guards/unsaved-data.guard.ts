import { CanDeactivate } from "@angular/router";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { FastTranslateService } from "../_services/fast-translate.service";

export interface ComponentCanDeactivate {
  canDeactivate: () => boolean | Observable<boolean>;
  hasUnsavedData: boolean;
}

@Injectable()
export class UnsavedDataGuard implements CanDeactivate<ComponentCanDeactivate> {
    constructor(private fts: FastTranslateService) {}
    canDeactivate(component: ComponentCanDeactivate): Promise<boolean> {
        return new Promise((resolve) => {
            if (component.hasUnsavedData) {
                this.fts.t("general.unsavedDataWarning").then((v) => {
                    // eslint-disable-next-line
                    resolve(confirm(v));
                });
            } else {
                resolve(true);
            }
        });
    }
}
