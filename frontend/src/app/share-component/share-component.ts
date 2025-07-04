import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
	selector: "app-share-component",
	imports: [],
	template: "Redirecting to event...",
})
export class ShareComponent {
	constructor(private route: ActivatedRoute, private router: Router) {
		this.route.params.subscribe((params) => {
			const title = params["event"];
			if (title) {
				this.router.navigate(["/event"], {
					state: {
						eventTitle: title,
					},
				});
			} else {
				this.router.navigate(["/home"]);
			}
		});
	}
}
