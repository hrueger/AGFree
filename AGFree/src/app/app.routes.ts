import { Routes } from "@angular/router";
import { GroupsComponent } from "./_components/groups/groups.component";
import { LoginComponent } from "./_components/login/login.component";
import { UsersComponent } from "./_components/users/users.component";
import { AuthGuard } from "./_guards/auth.guard";
import { MyScheduleComponent } from "./_components/my-schedule/my-schedule.component";
import { PrivacyPolicyComponent } from "./_components/privacy-policy/privacy-policy.component";

export const routes: Routes = [
    {
        canActivate: [AuthGuard],
        component: MyScheduleComponent,
        path: "schedule",
    },
    {
        canActivate: [AuthGuard],
        component: UsersComponent,
        path: "users",
    },
    {
        canActivate: [AuthGuard],
        component: GroupsComponent,
        path: "groups",
    },
    { path: "privacy-policy", component: PrivacyPolicyComponent },
    /* Authentication paths */
    { path: "login", component: LoginComponent },
    { path: "resetPassword/:resetPasswordToken", component: LoginComponent },
    // otherwise redirect to home
    { path: "**", redirectTo: "/schedule" },
];
