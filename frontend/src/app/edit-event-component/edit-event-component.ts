import { ChangeDetectorRef, Component, inject } from "@angular/core";
import { Router } from "@angular/router";
import { ApiService } from "../api.service";
import { Event } from "../../interfaces/eventInterface";
import { firstValueFrom } from "rxjs";
import {
	FormControl,
	FormGroup,
	ReactiveFormsModule,
	Validators,
} from "@angular/forms";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatTimepickerModule } from "@angular/material/timepicker";
import { provideNativeDateAdapter } from "@angular/material/core";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { CommonModule } from "@angular/common";
import { environment } from "../../environments/environment";
import { FilestackModule } from "@filestack/angular";
import { validTagsValidator } from "../../validators/tagValidator";
import { endsAfterBegins } from "../../validators/dateValidator";

@Component({
	selector: "app-edit-event-component",
	imports: [
		MatInputModule,
		MatButtonModule,
		MatDatepickerModule,
		MatTimepickerModule,
		ReactiveFormsModule,
		MatSlideToggleModule,
		FilestackModule,
	],
	providers: [provideNativeDateAdapter()],
	templateUrl: "./edit-event-component.html",
})
export class EditEventComponent {
	title: string = "";
	router: Router = inject(Router);
	event: Event | null = null;
	isOrganizer: boolean = false;
	address: string = "";
	invalidInfo: Array<string> = [];
	eventForm: FormGroup;
	startDateAndTime: Date | null = null;
	endDateAndTime: Date | null = null;
	eventUpdated: boolean = false;
	imgUrl: string = "";
	FILESTACK_API_KEY: string = environment.FILESTACK_API_KEY;

	constructor(
		private apiService: ApiService,
		private cdr: ChangeDetectorRef
	) {
		this.init();
		this.eventForm = new FormGroup(
			{
				description: new FormControl(
					this.event?.description,
					Validators.required
				),
				address: new FormControl(this.address, Validators.required),
				tags: new FormControl("", validTagsValidator()),
				isVirtual: new FormControl(true),
				startDate: new FormControl("", Validators.required),
				endDate: new FormControl("", Validators.required),
				startTime: new FormControl("", Validators.required),
				endTime: new FormControl("", Validators.required),
			},
			{ validators: endsAfterBegins(), updateOn: "change" }
		);
	}

	async init() {
		const nav = this.router.getCurrentNavigation();
		const state = nav?.extras?.state as {
			eventTitle: string;
		};
		if (state === null || state === undefined) {
			this.router.navigate(["/home"]);
			return;
		}
		this.title = state.eventTitle ?? "";
		if (!this.title) {
			this.router.navigate(["/home"]);
			return;
		}

		try {
			this.event = await firstValueFrom(
				this.apiService.getEventByTitle(this.title)
			);
		} catch (error) {
			this.router.navigate(["/logout"]);
		}
		this.cdr.detectChanges();

		this.isOrganizer = (
			await firstValueFrom(this.apiService.isOrganizerOfEvent(this.title))
		).isOrganizer;
		if (!this.isOrganizer) {
			return this.goBack();
		}

		const res = await firstValueFrom(
			this.apiService.getAddressAndAttendees(this.title)
		);
		this.address = res.address;
		this.eventForm.controls["description"].setValue(
			this.event?.description ?? ""
		);
		this.eventForm.controls["address"].setValue(this.address ?? "");
		this.eventForm.controls["tags"].setValue(
			this.event?.tags?.join(", ") ?? ""
		);
		this.eventForm.controls["isVirtual"].setValue(
			this.event?.isVirtual ?? false
		);
		this.startDateAndTime = this.event?.beginsAt ?? null;
		this.endDateAndTime = this.event?.endsAt ?? null;
		this.imgUrl = this.event?.picture ?? "";
		this.cdr.detectChanges();
	}

	goBack() {
		this.router.navigate(["/event"], {
			state: { eventTitle: this.title },
		});
	}

	onUploadSuccess(res: any) {
		this.imgUrl = res.filesUploaded[0].url;
		this.cdr.detectChanges();
	}

	removeImage() {
		this.imgUrl = "";
		this.cdr.detectChanges();
	}

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
			.updateEvent(
				this.title,
				this.eventForm.value.description,
				new Date(this.eventForm.value.startDate).getTime().toString(),
				new Date(this.eventForm.value.endTime).getTime().toString(),
				this.eventForm.value.address,
				this.eventForm.value.isVirtual,
				this.imgUrl,
				tagsArr
			)
			.subscribe({
				next: (res) => {
					this.eventUpdated = true;
					this.cdr.detectChanges();
					setTimeout(() => {
						this.goBack();
					}, 1000);
				},
				error: (err) => {
					console.error("Error updating event:", err);
					this.invalidInfo.push(err.error.error);
					this.cdr.detectChanges();
					if (err.error.error.includes("Invalid token")) {
						this.router.navigate(["/logout"]);
					}
					setTimeout(() => {
						this.goBack();
					}, 2000);
				},
			});
	}
}
