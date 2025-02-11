import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent {
  username: string = '';
  password: string = '';
  rememberMe: boolean = false;  // ✅ Added rememberMe property
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  signIn() {
    this.authService.signIn(this.username, this.password).subscribe(response => {
      if (response.success) {
        // ✅ Save credentials to localStorage if rememberMe is checked
        if (this.rememberMe) {
          localStorage.setItem('rememberedUser', JSON.stringify({ username: this.username, password: this.password }));
        } else {
          localStorage.removeItem('rememberedUser');
        }

        this.router.navigate(['/products']);
      } else {
        this.errorMessage = 'Invalid username or password';
      }
    }, error => {
      if (error.status === 404) {
        this.errorMessage = 'User not found';
      } else if (error.status === 401) {
        this.errorMessage = 'Invalid credentials';
      } else if (error.status === 405) {
        this.errorMessage = 'Method Not Allowed. Please check the API endpoint and method.';
      } else {
        this.errorMessage = 'An error occurred. Please try again later.';
      }
      console.error('Sign-in failed', error);
    });
  }

  navigateToSignUp() {
    this.router.navigate(['/sign-up']);
  }

  // ✅ Load remembered credentials when the component initializes
  ngOnInit() {
    const rememberedUser = localStorage.getItem('rememberedUser');
    if (rememberedUser) {
      const { username, password } = JSON.parse(rememberedUser);
      this.username = username;
      this.password = password;
      this.rememberMe = true;
    }
  }
}
