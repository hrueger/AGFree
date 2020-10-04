import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { map } from "rxjs/operators";
import { getApiUrl } from "../_helpers/utils";
import { User } from "../_models/User";
import { RemoteService } from "./remote.service";
import { StorageService } from "./storage.service";

export class NoErrorToastHttpParams extends HttpParams {
    constructor(public dontShowToast: boolean) {
        super();
    }
}

const httpOptions = {
    headers: new HttpHeaders({
        "Content-Type": "application/json",
    }),
};

@Injectable({ providedIn: "root" })
export class AuthenticationService {
    public currentUser: User = null;

    constructor(
        private http: HttpClient,
        private storageService: StorageService,
        private remoteService: RemoteService,
    ) {}

    public login(username: string, password: string, rememberMe: boolean): Observable<User> {
        return this.http
            .post<any>(
                `${getApiUrl()}auth/login`,
                {
                    password,
                    username,
                },
                httpOptions,
            )
            .pipe(
                map((user) => this.loggedIn(user, rememberMe)),
            );
    }

    private loggedIn(user: User, rememberMe: boolean) {
        if (user) {
            this.currentUser = user;
            if (rememberMe) {
                this.saveJwtToken(user);
            }
        }
        return user;
    }

    public autoLogin(jwtToken: string): Subject<any> {
        const o = new Subject();
        this.remoteService.post("auth/renewToken", { jwtToken }, { params: new NoErrorToastHttpParams(true) }).subscribe((data) => {
            if (data && data.user) {
                this.loggedIn(data.user, true);
                o.next(true);
            } else {
                o.next(false);
            }
        }, () => {
            o.next(false);
        });
        return o;
    }

    public saveJwtToken(user: User): void {
        this.storageService.set("jwtToken", user.jwtToken);
    }

    public logout(): void {
        this.storageService.remove("jwtToken");
        this.currentUser = null;
    }
}
