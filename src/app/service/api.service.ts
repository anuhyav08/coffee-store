import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})

export class ApiService {

    baseUri: string = 'http://localhost:4000/api/v1';
    headers = new HttpHeaders().set('Content-Type', 'application/json');

    constructor(private http: HttpClient) { }

    // Get all products
    getProducts() {
        return this.http.get(`${this.baseUri}/product`);
    }

    // Get product by id
    getProduct(id): Observable<any> {
        let url = `${this.baseUri}/product/${id}`;
        return this.http.get(url, { headers: this.headers }).pipe(
            map((res: Response) => {
                return res || {}
            }),
            catchError(this.errorMgmt)
        )
    }

    // Update product
    updateProduct(id, data): Observable<any> {
        let url = `${this.baseUri}/product/update/${id}`;
        return this.http.put(url, data, { headers: this.headers }).pipe(
            catchError(this.errorMgmt)
        )
    }

    // Error handling 
    errorMgmt(error: HttpErrorResponse) {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
            // Get client-side error
            errorMessage = error.error.message;
        } else {
            // Get server-side error
            errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }
        console.log(errorMessage);
        return throwError(errorMessage);
    }

}
