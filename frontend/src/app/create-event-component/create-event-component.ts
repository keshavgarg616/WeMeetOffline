import { Component, inject } from "@angular/core";
import { ApiService } from "../api.service";
import {
	FormControl,
	FormGroup,
	FormsModule,
	ReactiveFormsModule,
	Validators,
} from "@angular/forms";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { Router } from "@angular/router";
import { environment } from "../../environments/environment";
import { FilestackModule } from "@filestack/angular";
import { MatButtonModule } from "@angular/material/button";
import {
	MatSlideToggle,
	MatSlideToggleModule,
} from "@angular/material/slide-toggle";
import { MatTimepickerModule } from "@angular/material/timepicker";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { provideNativeDateAdapter } from "@angular/material/core";

@Component({
	selector: "app-create-event-component",
	imports: [
		ReactiveFormsModule,
		FormsModule,
		MatInputModule,
		MatFormFieldModule,
		MatButtonModule,
		FilestackModule,
		MatSlideToggleModule,
		MatTimepickerModule,
		MatDatepickerModule,
	],
	templateUrl: "./create-event-component.html",
	providers: [provideNativeDateAdapter()],
	standalone: true,
})
export class CreateEventComponent {
	startDateAndTime: Date | null = null;
	endDateAndTime: Date | null = null;
	router: Router = inject(Router);
	FILESTACK_API_KEY: string = environment.FILESTACK_API_KEY;
	imgUrl: string = "https://example.com/default-image.jpg";

	eventForm: FormGroup = new FormGroup({
		title: new FormControl("", Validators.required),
		description: new FormControl("", Validators.required),
		address: new FormControl(""),
		tags: new FormControl(""),
		isVirtual: new FormControl(true),
		startDate: new FormControl("", Validators.required),
		endDate: new FormControl(""),
		startTime: new FormControl("", Validators.required),
		endTime: new FormControl("", Validators.required),
	});

	onUploadSuccess(res: any) {
		this.imgUrl = res.filesUploaded[0].url;
	}

	constructor(private apiService: ApiService) {}
	onSubmit() {
		let tagsArr = [];
		if (this.eventForm.value.tags !== "") {
			try {
				tagsArr = this.eventForm.value.tags
					.split(",")
					.map((tag: string) => tag.trim());
				for (let tag of tagsArr) {
					if (tag === "") {
						return console.log("Tags cannot be empty");
					}
				}
			} catch {
				return console.log("Tags entered wrong");
			}
		}
		this.apiService
			.addEvent(
				this.eventForm.value.title,
				this.eventForm.value.description,
				this.eventForm.value.startDate.getTime(),
				this.eventForm.value.endTime.getTime(),
				this.eventForm.value.address,
				this.eventForm.value.isVirtual,
				tagsArr,
				this.imgUrl
			)
			.subscribe({
				next: (response) => {
					console.log("Event created successfully:", response);
					this.router.navigate(["/home"]);
				},
				error: (error) => {
					if (error.error.error.includes("Invalid token")) {
						this.router.navigate(["/logout"]);
					}
					console.error("Error creating event:", error);
				},
			});
	}
}
