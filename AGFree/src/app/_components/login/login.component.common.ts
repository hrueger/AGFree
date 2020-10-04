import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { StorageService } from "../../_services/storage.service";
import { AlertService } from "../../_services/alert.service";
import { AuthenticationService } from "../../_services/authentication.service";
import { RemoteService } from "../../_services/remote.service";

export const DATA_INFO = "Dies ist ein privater Service von Hannes Rüger. Hiermit willigen Sie ein, dass Ihre Daten verarbeitet und gespeichert werden. Sie können diese Einwilligung jederzeit schriftlich durch eine formlose Nachricht an <a href='mailto:ruegerhannes@gmail.com'>ruegerhannes@gmail.com</a> widerrufen, dann werden alle Ihre Daten gelöscht.";

@Component({ template: "" })
export class LoginComponentCommon implements OnInit {
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

    public tryingToAutoLogin = false;

    constructor(
        public formBuilder: FormBuilder,
        public router: Router,
        public authenticationService: AuthenticationService,
        public alertService: AlertService,
        private remoteService: RemoteService,
        private route: ActivatedRoute,
        private storageService: StorageService,
    ) {
        const jwtToken = this.storageService.get("jwtToken");
        const apiUrl = this.storageService.get("apiUrl");
        if (jwtToken && apiUrl) {
            this.tryingToAutoLogin = true;
            this.authenticationService.autoLogin(jwtToken).subscribe((success) => {
                if (success) {
                    if (this.route.snapshot.queryParams.returnUrl) {
                        this.router.navigate([this.route.snapshot.queryParams.returnUrl]);
                    } else {
                        this.router.navigate(["home"]);
                    }
                }
                this.tryingToAutoLogin = false;
            });
        }
    }

    public ngOnInit(): void {
        if (this.authenticationService.currentUser) {
            this.router.navigate(["/"]);
            return;
        }
        this.loginForm = this.formBuilder.group({
            password: ["", Validators.required],
            username: ["", Validators.required],
            rememberMe: [true],
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
            .login(this.f.username.value, this.f.password.value, this.f.rememberMe.value)
            .subscribe(
                () => {
                    this.router.navigate([this.returnUrl]);
                    // this.router.navigate(['dashboard'], { skipLocationChange: false });
                    // location.reload();
                },
                (error) => {
                    this.alertService.error(error || "Error");
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
            if (data.success == true) {
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
            if (data.success == true) {
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

        this.confirmPrivacyPolicy().then(() => {
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
        }, () => undefined);
    }

    public confirmPrivacyPolicy(): Promise<void> {
        return new Promise((resolve, reject) => {
            reject();
        });
    }
}
