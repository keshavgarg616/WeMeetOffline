import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	inject,
} from "@angular/core";
import { ApiService } from "../api.service";
import { MatCardModule } from "@angular/material/card";
import { CommonModule } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { Router } from "@angular/router";
import { MatInputModule } from "@angular/material/input";
import { provideNativeDateAdapter } from "@angular/material/core";
import {
	FormControl,
	FormGroup,
	FormsModule,
	ReactiveFormsModule,
} from "@angular/forms";
import { debounceTime } from "rxjs/operators";
import { MatIconModule } from "@angular/material/icon";
import { MatDatepickerModule } from "@angular/material/datepicker";

@Component({
	selector: "app-home-page-component",
	providers: [provideNativeDateAdapter()],
	imports: [
		MatCardModule,
		CommonModule,
		MatButtonModule,
		MatInputModule,
		FormsModule,
		ReactiveFormsModule,
		MatIconModule,
		MatDatepickerModule,
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
	userPfp: string = "";
	userName: string = "";
	beginsAtFilter: Date = new Date(0);
	endsAtFilter: Date = new Date();

	range = new FormGroup({
		start: new FormControl<Date | null>(null),
		end: new FormControl<Date | null>(null),
	});

	ngOnInit(): void {
		this.searchForm.valueChanges
			.pipe(debounceTime(800))
			.subscribe((searchValue: any) => {
				this.searchStr = searchValue.searchControl;
				this.changePage(1);
			});
		this.range.valueChanges.pipe(debounceTime(800)).subscribe(() => {
			this.beginsAtFilter = this.range.value.start ?? new Date(0);
			this.endsAtFilter = this.range.value.end ?? new Date();
			if (
				!this.range.controls.start.value ||
				!this.range.controls.end.value ||
				this.range.controls.start.hasError("matStartDateInvalid") ||
				this.range.controls.start.hasError("matDatepickerParse") ||
				this.range.controls.end.hasError("matEndDateInvalid") ||
				this.range.controls.end.hasError("matDatepickerParse")
			) {
				this.beginsAtFilter = new Date(0);
				this.endsAtFilter = new Date();
			} else {
				this.changePage(1);
			}
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
		this.apiService.getUserProfile().subscribe({
			next: (res) => {
				this.userPfp = res.pfp;
				this.userName = res.name;
				this.cdr.detectChanges();
			},
			error: (error) => {
				if (error.error.error.includes("Invalid token")) {
					this.router.navigate(["/logout"]);
				}
				console.error("Error fetching user profile:", error);
			},
		});
	}

	changePage(page: number) {
		this.isSearching = this.searchStr !== "";
		this.apiService
			.searchEvents(
				this.searchStr,
				page,
				this.eventsRenderLimit,
				this.beginsAtFilter,
				this.endsAtFilter
			)
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

	clearSearch() {
		this.searchForm.get("searchControl")?.setValue("");
	}

	clearStartDate() {
		this.range.get("start")?.setValue(null);
	}

	clearEndDate() {
		this.range.get("end")?.setValue(null);
	}
}
