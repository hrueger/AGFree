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
    @Input() public navbarItems: {
        text: string;
        id: string;
    }[] = [];
    @Output() public itemTap: EventEmitter<string> = new EventEmitter<string>();
    onDrawerButtonTap(): void {
        const sideDrawer = Application.getRootView() as RadSideDrawer;
        sideDrawer.showDrawer();
    }
}
