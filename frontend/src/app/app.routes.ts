import { Routes } from "@angular/router";
import { LoginComponent } from "./login-component.ts/login-component";
import { SignUpComponent } from "./signup-component/signup-component";
import { LogoutComponent } from "./logout-component/logout-component";
import { GroupCreationComponent } from "./group-creation-component/group-creation-component";
import { GroupSelectionComponent } from "./group-selection-component/group-selection-component";
import { emailVerificationComponent } from "./email-verification-component/email-verification-component";
import { forgotPasswordComponent } from "./forgot-password-component/forgot-password-component";
import { resetPasswordComponent } from "./reset-password-component/reset-password-component";
import { HomePageComponent } from "./home-page-component/home-page-component";
import { authGuard } from "./auth-guard.js";
import { CreateEventComponent } from "./create-event-component/create-event-component";

export const routes: Routes = [
	{ path: "", redirectTo: "login", pathMatch: "full" },
	{ path: "login", component: LoginComponent },
	{ path: "signup", component: SignUpComponent },
	{ path: "logout", component: LogoutComponent },
	{ path: "verify-email", component: emailVerificationComponent },
	{ path: "forgot-password", component: forgotPasswordComponent },
	{ path: "reset-password", component: resetPasswordComponent },
	{
		path: "create-group",
		component: GroupCreationComponent,
		canActivate: [authGuard],
	},
	{
		path: "select-group",
		component: GroupSelectionComponent,
		canActivate: [authGuard],
	},
	{ path: "home", component: HomePageComponent, canActivate: [authGuard] },
	{
		path: "create-event",
		component: CreateEventComponent,
		canActivate: [authGuard],
	},
	{ path: "**", redirectTo: "login", pathMatch: "full" },
];
