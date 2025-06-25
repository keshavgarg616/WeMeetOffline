import { ChangeDetectorRef, Component, inject } from "@angular/core";
import { ApiService } from "../api.service";
import { MatCardModule } from "@angular/material/card";
import { CommonModule } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { Router } from "@angular/router";

@Component({
	selector: "app-home-page-component",
	imports: [MatCardModule, CommonModule, MatButtonModule],
	templateUrl: "./home-page-component.html",
})
export class HomePageComponent {
	events: any[] = [];
	router: Router = inject(Router);
	constructor(
		private apiService: ApiService,
		private cdr: ChangeDetectorRef
	) {
		this.apiService.getEvents().subscribe({
			next: (data) => {
				this.events = data;
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
}
