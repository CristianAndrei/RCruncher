import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { get, post } from 'superagent';

@Injectable({
    providedIn: 'root',
})
export class DataService {
    private path = 'http://localhost:3000/';
    private userData = 'reddit-users/';
    private postData = 'reddit-posts/';

    public getTrainedUsers(): Observable<any> {
        return from(get(this.path + this.userData + 'trainingSet'));
    }
    public getUserDataByName(userName: string): Observable<any> {
        return from(get(this.path + this.userData + 'user/' + userName));
    }
    public getUserPrediction(userName: string): Observable<any> {
        return from(get(this.path + this.userData + 'user/' + userName + '/predict'));
    }
    public getUserTopics(userName: string): Observable<any> {
        return from(get(this.path + this.userData + 'user/' + userName + '/topics'));
    }
    public createUser(userName: string) {
        const dataLoad = {
            redditUserName: userName,
        };
        post(this.path + this.userData).send(dataLoad);
    }
    public refreshCommentsForUser(userName: string) {
        const dataLoad = {
            redditUserName: userName,
        };
        post(this.path + this.userData + '/refreshComments').send(dataLoad);
    }
    public refreshTopicsForUser(userName: string) {
        const dataLoad = {
            redditUserName: userName,
        };
        post(this.path + this.userData + '/refreshTopics').send(dataLoad);
    }
    public refreshSubmittedForUser(userName: string) {
        const dataLoad = {
            redditUserName: userName,
        };
        post(this.path + this.userData + '/refreshSubmitted').send(dataLoad);
    }
    public analyzePost(url: string) {
        const dataLoad = {
            postURL: url
        };
        post(this.path + this.postData + 'url').send(dataLoad);
    }
    public getPostData(postURL: string): Observable<any> {
        return from(get(this.path + this.postData + 'post').
            query({ url: postURL }));
    }
}
