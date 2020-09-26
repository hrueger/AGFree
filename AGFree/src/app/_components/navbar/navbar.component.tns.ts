import {
    Component, Input,
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
    onDrawerButtonTap(): void {
        const sideDrawer = Application.getRootView() as RadSideDrawer;
        sideDrawer.showDrawer();
    }
}
