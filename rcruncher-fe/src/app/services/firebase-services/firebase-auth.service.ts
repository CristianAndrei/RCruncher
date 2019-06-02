import { auth, app, User } from 'firebase';
import { Observable, from } from 'rxjs';

import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';

@Injectable({
    providedIn: 'root',
  })
export class AuthFirebaseSerivce {

    constructor(private firebaseService: FirebaseService) {
        this.firebaseAuth.onAuthStateChanged((user) => this.onAuthStateChange(user));
    }

    private get firebaseAuth() {
        return this.firebaseService.firebaseApp.auth();
    }

    public register(email: string, password: string): Observable<auth.UserCredential> {
        return from(this.firebaseAuth.createUserWithEmailAndPassword(email, password));
    }

    public login(email: string, password: string): Observable<auth.UserCredential> {
        return from(this.firebaseAuth.signInWithEmailAndPassword(email, password));
    }

    public logout(): Observable<void> {
        return from(this.firebaseAuth.signOut());
    }

    private onAuthStateChange(user: any): void {
        //
    }
}