import { Routes } from "@angular/router";
import { GroupsComponent } from "./_components/groups/groups.component";
import { LoginComponent } from "./_components/login/login.component";
import { UsersComponent } from "./_components/users/users.component";
import { AuthGuard } from "./_guards/auth.guard";
import { MyScheduleComponent } from "./_components/my-schedule/my-schedule.component";
import { UnsavedDataGuard } from "./_guards/unsaved-data.guard";

export const routes: Routes = [
    {
        canActivate: [AuthGuard],
        canDeactivate: [UnsavedDataGuard],
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
    /* Authentication paths */
    { path: "login", component: LoginComponent },
    { path: "resetPassword/:resetPasswordToken", component: LoginComponent },
    // otherwise redirect to home
    { path: "**", redirectTo: "/schedule" },
];
