import {
    HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { StorageService } from "../_services/storage.service";

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private storageService: StorageService) {}
    public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let token = this.storageService.getTemp("jwt_token");
        if (!token) {
            token = "";
        }
        const authReq = req.clone({
            headers: new HttpHeaders({
                authorization: token,
            }),
        });
        return next.handle(authReq);
    }
}
