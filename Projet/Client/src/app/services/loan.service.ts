import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { Injectable } from '@angular/core';

import { BaseHttpService } from './baseHttpService';

@Injectable()
export class LoanService extends BaseHttpService {
  loan(copyId, userId): Observable<void> {

    const date = new Date()
    /* to be changed */
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
}
