import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
	providedIn: "root",
})
export class AppStateService {
	private loadingFlag = new BehaviorSubject<boolean>(false);
	loadingFlag$ = this.loadingFlag.asObservable();

	setLoading(state: boolean) {
		this.loadingFlag.next(state);
	}
}
