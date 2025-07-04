import { ChangeDetectorRef, Component, inject } from "@angular/core";
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
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatTimepickerModule } from "@angular/material/timepicker";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { provideNativeDateAdapter } from "@angular/material/core";
import { endsAfterBegins } from "../validators/dateValidator";
import { validTagsValidator } from "../validators/tagValidator";

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
	invalidInfo: Array<string> = [];
	endDateAndTime: Date | null = null;
	router: Router = inject(Router);
	FILESTACK_API_KEY: string = environment.FILESTACK_API_KEY;
	imgUrl: string = "";

	eventForm: FormGroup = new FormGroup(
		{
			title: new FormControl("", Validators.required),
			description: new FormControl("", Validators.required),
			address: new FormControl("", Validators.required),
			tags: new FormControl("", validTagsValidator()),
			isVirtual: new FormControl(true),
			startDate: new FormControl("", Validators.required),
			endDate: new FormControl("", Validators.required),
			startTime: new FormControl("", Validators.required),
			endTime: new FormControl("", Validators.required),
		},
		{ validators: endsAfterBegins(), updateOn: "change" }
	);

	onUploadSuccess(res: any) {
		this.imgUrl = res.filesUploaded[0].url;
		this.cdr.detectChanges();
	}

	removeImage() {
		this.imgUrl = "";
		this.cdr.detectChanges();
	}

	constructor(
		private apiService: ApiService,
		private cdr: ChangeDetectorRef
	) {}
	onSubmit() {
		this.invalidInfo = [];
		let tagsArr = [];
		if (this.eventForm.value.tags !== "") {
			tagsArr = this.eventForm.value.tags
				.toString()
				.trim()
				.split(",")
				.map((tag: string) => tag.trim());
		}
		if (!this.imgUrl) {
			this.imgUrl =
				"https://icrier.org/wp-content/uploads/2022/09/Event-Image-Not-Found.jpg";
			this.cdr.detectChanges();
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
					if (
						error.error.error.includes(
							"Event with this title already exists"
						)
					) {
						this.invalidInfo.push(
							"Event with this title already exists"
						);
						this.eventForm.controls["title"].setValue("");
						this.cdr.detectChanges();
						console.log("Event with this title already exists");
					}
					console.error("Error creating event:", error);
				},
			});
	}
}
