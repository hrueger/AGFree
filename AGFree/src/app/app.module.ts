/* eslint-disable no-use-before-define */
import {
    CommonModule, DatePipe, Location, registerLocaleData,
} from "@angular/common";

import { HTTP_INTERCEPTORS, HttpClientModule, HttpClient } from "@angular/common/http";
import localeDe from "@angular/common/locales/de";
import { LOCALE_ID, NgModule } from "@angular/core";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";

import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgbModule, NgbModalModule } from "@ng-bootstrap/ng-bootstrap";

import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { ToastrModule } from "ngx-toastr";
import { GroupsComponent } from "./_components/groups/groups.component";
import { LoginComponent } from "./_components/login/login.component";
import { NavbarComponent } from "./_components/navbar/navbar.component";
import { UsersComponent } from "./_components/users/users.component";
import { ErrorInterceptor } from "./_helpers/error.interceptor";
import { JwtInterceptor } from "./_helpers/jwt.interceptor";
import { RenewJwtTokenInterceptor } from "./_helpers/renewJwtToken.interceptor";
import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";
import { MyScheduleComponent } from "./_components/my-schedule/my-schedule.component";
import { ScheduleComponent } from "./_components/schedule/schedule.component";
import { PrivacyPolicyComponent } from "./_components/privacy-policy/privacy-policy.component";
import { ScheduleModalComponent } from "./_components/_mobile/schedule-modal/schedule-modal.component";

registerLocaleData(localeDe);

@NgModule({
    bootstrap: [AppComponent],
    declarations: [
        AppComponent,
        LoginComponent,
        UsersComponent,
        NavbarComponent,
        GroupsComponent,
        MyScheduleComponent,
        ScheduleComponent,
        PrivacyPolicyComponent,
        ScheduleModalComponent,
    ],
    imports: [
        AppRoutingModule,
        BrowserAnimationsModule,
        BrowserModule,
        NgbModule,
        BrowserModule,
        ReactiveFormsModule,
        HttpClientModule,
        CommonModule,
        NgbModalModule,
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        ToastrModule.forRoot(),
        TranslateModule.forRoot({
            loader: {
                deps: [HttpClient],
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
            },
        }),
    ],
    providers: [
        Location,
        DatePipe,
        {
            provide: LOCALE_ID,
            useValue: "de-DE",
        },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: RenewJwtTokenInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    ],
})
export class AppModule { }

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
    return new TranslateHttpLoader(http, "/assets/i18n/", ".json");
}
