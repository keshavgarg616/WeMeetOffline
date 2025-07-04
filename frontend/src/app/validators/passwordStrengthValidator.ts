import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function createPasswordValidator(): ValidatorFn {
	return (control: AbstractControl): ValidationErrors | null => {
		const value = control.value;
		if (!value) {
			return null;
		}
		const hasUpperCase = /[A-Z]+/.test(value);
		const hasLowerCase = /[a-z]+/.test(value);
		const hasNumeric = /[0-9]+/.test(value);
		const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]+/.test(value);
		const isLongEnough = value.length >= 8;
		const isValid =
			hasUpperCase &&
			hasLowerCase &&
			hasNumeric &&
			hasSpecialChar &&
			isLongEnough;

		return isValid
			? null
			: {
					hasUpperCase: !hasUpperCase,
					hasLowerCase: !hasLowerCase,
					hasNumeric: !hasNumeric,
					hasSpecialChar: !hasSpecialChar,
					isLongEnough: !isLongEnough,
			  };
	};
}

export function createPasswordMatchValidator(): ValidatorFn {
	return (formGroup: AbstractControl): ValidationErrors | null => {
		const password = formGroup.get("pswd")?.value;
		const confirmPassword = formGroup.get("confirmPswd")?.value;
		if (!password || !confirmPassword) return null;
		if (password !== confirmPassword) {
			return { passwordMismatch: true };
		}
		return null;
	};
}
