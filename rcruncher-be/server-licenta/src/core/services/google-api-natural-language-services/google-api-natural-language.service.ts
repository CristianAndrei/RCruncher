import { Injectable } from '@nestjs/common';
import { Observable, from } from 'rxjs';
import { post } from 'superagent';
import { NaturalLanguageGoogleApiSettings } from './google-api.key';

Injectable()
export class NaturalLanguageService {
    private baseUrl = 'https://language.googleapis.com/v1/documents:';
    private aE = 'analyzeEntities';
    private aES = 'analyzeEntitySentiment';
    private aS = 'analyzeSentiment';
    private aSx = 'analyzeSyntax';
    private aT = 'annotateText'; // MIGHT BE USED LATER
    private cT = 'classifyText';

    public analyzeEntities(textToAnalyze: string, type: string = 'PLAIN_TEXT'): Observable<any> {
        const dataSent = {
            document: {
                content: textToAnalyze,
                type,
            },
        };
        return from(
            post(this.baseUrl + this.aE)
                .query('key=' + NaturalLanguageGoogleApiSettings.apiKey)
                .send(dataSent),
        );
    }
    public analyzeEntitySentiment(textToAnalyze: string, type: string = 'PLAIN_TEXT'): Observable<any> {
        const dataSent = {
            document: {
                content: textToAnalyze,
                type,
            },
        };
        return from(
            post(this.baseUrl + this.aES)
                .query('key=' + NaturalLanguageGoogleApiSettings.apiKey)
                .send(dataSent),
        );
    }
    public analyzeSentiment(textToAnalyze: string, type: string = 'PLAIN_TEXT'): Observable<any> {
        const dataSent = {
            document: {
                content: textToAnalyze,
                type,
            },
        };
        return from(
            post(this.baseUrl + this.aS)
                .query('key=' + NaturalLanguageGoogleApiSettings.apiKey)
                .send(dataSent),
        );
    }

    public analyzeSyntax(textToAnalyze: string, type: string = 'PLAIN_TEXT'): Observable<any> {
        const dataSent = {
            document: {
                content: textToAnalyze,
                type,
            },
        };
        return from(
            post(this.baseUrl + this.aSx)
                .query('key=' + NaturalLanguageGoogleApiSettings.apiKey)
                .send(dataSent),
        );
    }
    public classifyText(textToAnalyze: string, type: string = 'PLAIN_TEXT'): Observable<any> {
        const dataSent = {
            document: {
                content: textToAnalyze,
                type,
            },
        };
        return from(
            post(this.baseUrl + this.cT)
                .query('key=' + NaturalLanguageGoogleApiSettings.apiKey)
                .send(dataSent),
        );
    }
}
