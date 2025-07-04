import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function validTagsValidator(): ValidatorFn {
	return (control: AbstractControl): ValidationErrors | null => {
		const value = control.value.toString().trim();
		if (!value) {
			return null;
		}
		const hasDoubleCommas = /, *,/.test(value);
		const endsWithComma = value.endsWith(",");
		const startsWithComma = value.startsWith(",");
		let errorsWhenSplitting = false;
		try {
			value.split(",").map((tag: string) => tag.trim());
		} catch {
			errorsWhenSplitting = true;
		}

		const isValid =
			!hasDoubleCommas &&
			!errorsWhenSplitting &&
			!endsWithComma &&
			!startsWithComma;

		return isValid
			? null
			: {
					hasDoubleCommas,
					errorsWhenSplitting,
					endsWithComma,
					startsWithComma,
			  };
	};
}
