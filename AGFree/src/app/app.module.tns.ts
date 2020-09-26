import { DatePipe } from "@angular/common";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import {
    CUSTOM_ELEMENTS_SCHEMA, LOCALE_ID, NgModule, NO_ERRORS_SCHEMA,
} from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import {
    NativeScriptModule,
    NativeScriptFormsModule,
    NativeScriptHttpClientModule,
} from "@nativescript/angular";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { NativeScriptLoader } from "@danvick/ngx-translate-nativescript-loader";
import { NativeScriptUISideDrawerModule } from "nativescript-ui-sidedrawer/angular";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { GroupsComponent } from "./_components/groups/groups.component";
import { LoginComponent } from "./_components/login/login.component";
import { MyScheduleComponent } from "./_components/my-schedule/my-schedule.component";
import { NavbarComponent } from "./_components/navbar/navbar.component";
import { PrivacyPolicyComponent } from "./_components/privacy-policy/privacy-policy.component";
import { ScheduleComponent } from "./_components/schedule/schedule.component";
import { UsersComponent } from "./_components/users/users.component";
import { ErrorInterceptor } from "./_helpers/error.interceptor";
import { JwtInterceptor } from "./_helpers/jwt.interceptor";
import { RenewJwtTokenInterceptor } from "./_helpers/renewJwtToken.interceptor";

function nativescriptTranslateLoaderFactory(): NativeScriptLoader {
    return new NativeScriptLoader("./assets/i18n/", ".json");
}

@NgModule({
    declarations: [
        AppComponent,
        GroupsComponent,
        UsersComponent,
        ScheduleComponent,
        MyScheduleComponent,
        LoginComponent,
        NavbarComponent,
        PrivacyPolicyComponent,
    ],
    imports: [
        NativeScriptModule,
        NativeScriptUISideDrawerModule,
        AppRoutingModule,
        NativeScriptFormsModule,
        ReactiveFormsModule,
        FormsModule,
        NativeScriptHttpClientModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: nativescriptTranslateLoaderFactory,
            },
            defaultLanguage: "de",
        }),
    ],
    providers: [
        DatePipe,
        {
            provide: LOCALE_ID,
            useValue: "de-DE",
        },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: RenewJwtTokenInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    ],
    bootstrap: [AppComponent],
    schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule { }
