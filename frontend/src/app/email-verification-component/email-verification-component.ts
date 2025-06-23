import { CommonModule } from "@angular/common";
import { ChangeDetectorRef, Component, inject } from "@angular/core";
import {
	FormControl,
	FormGroup,
	FormsModule,
	ReactiveFormsModule,
	Validators,
} from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { ApiService } from "../api.service";
import { Router } from "@angular/router";

@Component({
	selector: "email-verification-route",
	standalone: true,
	templateUrl: "./email-verification-component.html",
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		MatFormFieldModule,
		MatButtonModule,
		MatInputModule,
	],
})
export class emailVerificationComponent {
	authCode: string;
	router: Router;
	invalidInfo: Array<string> = [];
	emailVerified: boolean = false;
	constructor(
		private apiService: ApiService,
		private cdr: ChangeDetectorRef
	) {
		const searchParams = new URLSearchParams(window.location.search);
		this.authCode = searchParams.get("code") ?? "";
		this.router = inject(Router);
		if (this.authCode === "") {
			console.error("No authentication code provided in the URL.");
			this.router.navigate(["/login"]);
		}
		this.invalidInfo = [];
		this.apiService.verifyEmail(this.authCode ?? "").subscribe({
			next: (response) => {
				console.log("Email verification successful", response);
				this.emailVerified = true;
				this.cdr.detectChanges();
				new Promise((r) => setTimeout(r, 1500)).then(() => {
					this.router.navigate(["/login"]);
				});
			},
			error: (error) => {
				if (error.error.error.includes("Email already verified")) {
					console.error("Email has already been verified.");
					this.invalidInfo.push(
						"Email has already been verified. Please log in."
					);
					this.cdr.detectChanges();
					new Promise((r) => setTimeout(r, 1500)).then(() => {
						this.router.navigate(["/login"]);
					});
				}
				if (error.error.error.includes("Invalid auth code")) {
					console.error("Invalid authentication code.");
					this.invalidInfo.push("Invalid authentication code.");
					this.cdr.detectChanges();
					new Promise((r) => setTimeout(r, 1500)).then(() => {
						this.router.navigate(["/login"]);
					});
				}
			},
		});
	}
}
