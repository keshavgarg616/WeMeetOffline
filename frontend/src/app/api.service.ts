// api.service.ts
import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../environments/environment";

@Injectable({
	providedIn: "root",
})
export class ApiService {
	private apiUrl: string;

	constructor(private http: HttpClient) {
		this.apiUrl = environment.BACKEND_URL;
	}

	private getAuthHeaders() {
		const token = localStorage.getItem("token");
		return {
			headers: new HttpHeaders({
				Authorization: `${token}`,
			}),
		};
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

	verifyEmail(authCode: string): Observable<any> {
		const body = { authCode };
		return this.http.post(
			`${this.apiUrl}verify-email-code`,
			body,
			this.getAuthHeaders()
		);
	}

	resetPassword(authCode: string, password: string): Observable<any> {
		const body = { authCode, password };
		return this.http.post(`${this.apiUrl}reset-password`, body);
	}

	requestPasswordReset(email: string): Observable<any> {
		const body = { email };
		return this.http.post(`${this.apiUrl}request-password-reset`, body);
	}

	setPfp(pfp: string): Observable<any> {
		const body = { pfp };
		return this.http.post(
			`${this.apiUrl}set-pfp`,
			body,
			this.getAuthHeaders()
		);
	}

	getUserProfile(): Observable<any> {
		return this.http.post(
			`${this.apiUrl}user-profile`,
			{},
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

	getEvents(): Observable<any> {
		const body = {};
		return this.http.post(
			`${this.apiUrl}get-events`,
			body,
			this.getAuthHeaders()
		);
	}

	deleteEvent(eventId: string): Observable<any> {
		const body = { eventId };
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
		eventId: string,
		description: string,
		beginsAt: string,
		endsAt: string,
		address: string,
		isVirtual: boolean,
		tags: string[]
	): Observable<any> {
		const body = {
			eventId,
			description,
			beginsAt,
			endsAt,
			address,
			isVirtual,
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

	isRegisteredForEvent(title: string): Observable<any> {
		const body = { title };
		return this.http.post(
			`${this.apiUrl}is-registered-for-event`,
			body,
			this.getAuthHeaders()
		);
	}

	isOrganizerOfEvent(title: string): Observable<any> {
		const body = { title };
		return this.http.post(
			`${this.apiUrl}is-organizer-of-event`,
			body,
			this.getAuthHeaders()
		);
	}
}
