import { ChangeDetectorRef, Component, inject } from "@angular/core";
import { ApiService } from "../api.service";
import { MatCardModule } from "@angular/material/card";
import { CommonModule } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { Router } from "@angular/router";
import { MatInputModule } from "@angular/material/input";
import {
	Form,
	FormControl,
	FormGroup,
	FormsModule,
	ReactiveFormsModule,
} from "@angular/forms";
import { debounceTime } from "rxjs/operators";
import { MatIconModule } from "@angular/material/icon";

@Component({
	selector: "app-home-page-component",
	imports: [
		MatCardModule,
		CommonModule,
		MatButtonModule,
		MatInputModule,
		FormsModule,
		ReactiveFormsModule,
		MatIconModule,
	],
	templateUrl: "./home-page-component.html",
})
export class HomePageComponent {
	eventsRenderLimit = 3;
	events: any[] = [];
	router: Router = inject(Router);
	pages: number = 1;
	pagesArr: Array<number> = [];
	currentPage: number = 1;
	searchStr: string = "";
	isSearching: boolean = false;
	searchForm: FormGroup;

	ngOnInit(): void {
		this.searchForm.valueChanges
			.pipe(debounceTime(800))
			.subscribe((searchValue: any) => {
				this.searchStr = searchValue.searchControl;
				if (this.searchStr === "") {
					this.isSearching = false;
					this.cdr.detectChanges();
					return this.changePage(1);
				}
				this.changeSearchPage(1);
			});
	}

	constructor(
		private apiService: ApiService,
		private cdr: ChangeDetectorRef
	) {
		this.searchForm = new FormGroup({
			searchControl: new FormControl(""),
		});
		this.changePage(1);
	}

	changePage(page: number) {
		this.apiService
			.fetchEventsByPage(page, this.eventsRenderLimit)
			.subscribe({
				next: (res) => {
					this.pagesArr = [];
					for (let i = 1; i <= res.pages; i++) {
						this.pagesArr.push(i);
					}
					this.currentPage = page;
					this.events = res.events;
					this.cdr.detectChanges();
				},
				error: (error) => {
					if (error.error.error.includes("Invalid token")) {
						this.router.navigate(["/logout"]);
					}
					console.error("Error fetching events:", error);
				},
			});
	}

	eventClicked(index: number) {
		this.router.navigate(["/event"], {
			state: {
				eventTitle: this.events[index].title,
			},
		});
	}

	changeSearchPage(page: number) {
		this.apiService
			.searchEvents(this.searchStr, page, this.eventsRenderLimit)
			.subscribe({
				next: (res) => {
					this.isSearching = true;
					this.pagesArr = [];
					for (let i = 1; i <= res.pages; i++) {
						this.pagesArr.push(i);
					}
					this.currentPage = page;
					this.events = res.events;
					this.cdr.detectChanges();
				},
				error: (error) => {
					if (error.error.error.includes("Invalid token")) {
						this.router.navigate(["/logout"]);
					}
					console.error("Error fetching events:", error);
				},
			});
	}

	clearSearch() {
		this.searchForm.get("searchControl")?.setValue("");
	}
}
