import { Injectable } from '@angular/core';
import { Headers, Http, Response, RequestOptions } from '@angular/http';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';

import { Dataset } from './definitions/dataset';

@Injectable ()
export class LoggerService {

    //private loggerUrl = 'api/loggerData';
    private loggerUrl = 'http://localhost:3039/read/getall/';
    private filterUrl = 'http://localhost:3039/read/filterget';
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

    
    getRangeA(filter:object): Promise <Dataset[]> {
        let filterStr = JSON.stringify(filter);
        const url = this.filterUrl + '$filter=' + filterStr;
        console.log(url);
        return this.http.get(url)
            .toPromise()
            .then( function(response) { 
                console.log("Response from server: " + response as Object);
                return response.json()
            })
            .catch( this.handleError);
    }

    // POST version
    getRange(data: object): Observable <Dataset[]> {
        console.log( "data beign sent " + JSON.stringify(data) );
        let headers = new Headers({'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        const url = this.filterUrl;

        return this.http.post(url, data, options)
            .map(this.extractData )
            .catch(this.handleError);
    }

    private extractData(res: Response) {
        
        console.log(".map filred, .extractData fired" );
        let body = res.json();
        return body.data || { };
    }
    private handleError(error: any): Promise <any> {
       
        console.error('An error occured', error);
        return Promise.reject(error.message || error );
    }
}