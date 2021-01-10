import { FormControl, Validators } from '@angular/forms';

const patternvalidation = Validators.pattern('.*\\S.*[a-zA-z0-9_-]');
export const profileForm = {
  nickname: new FormControl('', [Validators.required, Validators.maxLength(15), patternvalidation]),

  dob: new FormControl(new Date(), [Validators.required]),

  interest: new FormControl('Kampong', [Validators.required, Validators.maxLength(30), patternvalidation]),

  occupation: new FormControl('Explorer', [Validators.required, Validators.maxLength(30), patternvalidation]),

  about: new FormControl('', [Validators.required, Validators.maxLength(1000)]),

  profile_picture: new FormControl('https://images.pexels.com/photos/5089163/pexels-photo-5089163.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260'),
};
