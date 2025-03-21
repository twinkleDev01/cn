import { FormGroup } from '@angular/forms';

export function MustDiffer(controlName: string, matchingControlName: string) {
  return (formGroup: FormGroup) => {
    const control = formGroup.controls[controlName];
    const matchingControl = formGroup.controls[matchingControlName];

    if (matchingControl.errors && !matchingControl.errors['MustDiffer']) {
      return;
    }

    if (control.value === matchingControl.value) {
      matchingControl.setErrors({ mustDiffer: true });
    } else {
      matchingControl.setErrors(null);
    }
  };
}
