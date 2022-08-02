import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';

import { throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

export interface Api {
  data: TableData[];
  jsonapi: object
  links: Links;
}

export interface TableData {
  attributes: Attribute,
  id: string,
  links: Link,
  type: string
}

export interface Attribute {
  title: string,
  abbreviation: string | null,
  submission_address: Address | null,
  website: Website | null
}

interface Website {
  options: [],
  title: string
  uri: string
}

interface Link { self: { href: string } }

export interface Address {
  address_line1: string,
  address_line2: string,
  administrative_area: string,
  country_code: string,
  dependent_locality: string,
  langcode: string,
  locality: string,
  postal_code: string,
  sorting_code: string,
}

export interface Links {
  first: { href: string; } | undefined;
  next: { href: string; } | undefined;
  self: { href: string; };
  prev: { href: string; } | undefined;
}

@Injectable()
export class AppService {

  headers = {
    'X-API-Key': 'byqPCeM9bZbReuIB9572yk3Tz68NcpUJMHsqs1SI'
  }

  constructor(private http: HttpClient) {}

  getApiData(src: string) {
    return this.http.get<Api>(src, {headers: this.headers})
      .pipe(
        retry(3), // retry a failed request up to 3 times
        catchError(this.handleError) // then handle the error
      );
  }

  getDetailsData(src: string) {
    return this.http.get<Api>(src, {headers: this.headers})
      .pipe(
        retry(3), // retry a failed request up to 3 times
        catchError(this.handleError) // then handle the error
      );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `, error.error);
    }
    // Return an observable with a user-facing error message.
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }

}
