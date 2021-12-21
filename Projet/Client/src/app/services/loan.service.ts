import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { Injectable } from '@angular/core';

import { BaseHttpService } from './baseHttpService';
import { Loan } from '../model/loan';

@Injectable()
export class LoanService extends BaseHttpService {
  loan(copyId, userId): Observable<void> {

    const date = new Date()
    return this.http.post(`${this.baseUrl}/loans`,{
      loanDate: `${date.getFullYear()}/${date.getMonth()}/${date.getDate()}`,
      copyId: copyId,
      userId: userId
    })
      .pipe(
        map(() => null),
        catchError((err) => { console.log(err); return null; })
      );
  }

  public getAll(): Observable<Loan[]> {
    return this.http
        .get<Loan[]>(`${this.baseUrl}/loans`);
  }

  public return(loanId): Observable<void> {
    return this.http
        .delete<void>(`${this.baseUrl}/loans/${loanId}`);
  }
}
