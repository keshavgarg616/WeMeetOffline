import { Component } from "@angular/core";

@Component({
	selector: "app-logout-component",
	imports: [],
	template: `Logging out...`,
})
export class LogoutComponent {
	constructor() {
		localStorage.removeItem("token");
		window.location.href = "/login";
	}
}
