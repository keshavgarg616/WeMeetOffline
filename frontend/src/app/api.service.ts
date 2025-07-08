// api.service.ts
import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../environments/environment";
import { AppStateService } from "./app-state.service";

@Injectable({
	providedIn: "root",
})
export class ApiService {
	private apiUrl: string;

	constructor(private http: HttpClient, private appState: AppStateService) {
		this.apiUrl = environment.BACKEND_URL;
	}

	private getAuthHeaders(): { headers: HttpHeaders } {
		const token = localStorage.getItem("token") ?? "";
		const headers = new HttpHeaders().set("Authorization", `${token}`);
		return { headers };
	}

	signup(
		name: string,
		email: string,
		password: string,
		imgUrl: string
	): Observable<any> {
		const body = { name, email, password, imgUrl };
		return this.http.post(`${this.apiUrl}signup`, body);
	}

	login(email: string, password: string): Observable<any> {
		const body = { email, password };
		return this.http.post(`${this.apiUrl}login`, body);
	}

	googleLogin(idToken: string): Observable<any> {
		return this.http.post(`${this.apiUrl}google-login`, { idToken });
	}

	verifyEmail(authCode: string): Observable<any> {
		const body = { authCode };
		return this.http.post(`${this.apiUrl}verify-email-code`, body);
	}

	resetPassword(authCode: string, password: string): Observable<any> {
		const body = { authCode, password };
		return this.http.post(`${this.apiUrl}reset-password`, body);
	}

	requestPasswordReset(email: string): Observable<any> {
		const body = { email };
		return this.http.post(`${this.apiUrl}request-password-reset`, body);
	}

	getUserProfile(): Observable<any> {
		return this.http.post(
			`${this.apiUrl}get-user-profile`,
			{},
			this.getAuthHeaders()
		);
	}

	updateUserProfile(name: string, pfp: string): Observable<any> {
		const body = { name, pfp };
		return this.http.post(
			`${this.apiUrl}update-user-profile`,
			body,
			this.getAuthHeaders()
		);
	}

	addEvent(
		title: string,
		description: string,
		beginsAt: string,
		endsAt: string,
		address: string,
		isVirtual: boolean,
		tags: string[],
		imgUrl: string
	): Observable<any> {
		const body = {
			title,
			description,
			beginsAt,
			endsAt,
			address,
			isVirtual,
			tags,
			imgUrl,
		};
		return this.http.post(
			`${this.apiUrl}add-event`,
			body,
			this.getAuthHeaders()
		);
	}

	deleteEvent(title: string): Observable<any> {
		const body = { title };
		return this.http.post(
			`${this.apiUrl}delete-event`,
			body,
			this.getAuthHeaders()
		);
	}

	getEventByTitle(title: string): Observable<any> {
		const body = { title };
		return this.http.post(
			`${this.apiUrl}get-event-by-title`,
			body,
			this.getAuthHeaders()
		);
	}

	updateEvent(
		title: string,
		description: string,
		beginsAt: string,
		endsAt: string,
		address: string,
		isVirtual: boolean,
		imgUrl: string,
		tags: string[]
	): Observable<any> {
		const body = {
			title,
			description,
			beginsAt,
			endsAt,
			address,
			isVirtual,
			imgUrl,
			tags,
		};
		return this.http.post(
			`${this.apiUrl}update-event`,
			body,
			this.getAuthHeaders()
		);
	}

	registerForEvent(title: string): Observable<any> {
		const body = { title };
		return this.http.post(
			`${this.apiUrl}register-for-event`,
			body,
			this.getAuthHeaders()
		);
	}

	unregisterFromEvent(title: string): Observable<any> {
		const body = { title };
		return this.http.post(
			`${this.apiUrl}unregister-from-event`,
			body,
			this.getAuthHeaders()
		);
	}

	getUserStatus(title: string): Observable<any> {
		const body = { title };
		return this.http.post(
			`${this.apiUrl}get-user-status`,
			body,
			this.getAuthHeaders()
		);
	}

	getAddressAndAttendees(title: string): Observable<any> {
		const body = { title };
		return this.http.post(
			`${this.apiUrl}get-address-and-attendees`,
			body,
			this.getAuthHeaders()
		);
	}

	approveAttendee(title: string, attendeeId: string): Observable<any> {
		const body = { title, attendeeId };
		return this.http.post(
			`${this.apiUrl}approve-attendee`,
			body,
			this.getAuthHeaders()
		);
	}

	removeAttendee(title: string, attendeeId: string): Observable<any> {
		const body = { title, attendeeId };
		return this.http.post(
			`${this.apiUrl}remove-attendee`,
			body,
			this.getAuthHeaders()
		);
	}

	addComment(title: string, comment: string): Observable<any> {
		const body = { title, comment };
		return this.http.post(
			`${this.apiUrl}add-comment`,
			body,
			this.getAuthHeaders()
		);
	}

	addReply(title: string, commentId: string, reply: string): Observable<any> {
		const body = { title, commentId, reply };
		return this.http.post(
			`${this.apiUrl}add-reply`,
			body,
			this.getAuthHeaders()
		);
	}

	getComments(title: string): Observable<any> {
		const body = { title };
		return this.http.post(
			`${this.apiUrl}get-comments`,
			body,
			this.getAuthHeaders()
		);
	}

	getUserId(): Observable<any> {
		return this.http.post(
			`${this.apiUrl}get-userid`,
			{},
			this.getAuthHeaders()
		);
	}

	deleteComment(title: string, commentId: string): Observable<any> {
		const body = { title, commentId };
		return this.http.post(
			`${this.apiUrl}delete-comment`,
			body,
			this.getAuthHeaders()
		);
	}

	deleteReply(
		title: string,
		commentId: string,
		replyId: string
	): Observable<any> {
		const body = { title, commentId, replyId };
		return this.http.post(
			`${this.apiUrl}delete-reply`,
			body,
			this.getAuthHeaders()
		);
	}

	editComment(
		title: string,
		commentId: string,
		newText: string
	): Observable<any> {
		const body = { title, commentId, newText };
		return this.http.post(
			`${this.apiUrl}edit-comment`,
			body,
			this.getAuthHeaders()
		);
	}

	editReply(
		title: string,
		commentId: string,
		replyId: string,
		newText: string
	): Observable<any> {
		const body = { title, commentId, replyId, newText };
		return this.http.post(
			`${this.apiUrl}edit-reply`,
			body,
			this.getAuthHeaders()
		);
	}

	searchEvents(
		searchStr: string,
		pageIndexedAt1: number,
		limit: number,
		filterByDateStart: Date,
		filterByDateEnd: Date
	): Observable<any> {
		const page = pageIndexedAt1 - 1;
		return this.http.post(
			`${this.apiUrl}search-events`,
			{ searchStr, page, limit, filterByDateStart, filterByDateEnd },
			this.getAuthHeaders()
		);
	}
}
