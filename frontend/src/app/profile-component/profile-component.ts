import { ChangeDetectorRef, Component } from "@angular/core";
import { ApiService } from "../api.service";
import { CommonModule } from "@angular/common";
import profileEventsData from "../../interfaces/profileEventsInterface";
import { MatButtonModule } from "@angular/material/button";

@Component({
	selector: "app-profile-component",
	imports: [CommonModule, MatButtonModule],
	templateUrl: "./profile-component.html",
})
export class ProfileComponent {
	userName: string = "";
	userPfp: string = "";
	userEmail: string = "";
	createdEvents: Array<profileEventsData> = [];
	registeredEvents: Array<profileEventsData> = [];
	requestedEvents: Array<profileEventsData> = [];
	user = {};

	constructor(
		private apiService: ApiService,
		private cdr: ChangeDetectorRef
	) {
		this.apiService.getUserProfile().subscribe({
			next: (response) => {
				this.userName = response.name;
				this.userPfp = response.pfp;
				this.userEmail = response.email;

				this.createdEvents = response.eventsCreated || [];
				this.registeredEvents = response.eventsRegistered || [];
				this.requestedEvents = response.eventsRequestedToJoin || [];

				this.user = response ?? {};
				this.cdr.detectChanges();
			},
			error: (error) => {
				console.error("Error fetching user profile:", error);
			},
		});
	}
}
