import {
	ApplicationConfig,
	ErrorHandler,
	provideBrowserGlobalErrorListeners,
	provideZonelessChangeDetection,
} from "@angular/core";
import { provideRouter } from "@angular/router";

import { routes } from "./app.routes";
import { provideHttpClient, withInterceptors } from "@angular/common/http";
import { responseInterceptor } from "./response.interceptor";
import { GlobalErrorHandler } from "./globalErrorHandler";

export const appConfig: ApplicationConfig = {
	providers: [
		provideHttpClient(withInterceptors([responseInterceptor])),
		{ provide: ErrorHandler, useClass: GlobalErrorHandler },
		provideBrowserGlobalErrorListeners(),
		provideZonelessChangeDetection(),
		provideRouter(routes),
	],
};
