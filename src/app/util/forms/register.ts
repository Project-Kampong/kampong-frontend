import { FormControl, Validators } from '@angular/forms';

var regularExpression = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,25}$/;
const PASSWORD_REGEX = Validators.pattern(regularExpression);

export const registerForm = {
  first_name: new FormControl('', [Validators.maxLength(25), Validators.required]),

  last_name: new FormControl('', [Validators.maxLength(25), Validators.required]),

  nick_name: new FormControl('', [Validators.maxLength(15), Validators.required]),

  email: new FormControl('', [Validators.email, Validators.required]),

  password: new FormControl('', [Validators.minLength(8), Validators.required, PASSWORD_REGEX]),

  confirmPassword: new FormControl(''),

  termsAndCondition: new FormControl(false, [Validators.requiredTrue]),
};
