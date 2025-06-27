// src/app/interceptors/response.interceptor.ts
import {
	HttpInterceptorFn,
	HttpRequest,
	HttpHandlerFn,
	HttpResponse,
} from "@angular/common/http";
import { tap } from "rxjs/operators";
import { inject } from "@angular/core";
import { AppStateService } from "./app-state.service";

export const responseInterceptor: HttpInterceptorFn = (
	req: HttpRequest<any>,
	next: HttpHandlerFn
) => {
	const appState = inject(AppStateService);

	return next(req).pipe(
		tap((event) => {
			if (event instanceof HttpResponse) {
				appState.setLoading(false); // same as your old `onEveryResponse()`
			}
		})
	);
};
