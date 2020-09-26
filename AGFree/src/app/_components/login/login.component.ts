import { Component } from "@angular/core";
import Swal from "sweetalert2";
import { DATA_INFO, LoginComponentCommon } from "./login.component.common";

@Component({
    styleUrls: ["./login.component.scss"],
    templateUrl: "login.component.html",
})
export class LoginComponent extends LoginComponentCommon {
    public confirmPrivacyPolicy(): Promise<void> {
        return new Promise((resolve, reject) => {
            Swal.fire({
                title: "Datenverarbeitung",
                icon: "info",
                html: DATA_INFO,
                showConfirmButton: true,
                confirmButtonText: "Einverstanden",
                focusConfirm: false,
            }).then((r) => {
                if (r.isConfirmed) {
                    Swal.fire({
                        title: "Datenschutz",
                        icon: "info",
                        html: "Ich akzeptiere die <a target=\"_blank\" href=\"/privacy-policy\">Datenschutzvereinbarung</a>.",
                        showConfirmButton: true,
                        confirmButtonText: "Einverstanden",
                        focusConfirm: false,
                    }).then((s) => {
                        if (s.isConfirmed) {
                            resolve();
                        } else {
                            reject();
                        }
                    });
                } else {
                    reject();
                }
            });
        });
    }
}
