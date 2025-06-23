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
import {
	createPasswordMatchValidator,
	createPasswordValidator,
} from "../passwordStrengthValidator";

@Component({
	selector: "signup-route",
	standalone: true,
	templateUrl: "./signup-component.html",
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		MatFormFieldModule,
		MatButtonModule,
		MatInputModule,
	],
})
export class SignUpComponent {
	router: Router;
	invalidInfo: Array<string> = [];

	constructor(
		private apiService: ApiService,
		private cdr: ChangeDetectorRef
	) {
		this.router = inject(Router);
		if (localStorage.getItem("token")) {
			this.router.navigate(["/login"]);
		}
	}

	signUpForm = new FormGroup(
		{
			name: new FormControl("", [Validators.required]),
			email: new FormControl("", [Validators.required, Validators.email]),
			pswd: new FormControl("", {
				validators: [Validators.required, createPasswordValidator()],
				updateOn: "change",
			}),
			confirmPswd: new FormControl("", [Validators.required]),
		},
		{ validators: createPasswordMatchValidator(), updateOn: "change" }
	);

	signUp() {
		if (this.signUpForm.valid) {
			this.invalidInfo = [];
			const { name, email, pswd } = this.signUpForm.value;
			let password = pswd?.trim().toString();
			this.apiService
				.signup(name || "", email || "", password || "")
				.subscribe({
					next: (response) => {
						this.router.navigate(["/login"]);
						this.invalidInfo = [];
					},
					error: (error) => {
						if (error.error.error.includes("User already exists")) {
							this.invalidInfo.push("Email already exists");
						}
						this.cdr.detectChanges();
					},
				});
		}
	}
}
