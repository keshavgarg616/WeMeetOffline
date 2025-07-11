import { ErrorHandler, inject, Injectable } from "@angular/core";
import { ApiService } from "./api.service";

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
	handleError(error: any): void {
		const apiService: ApiService = inject(ApiService);
		apiService.createLog("frontend", "GlobalErrorHandler", error);
		throw error;
	}
}
