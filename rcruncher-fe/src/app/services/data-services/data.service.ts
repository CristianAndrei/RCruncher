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
    public createUser(userName: string): Observable<any> {
        const dataLoad = {
            redditUserName: userName,
        };
        return from(post(this.path + this.userData).send(dataLoad));
    }
    public refreshCommentsForUser(userName: string): Observable<any> {
        const dataLoad = {
            redditUserName: userName,
        };
        return from(post(this.path + this.userData + '/refreshComments').send(dataLoad));
    }
    public refreshTopicsForUser(userName: string): Observable<any> {
        console.log(userName);
        return from(post(this.path + this.userData + 'refreshTopics')
            .send({
                redditUserName: userName,
            }));
    }
    public refreshSubmittedForUser(userName: string): Observable<any> {
        const dataLoad = {
            redditUserName: userName,
        };
        return from(post(this.path + this.userData + '/refreshSubmitted').
            send(dataLoad));
    }
    public analyzePost(url: string): Observable<any> {
        const dataLoad = {
            postURL: url
        };
        return from(post(this.path + this.postData + 'url').send(dataLoad));
    }
    public getPostData(postURL: string): Observable<any> {
        console.log(postURL);
        return from(get(this.path + this.postData + 'post?url=' + postURL));
    }

    public getRecommendedData(userName: string): Observable<any> {
        return from(get(this.path + this.userData + 'user/' + userName + '/recommended'));
    }

    public getApplicationData(): Observable<any> {
        return from(get(this.path + this.userData + 'applicationData'));
    }
}
