import { FormControl } from '@angular/forms';
import Constants from '../constants';

var identityControl = '';

export class InputValidator {
    static validateName(control: FormControl) {
        if (control.value.length < 3) {
            return { invalidName: true, message: 'Your name is invalid. It must contain atleast 3 letters' }
        }

        return null;
    }

    static validateLocation(control: FormControl) {
        if (control.value.length < 3) {
            return { invalidName: true, message: 'Your location is invalid. It must contain atleast 3 letters' }
        }

        return null;
    }

    static validateDesiredDish(control: FormControl) {
        if (control.value.length < 3) {
            return { invalidName: true, message: 'Your desired dish is invalid. It must contain atleast 3 letters' }
        }

        return null;
    }

    static validatePassword(control: FormControl) {
        if (control.value.length <= 8) {
            return { invalidPassword: true, message: 'Your password is invalid. It must contain atleast 8 symbols'}
        }
        identityControl = control.value;
        return null;
    }
    static validateIdentityPassword(control: FormControl) {
        if (control.value != identityControl) {
            return { invalidPassword: true, message: 'Passwords must be the same' }
        }
        return null;
    }

    static validateEmail(control: FormControl) {
        if ( !Constants.EMAIL_REGEXP.test(control.value)) {
            return { invalidEmail: true, message: 'Your email is invalid. It must contain "@", "." and domain name of your mail' }
        }

        return null;
    }

}
