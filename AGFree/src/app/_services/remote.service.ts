import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { getApiUrl } from "../_helpers/utils";
import { AlertService } from "./alert.service";

@Injectable({
    providedIn: "root",
})
export class RemoteService {
    constructor(
        private http: HttpClient,
        private alertService: AlertService,
    ) { }

    public get(path: string): Observable<any> {
        return this.http.get<any>(`${getApiUrl()}${path}`).pipe(
            tap(() => undefined),
            catchError(this.handleError<any>(path, false)),
        );
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    public post(path: string, data: Record<string, any>, options?: any): Observable<any> {
        return this.http.post<any>(`${getApiUrl()}${path}`, data, options).pipe(
            tap(() => undefined),
            catchError(this.handleError<any>(path, false)),
        );
    }

    public delete(path: string): Observable<any> {
        return this.http.delete<any>(`${getApiUrl()}${path}`).pipe(
            tap(() => undefined),
            catchError(this.handleError<any>(path, false)),
        );
    }

    private handleError<T>(operation = "operation", result?: T) {
        return (error: any): Observable<T> => {
            // eslint-disable-next-line no-console
            console.error("Error occured in remote.service.ts:", error);

            if (!error.startsWith("java.net.UnknownHostException")) {
                this.log(`${operation} failed: ${error.message}`);
                // eslint-disable-next-line no-console
                console.log(result);

                this.alertService.error(error || "error von remote service");
            }

            return of(result as T);
        };
    }

    private log(message: string) {
        // eslint-disable-next-line no-console
        console.log(`RemoteService Log: ${message}`);
    }
}
