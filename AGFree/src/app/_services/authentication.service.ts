import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { getApiUrl } from "../_helpers/utils";
import { User } from "../_models/User";

const httpOptions = {
    headers: new HttpHeaders({
        "Content-Type": "application/json",
    }),
};

@Injectable({ providedIn: "root" })
export class AuthenticationService {
    public currentUser: Observable<User>;
    private currentUserSubject: BehaviorSubject<User>;

    constructor(private http: HttpClient) {
        this.currentUserSubject = new BehaviorSubject<User>(
            JSON.parse(sessionStorage.getItem("currentUser")),
        );
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    public login(username: string, password: string): Observable<User> {
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
                map((user) => {
                    // login successful if there's a jwt token in the response
                    if (user && user.token) {
                        // store user details and jwt token in local storage to
                        // keep user logged in between page refreshes
                        sessionStorage.setItem(
                            "currentUser",
                            JSON.stringify(user),
                        );
                        this.saveJwtToken(user);
                        this.currentUserSubject.next(user);
                    }

                    return user;
                }),
            );
    }

    public saveJwtToken(user: Record<string, any>): void {
        sessionStorage.setItem("jwt_token", user.token);
    }

    public logout(): void {
        // remove user from local storage to log user out
        sessionStorage.removeItem("currentUser");
        this.currentUserSubject.next(null);
    }
}
