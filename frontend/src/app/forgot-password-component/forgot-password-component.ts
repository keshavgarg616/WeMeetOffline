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
	templateUrl: "./forgot-password-component.html",
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		MatFormFieldModule,
		MatButtonModule,
		MatInputModule,
	],
})
export class forgotPasswordComponent {
	authCode: string = "";
	router: Router;
	invalidInfo: Array<string> = [];
	forgotPasswordForm: FormGroup;
	resetLinkSent: boolean = false;

	constructor(
		private apiService: ApiService,
		private cdr: ChangeDetectorRef
	) {
		this.router = inject(Router);
		this.forgotPasswordForm = new FormGroup({
			email: new FormControl("", [Validators.required, Validators.email]),
		});
	}

	onSubmit() {
		if (this.forgotPasswordForm.valid) {
			this.invalidInfo = [];
			const email = this.forgotPasswordForm.value.email;
			this.apiService.requestPasswordReset(email).subscribe({
				next: (response) => {
					this.resetLinkSent = true;
					this.cdr.detectChanges();
					new Promise((r) => setTimeout(r, 1500)).then(() => {
						this.router.navigate(["/login"]);
					});
				},
				error: (error) => {
					this.invalidInfo = [error.error.error];
					this.cdr.detectChanges();
				},
			});
		}
	}
}
