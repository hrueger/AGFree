import {
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable, BehaviorSubject, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { AuthenticationService, NoErrorToastHttpParams } from "../_services/authentication.service";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthenticationService, private router: Router) {}

    public intercept(
        request: HttpRequest<any>,
        next: HttpHandler,
    ): Observable<any> {
        return next.handle(request).pipe(
            catchError((err) => {
                // eslint-disable-next-line no-console
                console.error("Error in error.interceptor.ts: ", err, err.stack);

                if (err && err.error && err.error.logout) {
                    this.authenticationService.logout();
                    this.router.navigate(["login"]);
                }
                const error = err?.error?.message || err.statusText || "Unknown error!";
                if (!(request.params instanceof NoErrorToastHttpParams
                    && request.params.dontShowToast)) {
                    return throwError(error);
                }
                return new BehaviorSubject(null) as any;
            }),
        );
    }
}
