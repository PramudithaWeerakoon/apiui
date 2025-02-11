import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent {
  username: string = '';
  email: string = ''; // Added email property
  password: string = '';
  confirmPassword: string = ''; // Added confirmPassword property
  termsAccepted: boolean = false; // Added termsAccepted property
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  signUp() {
    if (!this.termsAccepted) {
      this.errorMessage = 'You must accept the terms and conditions.';
      return;
    }

    

    this.authService.signUp(this.username, this.email, this.password).subscribe(response => {
      if (response.success) {
        this.router.navigate(['/products']);
      } else {
        this.errorMessage = response.message || 'Sign-up failed';
      }
    }, error => {
      this.errorMessage = 'An error occurred. Please try again later.';
      console.error('Sign-up failed', error);
    });
  }
}

