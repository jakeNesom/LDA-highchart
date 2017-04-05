import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { Dataset } from './definitions/dataset';

@Injectable ()
export class LoggerService {

    //private loggerUrl = 'api/loggerData';
    private loggerUrl = 'http://localhost:3039/read/getall/';

    constructor(private http: Http) {}

    getClients(): Promise<any> {
        return 
    }

    getLoggerData(): Promise <Dataset[]> {
        
        
        return this.http.get(this.loggerUrl)
            .toPromise()
             .then( function( response ) { 
                 console.log("logger response ");
                 return response.json() as Dataset[]; 
            })  
            //.then(response => response.json().data as Dataset[])
            .catch(this.handleError);
    }

    

    private handleError(error: any): Promise <any> {
       
        console.error('An error occured', error);
        return Promise.reject(error.message || error );
    }
}