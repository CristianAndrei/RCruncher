import {auth} from 'firebase';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, from } from 'rxjs';
import { AuthFirebaseSerivce } from './firebase-auth.service';
import { FirebaseService } from './firebase.service';
import { UserModel } from '../../models/user-models/user.model';

@Injectable({
    providedIn: 'root',
  })
export class UserService {

    private changeSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this.loggedIn);
    private userSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

    constructor(private authFirebaseSerivce: AuthFirebaseSerivce, private firebaseService: FirebaseService) {
    }

    private set loggedIn(value: boolean) {
        localStorage.setItem('loggin', value ? 'TRUE' : 'FALSE');
        this.changeSubject.next(value);
    }

    private get loggedIn(): boolean {
        return localStorage.getItem('loggin') === 'TRUE' ? true : false;
    }

    private setUser(): void {
        localStorage.setItem('userUid', this.userSubject.value.user.uid);
        localStorage.setItem('userEmail', this.userSubject.value.user.email);
    }

    private delUser(): void {
        localStorage.removeItem('userUid');
        localStorage.removeItem('userEmail');
    }

    private getUserUid() {
        return localStorage.getItem('userUid');
    }
    private getUserEmail(): string {
        return localStorage.getItem('userEmail');
    }

    public login(email: string, password: string): Observable<boolean> {
        return from(new Promise((resolve) =>
            this.authFirebaseSerivce.login(email, password).subscribe(
                (user) => {
                    this.loggedIn = true;
                    this.userSubject.next(user);
                    this.setUser();
                    resolve(true);
                },
                (err) => {
                    this.loggedIn = false;
                    this.delUser();
                    resolve(false);
                })));
    }

    public logout(): void {
        this.loggedIn = false;

        this.authFirebaseSerivce.logout().subscribe(
            (user) => {
                this.loggedIn = false;
                this.userSubject.next(null);
            },
            (err) => {
                this.loggedIn = true;
            });
    }

    public onLoginChange(): Observable<boolean> {
        return this.changeSubject.asObservable();
    }

    public get user() {
        return { uid: this.getUserUid(), email: this.getUserEmail() };
    }

    public get userObservable() {
        if (this.loggedIn) {
            return this.userSubject.asObservable();
        } else {
            return null;
        }
    }
    public createUser(userModel: UserModel) {
        userModel.uid = this.user.uid;
        const userRef = this.database.ref('users/' + userModel.uid)
            .set({ firstName: userModel.firstName, lastName: userModel.lastName, email: userModel.email },
                (e) => { if (!e) { } });

    }
    public getCurrentUser(): Observable<{}> {
        return from(new Promise((resolve) =>
            this.database.ref('users/' + this.user.uid).once('value')
                .then((snapshot) => resolve(snapshot.val()))));
    }

    public getCurrentUserRealTime(subject): void {
        this.database.ref('users/' + this.user.uid).on('value', (snapshot) => { subject.next(snapshot.val()); });
    }
    public getCurrentUserAuthToken(fileService: string): Observable<any> {
        return from(new Promise((resolve) =>
            this.database.ref('users/' + this.user.uid + '/' + fileService).once('value')
                .then((snapshot) => resolve(snapshot.val()))));
    }
    public updateValues(fields: string[], fieldsValue: string[]): Observable<any> {
        return from(new Promise((resolve, reject) => {
            this.getCurrentUser().subscribe((data) => {
                let i = 0;
                for (const field of fields) {
                    data[field] = fieldsValue[i];
                    i++;
                }
                this.database.ref('users/' + this.user.uid).update(data).then((d) => { resolve(d); }).catch((e) => reject(e));
            });
        }));
    }

    private get database() {
        return this.firebaseService.firebaseApp.database();
    }
}