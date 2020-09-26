import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import {
    NativeScriptModule,
    NativeScriptFormsModule,
    NativeScriptHttpClientModule,
} from "@nativescript/angular";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { GroupsComponent } from "./_components/groups/groups.component";
import { LoginComponent } from "./_components/login/login.component";
import { MyScheduleComponent } from "./_components/my-schedule/my-schedule.component";
import { NavbarComponent } from "./_components/navbar/navbar.component";
import { PrivacyPolicyComponent } from "./_components/privacy-policy/privacy-policy.component";
import { ScheduleComponent } from "./_components/schedule/schedule.component";
import { UsersComponent } from "./_components/users/users.component";

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
        AppRoutingModule,
        NativeScriptFormsModule,
        ReactiveFormsModule,
        FormsModule,
        NativeScriptHttpClientModule,
    ],
    providers: [],
    bootstrap: [AppComponent],
    schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule { }
