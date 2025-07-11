import {
	HttpInterceptorFn,
	HttpRequest,
	HttpHandlerFn,
	HttpErrorResponse,
} from "@angular/common/http";
import { inject } from "@angular/core";
import { AppStateService } from "./app-state.service";
import { ApiService } from "./api.service";
import { catchError, finalize, throwError } from "rxjs";

export const responseInterceptor: HttpInterceptorFn = (
	req: HttpRequest<any>,
	next: HttpHandlerFn
) => {
	const appState = inject(AppStateService);
	const apiService = inject(ApiService);

	appState.setLoading(true);

	return next(req).pipe(
		catchError((error: HttpErrorResponse) => {
			apiService
				.createLog(
					"frontend",
					"HTTP Error",
					error.message + " ---> " + error.error.error
				)
				.subscribe();
			return throwError(() => error);
		}),
		finalize(() => {
			appState.setLoading(false);
		})
	);
};
