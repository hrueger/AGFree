import { Injectable } from "@angular/core";
import { ApplicationSettings } from "@nativescript/core";

@Injectable({ providedIn: "root" })
export class StorageService {
    public set(key: string, value: string): void {
        ApplicationSettings.setString(key, value);
    }
    public get(key: string): string {
        return ApplicationSettings.getString(key);
    }
    public remove(key: string): void {
        ApplicationSettings.remove(key);
    }
}
