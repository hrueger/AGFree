import {
    Component, EventEmitter, Input, Output,
} from "@angular/core";
import { Application } from "@nativescript/core";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";

@Component({
    selector: "navbar",
    styleUrls: ["./navbar.component.scss"],
    templateUrl: "./navbar.component.html",
})
export class NavbarComponent {
    @Input() public title = "AGView";
    @Input() public modal = false;
    @Input() public navbarItems: {
        text: string;
        id: string;
    }[] = [];
    @Output() public itemTap: EventEmitter<string> = new EventEmitter<string>();
    @Output() public modalBack: EventEmitter<void> = new EventEmitter<void>();
    onDrawerButtonTap(): void {
        if (this.modal) {
            this.modalBack.emit();
            return;
        }
        const sideDrawer = Application.getRootView() as RadSideDrawer;
        sideDrawer.showDrawer();
    }
}
