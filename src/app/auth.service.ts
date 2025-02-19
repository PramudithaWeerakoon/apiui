import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../environments/environment'; // Import environment

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl; // Use apiUrl from environment
  private loggedIn = false;
  private currentUser: any;

  constructor(private http: HttpClient) {
    this.loggedIn = !!localStorage.getItem('loggedIn');
    this.currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  }

  signUp(username: string, password: string, name: string): Observable<any> {
    console.log('SignUp called');
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { username, password, name };
    return this.http.post<any>(`${this.apiUrl}/Register`, body, { headers }).pipe(
      tap(response => {
        console.log('SignUp response:', response);
        if (response && response.success) {
          this.loggedIn = true;
          localStorage.setItem('loggedIn', 'true');
          this.setCurrentUser(response.user);
        }
      }),
      catchError(this.handleError<any>('signUp'))
    );
  }

  signIn(username: string, password: string): Observable<any> {
    console.log('SignIn called');
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { username, password };
    return this.http.post<any>(`${this.apiUrl}/Login`, body, { headers }).pipe(
      tap(response => {
        console.log('SignIn response:', response);
        if (response && response.success) {
          this.loggedIn = true;
          localStorage.setItem('loggedIn', 'true');
          this.setCurrentUser(response.user);
        }
      }),
      catchError(this.handleError<any>('signIn'))
    );
  }

  getCurrentUser(): any {
    return this.currentUser;
  }

  setCurrentUser(user: any): void {
    this.currentUser = user;
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  isLoggedIn(): boolean {
    console.log('isLoggedIn called, status:', this.loggedIn);
    return this.loggedIn;
  }

  logout(): void {
    console.log('Logout called');
    this.loggedIn = false;
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('currentUser');
    console.log('Logged out');
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}