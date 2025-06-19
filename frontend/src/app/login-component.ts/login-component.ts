import { Component } from "@angular/core";
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

@Component({
	selector: "app-login-component.ts",
	imports: [
		FormsModule,
		ReactiveFormsModule,
		MatFormFieldModule,
		MatInputModule,
		MatButtonModule,
	],
	templateUrl: "./login-component.html",
})
export class LoginComponent {
	loginForm: FormGroup;

	constructor() {
		this.loginForm = new FormGroup({
			email: new FormControl("", [Validators.required]),
			password: new FormControl("", [Validators.required]),
		});
	}

	onSubmit() {
		if (this.loginForm.valid) {
			const { email, password } = this.loginForm.value;
			console.log("email:", email);
			console.log("Password:", password);
		}
	}
}
