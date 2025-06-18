import { Routes } from "@angular/router";
import { LoginComponent } from "./login-component.ts/login-component.js";
import { SignupComponent } from "./signup-component/signup-component.js";
import { LogoutComponent } from "./logout-component/logout-component.js";
import { GroupCreationComponent } from "./group-creation-component/group-creation-component.js";
import { GroupSelectionComponent } from "./group-selection-component/group-selection-component.js";

export const routes: Routes = [
	{ path: "", redirectTo: "login", pathMatch: "full" },
	{ path: "login", component: LoginComponent },
	{ path: "signup", component: SignupComponent },
	{ path: "logout", component: LogoutComponent },
	{ path: "create-group", component: GroupCreationComponent },
	{ path: "select-group", component: GroupSelectionComponent },
	{ path: "**", redirectTo: "login", pathMatch: "full" },
];
