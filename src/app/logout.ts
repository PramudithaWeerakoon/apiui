import { Component } from '@angular/core';
import { AuthService } from './auth.service'; // Adjust the path if necessary

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent {
  username: string = '';
  password: string = '';

  constructor(private authService: AuthService) { }

  onSubmit() {
    this.authService.signIn(this.username, this.password).subscribe(response => {
      if (response.success) {
        console.log('Login successful');
      } else {
        console.log('Login failed:', response.message);
      }
    });
  }
}