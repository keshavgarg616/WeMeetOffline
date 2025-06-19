import { Component } from "@angular/core";
import {
	Form,
	FormControl,
	FormGroup,
	FormsModule,
	ReactiveFormsModule,
	Validators,
} from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";

@Component({
	selector: "app-signup-component",
	imports: [
		FormsModule,
		ReactiveFormsModule,
		MatFormFieldModule,
		MatInputModule,
		MatButtonModule,
	],
	templateUrl: "./signup-component.html",
})
export class SignupComponent {
	signupForm: FormGroup;

	constructor() {
		this.signupForm = new FormGroup({
			email: new FormControl("", [Validators.required, Validators.email]),
			password: new FormControl("", [
				Validators.required,
				Validators.minLength(6),
			]),
			confirmPassword: new FormControl("", [
				Validators.required,
				Validators.minLength(6),
			]),
		});
	}

	onSubmit() {
		if (
			this.signupForm.value.password ===
			this.signupForm.value.confirmPassword
		) {
			const { email, password, confirmPassword } = this.signupForm.value;
			console.log("Email:", email);
			console.log("Password:", password);
		}
	}
}
