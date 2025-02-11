import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://localhost:7080/api/Users'; // Update this URL to match your back-end
  private loggedIn = false; // Add a property to track login status

  constructor(private http: HttpClient) {
    this.loggedIn = !!localStorage.getItem('loggedIn'); // Check if user is logged in based on local storage
  }

  // Sign-up method
  signUp(username: string, password: string, name: string): Observable<any> {
    console.log('SignUp called');
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { username, password, name };
    return this.http.post<any>(`${this.apiUrl}/Register`, body, { headers }).pipe(
      tap(response => {
        console.log('SignUp response:', response);
        if (response && response.success) { // Check for 'success' property
          this.loggedIn = true; // Set loggedIn to true on successful sign-up
          localStorage.setItem('loggedIn', 'true'); // Store login status in local storage
        }
      }),
      catchError(this.handleError<any>('signUp'))
    );
  }

  // Sign-in method
  signIn(username: string, password: string): Observable<any> {
    console.log('SignIn called');
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { username, password };
    return this.http.post<any>(`${this.apiUrl}/Login`, body, { headers }).pipe(
      tap(response => {
        console.log('SignIn response:', response);
        if (response && response.success) { // Check for 'success' property
          this.loggedIn = true; // Set loggedIn to true on successful sign-in
          localStorage.setItem('loggedIn', 'true'); // Store login status in local storage
        }
      }),
      catchError(this.handleError<any>('signIn'))
    );
  }

  // Method to check if the user is logged in
  isLoggedIn(): boolean {
    console.log('isLoggedIn called, status:', this.loggedIn);
    return this.loggedIn;
  }

  // Logout method
  logout(): void {
    console.log('Logout called');
    this.loggedIn = false; // Set loggedIn to false on logout
    localStorage.removeItem('loggedIn'); // Clear login state from local storage
    console.log('Logged out');
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}