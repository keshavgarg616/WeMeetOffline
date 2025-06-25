import { ChangeDetectorRef, Component, inject } from "@angular/core";
import { ApiService } from "../api.service";
import { Router } from "@angular/router";
import { CommonModule } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";

@Component({
	selector: "app-event-component",
	imports: [CommonModule, MatButtonModule],
	templateUrl: "./event-component.html",
	standalone: true,
})
export class EventComponent {
	event: Event | null = null;
	router: Router = inject(Router);
	title: string = "";
	isRegistered: boolean = false;
	isOrganizer: boolean = false;
	constructor(
		private apiService: ApiService,
		private cdr: ChangeDetectorRef
	) {
		this.router = inject(Router);
		const nav = this.router.getCurrentNavigation();
		const state = nav?.extras?.state as {
			eventTitle: string;
		};
		if (state === null || state === undefined) {
			console.log("state is null/undefined");
			this.router.navigate(["/home"]);
			return;
		}
		this.title = state.eventTitle ?? "";
		if (!this.title) {
			console.log("title is blank");
			this.router.navigate(["/home"]);
			return;
		}
		this.apiService.getEventByTitle(this.title).subscribe({
			next: (response) => {
				if (response.error) {
					console.error("Error fetching event");
				} else {
					this.event = response;
					this.cdr.detectChanges();
				}
			},
			error: (err) => {
				if (err.error.error.includes("Invalid token")) {
					this.router.navigate(["/logout"]);
				}
				console.error("Error fetching event: ", err);
			},
		});
		this.apiService.isRegisteredForEvent(this.title).subscribe({
			next: (response) => {
				if (response.error) {
					console.error("Error checking registration status");
				} else {
					this.isRegistered = response.isRegistered;
					this.cdr.detectChanges();
				}
			},
			error(err) {
				console.error("Error checking registration status: ", err);
			},
		});
		this.apiService.isOrganizerOfEvent(this.title).subscribe({
			next: (response) => {
				if (response.error) {
					console.error("Error checking organizer status");
				} else {
					this.isOrganizer = response.isOrganizer;
					this.cdr.detectChanges();
				}
			},
			error(err) {
				console.error("Error checking organizer status: ", err);
			},
		});
	}

	registerForEvent() {
		this.apiService.registerForEvent(this.title).subscribe({
			next: (response) => {
				if (response.error) {
					console.error("Error registering for event");
				} else {
					this.isRegistered = true;
					this.cdr.detectChanges();
				}
			},
			error: (err) => {
				if (err.error.error.includes("Invalid token")) {
					this.router.navigate(["/logout"]);
				}
				console.error("Error registering for event: ", err);
			},
		});
	}

	leaveEvent() {
		this.apiService.unregisterFromEvent(this.title).subscribe({
			next: (response) => {
				if (response.error) {
					console.error("Error leaving event");
				} else {
					this.isRegistered = false;
					this.cdr.detectChanges();
				}
			},
			error: (err) => {
				if (err.error.error.includes("Invalid token")) {
					this.router.navigate(["/logout"]);
				}
				console.error("Error leaving event: ", err);
			},
		});
	}

	editEvent() {
		this.router.navigate(["/edit-event"], {
			state: { eventTitle: this.title },
		});
	}
}

interface User {
	_id: string;
	name: string;
	email: string;
	pfp: string;
}

interface Event {
	_id: string;
	title: string;
	description: string;
	beginsAt: Date;
	endsAt: Date;
	isVirtual: boolean;
	address: string;
	tags: string[];
	organizerId: User;
	attendeeIds: User[];
	timezone: string;
	picture: string;
	__v: number;
}
