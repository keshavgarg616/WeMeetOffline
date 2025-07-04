import {
	HttpInterceptorFn,
	HttpRequest,
	HttpHandlerFn,
} from "@angular/common/http";
import { inject } from "@angular/core";
import { AppStateService } from "./app-state.service";
import { finalize } from "rxjs/operators";

export const responseInterceptor: HttpInterceptorFn = (
	req: HttpRequest<any>,
	next: HttpHandlerFn
) => {
	const appState = inject(AppStateService);
	appState.setLoading(true);
	return next(req).pipe(
		finalize(() => {
			appState.setLoading(false);
		})
	);
};
