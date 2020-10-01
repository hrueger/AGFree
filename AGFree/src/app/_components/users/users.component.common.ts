import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { User } from "../../_models/User";
import { AlertService } from "../../_services/alert.service";
import { AuthenticationService } from "../../_services/authentication.service";
import { FastTranslateService } from "../../_services/fast-translate.service";
import { RemoteService } from "../../_services/remote.service";

@Component({ template: "" })
export class UsersComponentCommon implements OnInit {
    public users: User[] = [];

    public searchTerm = "";

    public newUserForm: FormGroup;
    public editUserForm: FormGroup;
    public name: string;
    public email: string;
    public isAdmin: boolean;
    public password1: string;
    public password2: string;
    public invalidMessage = false;
    public editUserName: any;
    public editUserEmail: any;
    public editUserPasswordOld: any;
    public editUserPassword1: any;
    public editUserPassword2: any;

    public sendingMail: boolean;

    constructor(
        public authenticationService: AuthenticationService,
        private remoteService: RemoteService,
        private modalService: NgbModal,
        private fb: FormBuilder,
        private alertService: AlertService,
        private fts: FastTranslateService,
    ) { }

    public searchUsers(): any[] {
        if (this.searchTerm.trim() == "") {
            return this.users;
        }
        return this.users.filter(
            (u) => u.username.toLowerCase().indexOf(this.searchTerm.trim().toLowerCase()) !== -1,
        );
    }

    public ngOnInit(): void {
        this.loadUsers();
        this.createForms();
    }

    public loadUsers(): void {
        this.remoteService.get("users/").subscribe((data) => {
            this.users = data;
        });
    }

    public createForms(): void {
        this.newUserForm = this.fb.group({
            email: [this.email, [Validators.required]],
            name: [this.name, [Validators.required]],
            password1: [this.password1, [Validators.required]],
            password2: [this.password2, [Validators.required]],
            isAdmin: [this.isAdmin, []],
        });
        this.editUserForm = this.fb.group({
            editUserEmail: [this.editUserEmail, [Validators.required]],
            editUserName: [this.editUserName, [Validators.required]],
            editUserPassword1: [this.editUserPassword1, []],
            editUserPassword2: [this.editUserPassword2, []],
            editUserPasswordOld: [this.editUserPasswordOld, [Validators.required]],
        });

        this.editUserForm
            .get("editUserName")
            .setValue(
                this.authenticationService.currentUserValue.username,
            );
        this.editUserForm
            .get("editUserEmail")
            .setValue(this.authenticationService.currentUserValue.email);
    }

    public openEditModal(content: unknown): void {
        this.modalService
            .open(content)
            .result.then(
                () => {
                    this.invalidMessage = false;
                    let pwnew1val = "";
                    if (this.editUserForm.get("editUserPassword1")) {
                        pwnew1val = this.editUserForm.get("editUserPassword1")
                            .value;
                    }
                    let pwnew2val = "";
                    if (this.editUserForm.get("editUserPassword1")) {
                        pwnew2val = this.editUserForm.get("editUserPassword2")
                            .value;
                    }
                    this.remoteService.post("users/edit", {
                        email: this.editUserForm.get("editUserEmail").value,
                        pwNew: pwnew1val,
                        pwNew2: pwnew2val,
                        pwOld: this.editUserForm.get(
                            "editUserPasswordOld",
                        ).value,
                        username: this.editUserForm.get("editUserName")
                            .value,
                    })
                        .subscribe(async (data) => {
                            if (data && data.success == true) {
                                this.alertService.success(await this.fts.t("users.currentUserUpdatedSuccessfully"));
                                this.remoteService
                                    .get("users/")
                                    .subscribe((res) => {
                                        this.users = res;
                                    });
                            }
                        });
                },
            );
    }

    public sendCompleteProfileMail(): void {
        const users = this.users.filter((u) => !(u?.data
            && Array.isArray(u.data) && u.data.length > 0));
        if (users.length == 0) {
            // eslint-disable-next-line no-alert
            alert("Keine Benutzer ohne ausgefüllten Stundenplan!");
            return;
        }
        // eslint-disable-next-line
        if (confirm("Möchstest du wirklich eine Erinnerungsmail an die folgenden Benutzer ohne ausgefüllten Stundenplan verschicken, dass sie ihr Profil vervollständigen sollen?\n\n" + users.map((u) => u.username).join("\n"))) {
            this.sendingMail = true;
            this.remoteService.post("users/sendCompleteProfileMail", {}).subscribe((d) => {
                this.sendingMail = false;
                if (d && d.success) {
                    this.alertService.success("Mail erfolgreich verschickt");
                }
            });
        }
    }

    public async deleteUser(user: User): Promise<void> {
        // eslint-disable-next-line
        if (confirm(await this.fts.t("users.confirmDelete")) == true) {
            this.remoteService
                .delete(`users/${user.id}`)
                .subscribe(async (data) => {
                    if (data && data.success == true) {
                        this.alertService.success(await this.fts.t("users.userDeletedSuccessfully"));
                        this.remoteService
                            .get("users/")
                            .subscribe((res) => {
                                this.users = res;
                            });
                    }
                });
        }
    }

    public changeAdminStatus(user: User, willBeAdmin: boolean): void {
        // eslint-disable-next-line
        if (confirm(willBeAdmin ? `Soll" ${user.username}" wirklich zum Administrator gemacht werden?` : `Soll "${user.username}" wirklich kein Administrator mehr sein?`)) {
            this.remoteService.post(`users/${user.id}/admin`, { admin: willBeAdmin }).subscribe((data) => {
                if (data && data.success) {
                    this.alertService.success(willBeAdmin ? "Benutzer erfolgreich zum Admin gemacht!" : "Adminstatus erfolgreich entfernt!");
                    this.loadUsers();
                }
            });
        }
    }
}
