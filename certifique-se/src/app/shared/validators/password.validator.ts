import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export interface PasswordRequirementChecks {
  minLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSpecial: boolean;
  passedCount: number;
  isValid: boolean;
}

const UPPERCASE_REGEX = /[A-Z]/;
const LOWERCASE_REGEX = /[a-z]/;
const NUMBER_REGEX = /[0-9]/;
const SPECIAL_CHAR_REGEX = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/;

export function evaluatePasswordRequirements(value: string | null | undefined): PasswordRequirementChecks {
  const pwd = value || "";
  const minLength = pwd.length >= 8;
  const hasUppercase = UPPERCASE_REGEX.test(pwd);
  const hasLowercase = LOWERCASE_REGEX.test(pwd);
  const hasNumber = NUMBER_REGEX.test(pwd);
  const hasSpecial = SPECIAL_CHAR_REGEX.test(pwd);

  const checks = [minLength, hasUppercase, hasLowercase, hasNumber, hasSpecial];
  const passedCount = checks.filter(Boolean).length;
  const isValid = passedCount === checks.length;

  return {
    minLength,
    hasUppercase,
    hasLowercase,
    hasNumber,
    hasSpecial,
    passedCount,
    isValid
  };
}

export function strongPasswordValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value as string;
    if (!value) {
      return null; // Let Validators.required handle empty values
    }

    const checks = evaluatePasswordRequirements(value);
    if (checks.isValid) {
      return null;
    }

    const errors: ValidationErrors = {};
    if (!checks.minLength) errors["minLength"] = true;
    if (!checks.hasUppercase) errors["missingUppercase"] = true;
    if (!checks.hasLowercase) errors["missingLowercase"] = true;
    if (!checks.hasNumber) errors["missingNumber"] = true;
    if (!checks.hasSpecial) errors["missingSpecial"] = true;

    return errors;
  };
}

