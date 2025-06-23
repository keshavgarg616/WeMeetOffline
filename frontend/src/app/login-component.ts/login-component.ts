import { CommonModule } from "@angular/common";
import { ChangeDetectorRef, Component, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { ApiService } from "../api.service";
import { Router } from "@angular/router";

@Component({
	selector: "login-route",
	standalone: true,
	templateUrl: "./login-component.html",
	imports: [
		CommonModule,
		FormsModule,
		MatFormFieldModule,
		MatButtonModule,
		MatInputModule,
	],
})
export class LoginComponent {
	email: string = "";
	password: string = "";
	router: Router;
	invalidInfo: Array<string> = [];

	constructor(
		private apiService: ApiService,
		private cdr: ChangeDetectorRef
	) {
		this.router = inject(Router);
		if (localStorage.getItem("token")) {
			this.router.navigate(["/home"]);
		}
	}

	onSubmit(form: any) {
		this.invalidInfo = [];
		this.apiService.login(this.email, this.password).subscribe({
			next: (response) => {
				if (!response.error) {
					localStorage.setItem("token", response.token);
					this.router.navigate(["/home"]);
				}
			},
			error: (error) => {
				console.log(error.error.error);
				if (error.error.error.includes("User not found")) {
					this.invalidInfo.push("User not found");
				}
				if (error.error.error.includes("Invalid password")) {
					this.invalidInfo.push("Invalid password");
				}
				if (error.error.error.includes("Email not verified")) {
					this.invalidInfo.push(
						"Email not verified. Please verify your email."
					);
				}
				this.cdr.detectChanges();
			},
		});
	}
}
