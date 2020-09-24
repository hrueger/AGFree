import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Title } from "@angular/platform-browser";
import { ActivatedRoute, Router } from "@angular/router";
import { first } from "rxjs/operators";
import { AlertService } from "../../_services/alert.service";
import { AuthenticationService } from "../../_services/authentication.service";
import { RemoteService } from "../../_services/remote.service";

@Component({
    styleUrls: ["./login.component.scss"],
    templateUrl: "login.component.html",
})
export class LoginComponent implements OnInit {
    public loginForm: FormGroup;
    public resetPasswordForm: FormGroup;
    public inputNewPasswordForm: FormGroup;
    public createUserForm: FormGroup;

    public loading = false;

    public submitted = false;
    public rpSubmitted = false;
    public inpSubmitted = false;
    public cuSubmitted = false;

    public resetPassword = false;
    public inputNewPassword = false;
    public createUser = false;

    public passwordResetSucceeded = false;
    public inputNewPasswordSucceeded = false;
    public createUserSucceeded = false;

    public returnUrl: string;

    constructor(
        private title: Title,
        private formBuilder: FormBuilder,
        private router: Router,
        private authenticationService: AuthenticationService,
        private alertService: AlertService,
        private remoteService: RemoteService,
        private route: ActivatedRoute,
    ) {}

    public ngOnInit(): void {
        if (this.authenticationService.currentUserValue) {
            this.router.navigate(["/"]);
            return;
        }
        this.title.setTitle("AGFree");
        this.loginForm = this.formBuilder.group({
            password: ["", Validators.required],
            username: ["", Validators.required],
        });
        this.createUserForm = this.formBuilder.group({
            username: ["", [Validators.required, Validators.pattern(/^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+ [a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+/)]],
            password: ["", Validators.required],
            password2: ["", Validators.required],
            email: ["", [Validators.required, Validators.email]],
        });
        this.resetPasswordForm = this.formBuilder.group({
            email: ["", [Validators.required, Validators.email]],
        });
        this.inputNewPasswordForm = this.formBuilder.group({
            password1: ["", Validators.required],
            password2: ["", Validators.required],
        });

        this.returnUrl = this.route.snapshot.queryParams.returnUrl || "/";

        if (this.route.snapshot.params.resetPasswordToken) {
            this.inputNewPassword = true;
        }
    }

    // convenience getter for easy access to form fields
    get f(): any {
        return this.loginForm.controls;
    }
    get rpf(): any {
        return this.resetPasswordForm.controls;
    }
    get inpf(): any {
        return this.inputNewPasswordForm.controls;
    }
    get cuf(): any {
        return this.createUserForm.controls;
    }

    public onSubmit(): void {
        this.submitted = true;

        // stop here if form is invalid
        if (this.loginForm.invalid) {
            return;
        }

        this.loading = true;
        this.authenticationService
            .login(this.f.username.value, this.f.password.value)
            .pipe(first())
            .subscribe(
                () => {
                    this.router.navigate([this.returnUrl]);
                    // this.router.navigate(['dashboard'], { skipLocationChange: false });
                    // location.reload();
                },
                (error) => {
                    this.alertService.error(error);
                    this.loading = false;
                },
            );
    }

    public onSubmitResetPassword(): void {
        this.rpSubmitted = true;

        // stop here if form is invalid
        if (this.resetPasswordForm.invalid) {
            return;
        }

        this.loading = true;
        this.remoteService.get(`auth/passwordReset/${this.rpf.email.value}`).subscribe((data) => {
            this.loading = false;
            if (data.status == true) {
                this.passwordResetSucceeded = true;
            }
        });
    }

    public onSubmitNewPassword(): void {
        this.rpSubmitted = true;

        // stop here if form is invalid
        if (this.inputNewPasswordForm.invalid) {
            return;
        }

        this.loading = true;
        this.remoteService.post(`auth/passwordReset/${this.route.snapshot.params.resetPasswordToken}`, {
            password1: this.inpf.password1.value,
            password2: this.inpf.password2.value,
        }).subscribe((data) => {
            this.loading = false;
            if (data.status == true) {
                this.inputNewPasswordSucceeded = true;
            }
        });
    }

    public onSubmitCreateUser(): void {
        this.cuSubmitted = true;

        // stop here if form is invalid
        if (this.createUserForm.invalid) {
            return;
        }

        this.loading = true;
        this.remoteService.post("users", {
            password1: this.cuf.password.value,
            password2: this.cuf.password2.value,
            username: this.cuf.username.value,
            email: this.cuf.email.value,
        }).subscribe((data) => {
            this.loading = false;
            if (data.success == true) {
                this.createUserSucceeded = true;
            }
        });
    }
}
