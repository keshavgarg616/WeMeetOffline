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
} from "../validators/passwordStrengthValidator";
import { FilestackModule } from "@filestack/angular";
import { environment } from "../../environments/environment";
import { MatIconModule } from "@angular/material/icon";
import { debounceTime } from "rxjs/operators";

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
		FilestackModule,
		MatInputModule,
		MatIconModule,
	],
})
export class SignUpComponent {
	router: Router;
	invalidInfo: Array<string> = [];
	imgUrl: string = "";
	showPassword: boolean = false;
	FILESTACK_API_KEY: string = environment.FILESTACK_API_KEY;

	constructor(
		private apiService: ApiService,
		private cdr: ChangeDetectorRef
	) {
		this.router = inject(Router);
		if (localStorage.getItem("token")) {
			this.router.navigate(["/login"]);
		}
	}

	onUploadSuccess(res: any) {
		this.imgUrl = res.filesUploaded[0].url;
		this.cdr.detectChanges();
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
			if (this.imgUrl === "") {
				this.imgUrl =
					"https://icrier.org/wp-content/uploads/2022/09/Event-Image-Not-Found.jpg";
			}
			this.apiService
				.signup(name || "", email || "", password || "", this.imgUrl)
				.subscribe({
					next: (response) => {
						this.invalidInfo.push(
							"Please verify your email before logging in"
						);
						this.cdr.detectChanges();
						setTimeout(() => {
							this.router.navigate(["/login"]);
						}, 1500);
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

	togglePasswordVisibility() {
		this.showPassword = !this.showPassword;
	}

	removeImage() {
		this.imgUrl = "";
		this.cdr.detectChanges();
	}
}
