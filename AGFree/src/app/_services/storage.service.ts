import { Injectable } from "@angular/core";

@Injectable({ providedIn: "root" })
export class StorageService {
    public setTemp(key: string, value: string): void {
        sessionStorage.setItem(key, value);
    }
    public getTemp(key: string): string {
        return sessionStorage.getItem(key);
    }
    public setPersistent(key: string, value: string): void {
        localStorage.setItem(key, value);
    }
    public getPersistent(key: string): string {
        return localStorage.getItem(key);
    }

    public removeTemp(key: string): void {
        sessionStorage.removeItem(key);
    }
    public removePersistent(key: string): void {
        localStorage.removeItem(key);
    }
}
