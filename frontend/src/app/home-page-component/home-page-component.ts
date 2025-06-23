import { ChangeDetectorRef, Component } from "@angular/core";
import { ApiService } from "../api.service";
import { MatCardModule } from "@angular/material/card";
import { CommonModule } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";

@Component({
	selector: "app-home-page-component",
	imports: [MatCardModule, CommonModule, MatButtonModule],
	templateUrl: "./home-page-component.html",
})
export class HomePageComponent {
	events: any[] = [];
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
				console.error("Error fetching events:", error);
			},
		});
	}
}
