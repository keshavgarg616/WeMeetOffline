import { ChangeDetectorRef, Component, effect, inject } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { AppStateService } from "./app-state.service";

@Component({
	selector: "app-root",
	standalone: true,
	imports: [RouterOutlet],
	templateUrl: "./app.html",
	styleUrl: "./app.css",
})
export class App {
	private appState = inject(AppStateService);
	isLoading: boolean = false;

	constructor(private cdr: ChangeDetectorRef) {
		effect(() => {
			this.appState.loadingFlag$.subscribe((isLoading) => {
				this.isLoading = isLoading;
				this.cdr.detectChanges();
			});
		});
	}
}
