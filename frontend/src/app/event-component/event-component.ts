import { ChangeDetectorRef, Component, inject } from "@angular/core";
import { ApiService } from "../api.service";
import { Router } from "@angular/router";
import { CommonModule } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { firstValueFrom } from "rxjs";
import { User } from "../../interfaces/userInterface";
import { Event } from "../../interfaces/eventInterface";
import { Comment } from "../../interfaces/commentInterface";
import { FormsModule } from "@angular/forms";
import { MatInputModule } from "@angular/material/input";
import { Clipboard } from "@angular/cdk/clipboard";
import { NewLineHTMLPipe } from "../../pipes/newLinePipe";

@Component({
	selector: "app-event-component",
	imports: [
		CommonModule,
		MatButtonModule,
		FormsModule,
		MatInputModule,
		NewLineHTMLPipe,
	],
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
	copied: boolean = false;
	comments: Comment[] = [];
	userId: string = "";
	newCommentText: string = "";
	replyText: string = "";
	commentEditText: string = "";
	replyEditText: string = "";

	constructor(
		private apiService: ApiService,
		private cdr: ChangeDetectorRef,
		private clipboard: Clipboard
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
			this.userId =
				(await firstValueFrom(this.apiService.getUserId())).userId ??
				"";
			this.event = await firstValueFrom(
				this.apiService.getEventByTitle(this.title)
			);
			const userStatus = await firstValueFrom(
				this.apiService.getUserStatus(this.title)
			);
			this.isOrganizer = userStatus.isOrganizer;
			this.isRegistered = userStatus.isRegistered;
			this.hasRequestedToAttend = userStatus.hasRequested;

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
				this.comments = await firstValueFrom(
					this.apiService.getComments(this.title)
				);
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
				if (err.error.error.includes("Phone number not verified")) {
					alert(
						"Please verify your phone number before registering for events."
					);
					return;
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
				this.router.navigate(["/home"]);
			},
			error: (err) => {
				if (err.error.error.includes("Invalid token")) {
					this.router.navigate(["/logout"]);
				}
				console.error("Error deleting event: ", err);
			},
		});
	}

	addComment(comment: string) {
		this.apiService.addComment(this.title, comment).subscribe({
			next: (response) => {
				this.newCommentText = "";
				this.comments = response.comments;
				this.cdr.detectChanges();
			},
			error: (err) => {
				if (err.error.error.includes("Invalid token")) {
					this.router.navigate(["/logout"]);
				}
				console.error("Error adding comment: ", err);
			},
		});
	}

	addReply(commentId: string, reply: string) {
		this.apiService.addReply(this.title, commentId, reply).subscribe({
			next: (response) => {
				this.comments = response.comments;
				this.cdr.detectChanges();
			},
			error: (err) => {
				if (err.error.error.includes("Invalid token")) {
					this.router.navigate(["/logout"]);
				}
				console.error("Error adding reply: ", err);
			},
		});
	}

	editComment(commentId: string, newText: string) {
		this.apiService.editComment(this.title, commentId, newText).subscribe({
			next: (response) => {
				this.comments = response.comments;
				this.cdr.detectChanges();
			},
			error: (err) => {
				if (err.error.error.includes("Invalid token")) {
					this.router.navigate(["/logout"]);
				}
				console.error("Error adding reply: ", err);
			},
		});
	}

	editReply(commentId: string, replyId: string, newText: string) {
		this.apiService
			.editReply(this.title, commentId, replyId, newText)
			.subscribe({
				next: (response) => {
					this.comments = response.comments;
					this.cdr.detectChanges();
				},
				error: (err) => {
					if (err.error.error.includes("Invalid token")) {
						this.router.navigate(["/logout"]);
					}
					console.error("Error adding reply: ", err);
				},
			});
	}

	deleteComment(commentId: string) {
		this.apiService.deleteComment(this.title, commentId).subscribe({
			next: (response) => {
				this.comments = response.comments;
				this.cdr.detectChanges();
			},
			error: (err) => {
				if (err.error.error.includes("Invalid token")) {
					this.router.navigate(["/logout"]);
				}
				console.error("Error adding reply: ", err);
			},
		});
	}

	deleteReply(commentId: string, replyId: string) {
		this.apiService.deleteReply(this.title, commentId, replyId).subscribe({
			next: (response) => {
				this.comments = response.comments;
				this.cdr.detectChanges();
			},
			error: (err) => {
				if (err.error.error.includes("Invalid token")) {
					this.router.navigate(["/logout"]);
				}
				console.error("Error adding reply: ", err);
			},
		});
	}

	showAddReplyInput(commentId: string) {
		const div = document.getElementById(`${commentId}AddReplyDiv`);
		this.replyText = "";
		for (const comment of this.comments) {
			const divToHide = document.getElementById(
				`${comment._id}AddReplyDiv`
			);
			if (divToHide && divToHide.id !== `${commentId}AddReplyDiv`) {
				divToHide.hidden = true;
			}
		}
		if (div) {
			div.hidden = !div.hidden;
		}
	}

	showEditCommentInput(commentId: string) {
		const div = document.getElementById(`${commentId}EditCommentDiv`);
		const commentTextDiv = document.getElementById(
			`${commentId}CommentTextDiv`
		);
		this.commentEditText = "";
		for (const comment of this.comments) {
			const divToHide = document.getElementById(
				`${comment._id}EditCommentDiv`
			);
			const commentTextDivToShow = document.getElementById(
				`${comment._id}CommentTextDiv`
			);
			commentTextDivToShow!.hidden = false;
			if (divToHide && divToHide.id !== `${commentId}EditCommentDiv`) {
				divToHide.hidden = true;
			}
		}
		if (div) {
			div.hidden = !div.hidden;
			this.commentEditText = commentTextDiv?.textContent || "";
			commentTextDiv!.hidden = !div.hidden;
		}
	}

	showEditReplyInput(commentId: string, replyId: string) {
		const div = document.getElementById(
			`${commentId}${replyId}EditReplyDiv`
		);
		const replyTextDiv = document.getElementById(
			`${commentId}${replyId}ReplyTextDiv`
		);
		this.replyEditText = "";
		for (const comment of this.comments) {
			for (const reply of comment.replies ?? []) {
				const divToHide = document.getElementById(
					`${comment._id}${reply._id}EditReplyDiv`
				);
				const replyTextDivToShow = document.getElementById(
					`${comment._id}${reply._id}ReplyTextDiv`
				);
				replyTextDivToShow!.hidden = false;
				if (
					divToHide &&
					divToHide.id !== `${commentId}${replyId}EditReplyDiv`
				) {
					divToHide.hidden = true;
				}
			}
		}
		if (div) {
			div.hidden = !div.hidden;
			this.replyEditText = replyTextDiv?.textContent || "";
			replyTextDiv!.hidden = !div.hidden;
		}
	}

	copyShareLink() {
		this.copied = true;
		this.cdr.detectChanges();
		let shareStr =
			`${window.location.origin}/share/${this.title}`.replaceAll(
				" ",
				"%20"
			);
		this.clipboard.copy(shareStr);
		setTimeout(() => {
			this.copied = false;
			this.cdr.detectChanges();
		}, 2000);
	}
}
