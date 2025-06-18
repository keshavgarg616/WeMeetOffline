import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Environment } from "../environments/environment";

@Injectable({
	providedIn: "root",
})
export class ApiService {
	private baseUrl: string;

	constructor(private env: Environment) {
		this.baseUrl = this.env.BACKEND_URL;
	}
}
