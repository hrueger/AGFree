import {
    Component, EventEmitter, Input, Output,
} from "@angular/core";
import { Application, SearchBar, TextView } from "@nativescript/core";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";

@Component({
    selector: "navbar",
    styleUrls: ["./navbar.component.scss"],
    templateUrl: "./navbar.component.html",
})
export class NavbarComponent {
    @Input() public title = "AGView";
    @Input() public modal = false;
    @Input() public searchAvailable = false;
    @Input() public navbarItems: {
        text: string;
        id: string;
    }[] = [];
    @Output() public itemTap: EventEmitter<string> = new EventEmitter<string>();
    @Output() public modalBack: EventEmitter<void> = new EventEmitter<void>();
    @Output() public search = new EventEmitter<string | undefined>();
    public searchEnabled = false;
    public searchPhrase: string;
    public searchTerm = "";

    public focusSearch(e: {object: TextView}): void {
        e.object.focus();
    }

    public onTextChanged(args: { object: any; }): void {
        const searchBar = args.object as SearchBar;
        this.search.emit(searchBar.text);
    }

    public onDrawerButtonTap(): void {
        if (this.modal) {
            this.modalBack.emit();
            return;
        }
        if (this.searchEnabled) {
            this.searchEnabled = false;
            this.search.emit(undefined);
            return;
        }
        const sideDrawer = Application.getRootView() as RadSideDrawer;
        sideDrawer.showDrawer();
    }
}
