import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function endsAfterBegins(): ValidatorFn {
	return (formGroup: AbstractControl): ValidationErrors | null => {
		const beginsAt = new Date(formGroup.get("startDate")?.value).getTime();
		const endsAt = new Date(formGroup.get("endDate")?.value).getTime();
		if (!beginsAt || !endsAt) return null;
		if (beginsAt >= endsAt) {
			return { dateError: true };
		}
		return null;
	};
}
