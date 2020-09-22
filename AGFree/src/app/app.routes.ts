import { Routes } from "@angular/router";
import { HomeComponent } from "./_components/home/home.component";
import { LoginComponent } from "./_components/login/login.component";
import { UsersComponent } from "./_components/users/users.component";
import { AuthGuard } from "./_guards/auth.guard";
import { EditorComponent } from "./_components/editor/editor.component";
import { UnsavedDataGuard } from "./_guards/unsaved-data.guard";

export const routes: Routes = [
    {
        canActivate: [AuthGuard],
        canDeactivate: [UnsavedDataGuard],
        component: EditorComponent,
        path: "editor",
    },
    {
        canActivate: [AuthGuard],
        component: UsersComponent,
        path: "users",
    },
    {
        canActivate: [AuthGuard],
        component: HomeComponent,
        path: "home",
    },
    /* Authentication paths */
    { path: "login", component: LoginComponent },
    { path: "resetPassword/:resetPasswordToken", component: LoginComponent },
    // otherwise redirect to home
    { path: "**", redirectTo: "/home" },
];
