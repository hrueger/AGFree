import { Injectable } from "@angular/core";
import { ApplicationSettings } from "@nativescript/core";

@Injectable({ providedIn: "root" })
export class StorageService {
    public setTemp(key: string, value: string): void {
        this.setPersistent(key, value);
    }
    public getTemp(key: string): string {
        return this.getPersistent(key);
    }
    public setPersistent(key: string, value: string): void {
        ApplicationSettings.setString(key, value);
    }
    public getPersistent(key: string): string {
        return ApplicationSettings.getString(key);
    }

    public removeTemp(key: string): void {
        this.removePersistent(key);
    }
    public removePersistent(key: string): void {
        ApplicationSettings.remove(key);
    }
}
