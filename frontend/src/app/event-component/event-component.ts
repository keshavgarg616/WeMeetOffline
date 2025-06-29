import { ChangeDetectorRef, Component, inject } from "@angular/core";
import { ApiService } from "../api.service";
import { Router } from "@angular/router";
import { CommonModule } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { firstValueFrom } from "rxjs";
import { User } from "../../interfaces/userInterface";
import { Event } from "../../interfaces/eventInterface";

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
	hasRequestedToAttend: boolean = false;
	attendeeIds: User[] = [];
	requestedAttendeeIds: User[] = [];
	address: string = "";
	canViewAttendees: boolean = false;

	constructor(
		private apiService: ApiService,
		private cdr: ChangeDetectorRef
	) {
		this.router = inject(Router);
		this.init();
	}

	async init() {
		const nav = this.router.getCurrentNavigation();
		const state = nav?.extras?.state as {
			eventTitle: string;
		};
		if (state === null || state === undefined) {
			this.router.navigate(["/home"]);
			return;
		}
		this.title = state.eventTitle ?? "";
		if (!this.title) {
			this.router.navigate(["/home"]);
			return;
		}

		try {
			this.event = await firstValueFrom(
				this.apiService.getEventByTitle(this.title)
			);
			this.isRegistered = (
				await firstValueFrom(
					this.apiService.isRegisteredForEvent(this.title)
				)
			).isRegistered;
			this.isOrganizer = (
				await firstValueFrom(
					this.apiService.isOrganizerOfEvent(this.title)
				)
			).isOrganizer;
			this.hasRequestedToAttend = (
				await firstValueFrom(
					this.apiService.hasRequestedToAttend(this.title)
				)
			).hasRequested;

			if (this.isRegistered || this.isOrganizer) {
				const res = await firstValueFrom(
					this.apiService.getAddressAndAttendees(this.title)
				);
				this.address = res.address;
				this.attendeeIds = res.attendees;
				this.canViewAttendees = true;
				if (this.isOrganizer) {
					this.requestedAttendeeIds = res.requestedAttendees;
				}
			}
			this.cdr.detectChanges();
		} catch (err: any) {
			if (err.error?.error?.includes("Invalid token")) {
				this.router.navigate(["/logout"]);
			}
		}
	}

	registerForEvent() {
		this.apiService.registerForEvent(this.title).subscribe({
			next: (response) => {
				if (response.error) {
					console.error("Error registering for event");
				} else {
					this.hasRequestedToAttend = true;
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
					this.hasRequestedToAttend = false;
					this.isRegistered = false;
					this.canViewAttendees = false;
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

	removeAttendee(attendeeId: string) {
		this.apiService.removeAttendee(this.title, attendeeId).subscribe({
			next: (response) => {
				if (response.error) {
					console.error("Error removing attendee");
				} else {
					this.attendeeIds = this.attendeeIds.filter(
						(attendee) => attendee._id !== attendeeId
					);
					this.cdr.detectChanges();
				}
			},
			error: (err) => {
				if (err.error.error.includes("Invalid token")) {
					this.router.navigate(["/logout"]);
				}
				console.error("Error removing attendee: ", err);
			},
		});
	}

	removeRequestedAttendee(attendeeId: string) {
		this.apiService.removeAttendee(this.title, attendeeId).subscribe({
			next: (response) => {
				if (response.error) {
					console.error("Error removing attendee");
				} else {
					this.requestedAttendeeIds =
						this.requestedAttendeeIds.filter(
							(attendee) => attendee._id !== attendeeId
						);
					this.cdr.detectChanges();
				}
			},
			error: (err) => {
				if (err.error.error.includes("Invalid token")) {
					this.router.navigate(["/logout"]);
				}
				console.error("Error removing attendee: ", err);
			},
		});
	}

	approveAttendee(attendeeId: string) {
		this.apiService.approveAttendee(this.title, attendeeId).subscribe({
			next: (response) => {
				this.attendeeIds = this.attendeeIds.concat(
					this.requestedAttendeeIds.filter(
						(attendee) => attendee._id === attendeeId
					)
				);
				this.requestedAttendeeIds = this.requestedAttendeeIds.filter(
					(attendee) => attendee._id !== attendeeId
				);
				this.cdr.detectChanges();
			},
			error: (err) => {
				if (err.error.error.includes("Invalid token")) {
					this.router.navigate(["/logout"]);
				}
				console.error("Error accepting attendee: ", err);
			},
		});
	}

	editEvent() {
		this.router.navigate(["/edit-event"], {
			state: { eventTitle: this.title },
		});
	}

	deleteEvent() {
		this.apiService.deleteEvent(this.title).subscribe({
			next: (response) => {
				if (response.error) {
					console.error("Error deleting event");
				} else {
					this.router.navigate(["/home"]);
				}
			},
			error: (err) => {
				if (err.error.error.includes("Invalid token")) {
					this.router.navigate(["/logout"]);
				}
				console.error("Error deleting event: ", err);
			},
		});
	}
}
