import { Injectable } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { FastTranslateService } from "./fast-translate.service";

@Injectable({ providedIn: "root" })
export class AlertService {
  private readonly timeouts = {
      error: 3000,
      info: 3000,
      success: 3000,
      warning: 3000,
  };
  constructor(private toastr: ToastrService, private fts: FastTranslateService) {
  }

  public async success(message: string): Promise<void> {
      this.toastr.success(message, `${await this.fts.t("general.success")}!`, { timeOut: this.timeouts.success });
  }

  public async error(message: string): Promise<void> {
      this.toastr.error(message, `${await this.fts.t("general.error")}!`, { timeOut: this.timeouts.error });
  }

  public async info(message: string): Promise<void> {
      this.toastr.info(message, `${await this.fts.t("general.info")}:`, { timeOut: this.timeouts.info });
  }

  public async warning(message: string): Promise<void> {
      this.toastr.warning(message, `${await this.fts.t("general.warning")}!`, { timeOut: this.timeouts.warning });
  }

  public snackbar(message: string): void {
      this.info(message);
  }
}
