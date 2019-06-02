import * as firebase from 'firebase';
import {
    firebaseConfig
} from './firebase.config';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
  })
export class FirebaseService {
    private _firebaseApp: firebase.app.App;
    constructor() {
        this._firebaseApp = (firebase as any).default.initializeApp(firebaseConfig);
    }

    public get firebaseApp(): firebase.app.App {
        return this._firebaseApp;
    }
}