import { CommonModule } from "@angular/common";
import { ChangeDetectorRef, Component, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { ApiService } from "../api.service";
import { Router } from "@angular/router";
import { MatIconModule } from "@angular/material/icon";
import {
	getAuth,
	GoogleAuthProvider,
	GithubAuthProvider,
	inMemoryPersistence,
	setPersistence,
	signInWithPopup,
	User,
	fetchSignInMethodsForEmail,
	linkWithCredential,
} from "firebase/auth";
import { initializeApp } from "firebase/app";
import { environment } from "../../environments/environment";

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
		MatIconModule,
	],
})
export class LoginComponent {
	email: string = "";
	password: string = "";
	router: Router;
	invalidInfo: Array<string> = [];
	showPassword: boolean = false;
	auth = getAuth(initializeApp(environment.firebaseConfig));

	constructor(
		private apiService: ApiService,
		private cdr: ChangeDetectorRef
	) {
		this.router = inject(Router);
		if (localStorage.getItem("token")) {
			this.router.navigate(["/home"]);
		}
		setPersistence(this.auth, inMemoryPersistence);
	}

	togglePasswordVisibility() {
		this.showPassword = !this.showPassword;
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

	async signInWithGoogle() {
		const provider = new GoogleAuthProvider();
		try {
			const result = await signInWithPopup(this.auth, provider);
			const user = result.user;
			const idToken = await user.getIdToken();

			this.apiService.firebaseLogin(idToken).subscribe({
				next: (response) => {
					localStorage.setItem("token", response.token);
					this.router.navigate(["/home"]);
				},
				error: (error) => {
					console.error("Google login error:", error);
					this.cdr.detectChanges();
				},
			});
		} catch (error: any) {
			if (
				error.code === "auth/account-exists-with-different-credential"
			) {
				const pendingCred =
					GoogleAuthProvider.credentialFromError(error);
				const email = error.customData.email;
				const methods = await fetchSignInMethodsForEmail(
					this.auth,
					email
				);

				alert(
					"An account already exists with the same email address. Link your Google account to your existing account."
				);

				const githubProvider = new GithubAuthProvider();
				const githubResult = await signInWithPopup(
					this.auth,
					githubProvider
				);

				await linkWithCredential(githubResult.user, pendingCred!);
				const idToken = await githubResult.user.getIdToken();
				this.apiService.firebaseLogin(idToken).subscribe({
					next: (response) => {
						localStorage.setItem("token", response.token);
						this.router.navigate(["/home"]);
					},
					error: (error) => {
						console.error("Google login error:", error);
						this.cdr.detectChanges();
					},
				});
			}
			console.error("Login error:", error);
		}
	}

	async signInWithGithub() {
		const provider = new GithubAuthProvider();
		try {
			const result = await signInWithPopup(this.auth, provider);
			const user = result.user;

			const idToken = await user.getIdToken();
			this.apiService.firebaseLogin(idToken).subscribe({
				next: (response) => {
					localStorage.setItem("token", response.token);
					this.router.navigate(["/home"]);
				},
				error: (error) => {
					console.error("Google login error:", error);
					this.cdr.detectChanges();
				},
			});
		} catch (error: any) {
			if (
				error.code === "auth/account-exists-with-different-credential"
			) {
				const pendingCred =
					GithubAuthProvider.credentialFromError(error);
				const email = error.customData.email;
				const methods = await fetchSignInMethodsForEmail(
					this.auth,
					email
				);

				alert(
					"An account already exists with the same email address. Link your GitHub account to your existing account."
				);

				const googleProvider = new GoogleAuthProvider();
				const googleResult = await signInWithPopup(
					this.auth,
					googleProvider
				);

				await linkWithCredential(googleResult.user, pendingCred!);
				const idToken = await googleResult.user.getIdToken();
				this.apiService.firebaseLogin(idToken).subscribe({
					next: (response) => {
						localStorage.setItem("token", response.token);
						this.router.navigate(["/home"]);
					},
					error: (error) => {
						console.error("Google login error:", error);
						this.cdr.detectChanges();
					},
				});
			}
		}
	}
}
