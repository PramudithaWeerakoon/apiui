import { Component, OnInit } from '@angular/core';
import { UserService } from './UserService';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-profile-details',
  templateUrl: './profile-details.component.html',
  styleUrls: ['./profile-details.component.css']
})
export class ProfileDetailsComponent implements OnInit {
  user: any;

  constructor(private userService: UserService, private authService: AuthService) {}

  ngOnInit(): void {
    this.fetchUserDetails();
  }

  fetchUserDetails(): void {
    this.user = this.authService.getCurrentUser();
    if (this.user) {
      console.log('User details fetched successfully:', this.user);
    } else {
      console.error('Error fetching user details: User not logged in');
    }
  }
}