import { ChangeDetectorRef, Component } from "@angular/core";
import { ApiService } from "../api.service";
import { CommonModule } from "@angular/common";
import profileEventsData from "../../interfaces/profileEventsInterface";
import { MatButtonModule } from "@angular/material/button";
import {
	FormControl,
	FormGroup,
	ReactiveFormsModule,
	Validators,
} from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { FilestackModule } from "@filestack/angular";
import { environment } from "../../environments/environment";

@Component({
	selector: "app-profile-component",
	imports: [
		CommonModule,
		MatButtonModule,
		ReactiveFormsModule,
		MatFormFieldModule,
		MatInputModule,
		FilestackModule,
	],
	templateUrl: "./profile-component.html",
})
export class ProfileComponent {
	userName: string = "";
	userPfp: string = "";
	userEmail: string = "";
	userPhone: string = "";
	createdEvents: Array<profileEventsData> = [];
	registeredEvents: Array<profileEventsData> = [];
	requestedEvents: Array<profileEventsData> = [];
	user = {};
	profileEditable: boolean = false;
	profileForm: FormGroup;
	showUpdateBanner: boolean = false;
	verifyingPhone: boolean = false;
	isPhoneVerified: boolean = false;
	imgUrl: string = "";
	originalPfp: string = "";
	FILESTACK_API_KEY = environment.FILESTACK_API_KEY;

	editProfile() {
		this.profileEditable = !this.profileEditable;
		if (this.profileEditable) {
			this.profileForm.patchValue({
				name: this.userName,
			});
		} else {
			this.imgUrl = this.originalPfp;
			this.cdr.detectChanges();
		}
	}

	onUploadSuccess(res: any) {
		this.imgUrl = res.filesUploaded[0].url;
		this.cdr.detectChanges();
	}

	removeImage() {
		this.imgUrl = "";
		this.cdr.detectChanges();
	}

	updateProfile() {
		this.userName = this.profileForm.value.name;
		if (!this.imgUrl) {
			this.imgUrl =
				"https://icrier.org/wp-content/uploads/2022/09/Event-Image-Not-Found.jpg";
			this.cdr.detectChanges();
		}
		this.apiService
			.updateUserProfile(this.userName, this.imgUrl)
			.subscribe({
				next: (response) => {
					this.showUpdateBanner = true;
					this.profileEditable = false;
					this.cdr.detectChanges();
					setTimeout(() => {
						this.showUpdateBanner = false;
					}, 2500);
				},
				error: (error) => {
					console.error("Error updating profile:", error);
				},
			});
	}

	requestOTP() {
		this.apiService.requestOTP().subscribe({
			next: (response) => {
				this.verifyingPhone = true;
				this.verifyOTP();
			},
			error: (error) => {
				console.error("Error requesting OTP:", error);
			},
		});
	}

	verifyOTP() {
		const otp = prompt("Please enter the OTP sent to your phone:");
		if (!otp) {
			alert("OTP is required to verify your phone number.");
			return;
		}
		this.apiService.verifyOTP(otp).subscribe({
			next: (response) => {
				alert("Phone number verified successfully.");
				this.verifyingPhone = false;
				this.isPhoneVerified = true;
			},
			error: (error) => {
				console.error("Error verifying OTP:", error);
				this.verifyingPhone = false;
				alert("Failed to verify OTP. Please try again.");
			},
		});
	}

	constructor(
		private apiService: ApiService,
		private cdr: ChangeDetectorRef
	) {
		this.profileForm = new FormGroup({
			name: new FormControl("", Validators.required),
		});
		this.apiService.getUserProfile().subscribe({
			next: (response) => {
				this.userName = response.name;
				this.userEmail = response.email;
				this.originalPfp = response.pfp;
				this.userPhone = response.phone;
				this.isPhoneVerified = response.isPhoneVerified || false;

				this.createdEvents = response.eventsCreated || [];
				this.registeredEvents = response.eventsRegistered || [];
				this.requestedEvents = response.eventsRequestedToJoin || [];

				this.imgUrl = response.pfp || "";
				this.profileForm.patchValue({
					name: this.userName,
				});

				this.user = response ?? {};
				this.cdr.detectChanges();
			},
			error: (error) => {
				console.error("Error fetching user profile:", error);
			},
		});
	}
}
