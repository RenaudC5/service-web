import { Component, OnInit } from '@angular/core';

import { Observable, pipe } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { Router } from '@angular/router';

import { Loan } from '../model/loan';
import { LoanService } from '../services/loan.service';
import { UserService } from '../services/user.service';
import { BookService } from '../services/book.service';

@Component({
  selector: 'app-loan-list',
  templateUrl: './loan-list.component.html',
  styleUrls: ['./loan-list.component.css']
})
export class LoanListComponent implements OnInit {
  public loans$: Observable<Loan[]>;

  constructor(private loanService: LoanService,
              private userService: UserService,
              private bookService: BookService,
              private router: Router) { }

  ngOnInit() {
    this.init();
  }

  public init() {
    this.loans$ = this.loanService.getAll().pipe(tap(this.addProperties.bind(this)));
  }

  private addProperties(loans: Loan[]) {
    for (const loan of loans) {
      this.userService.get(loan.userId).pipe(map(user => loan.user = user)).subscribe();
      this.bookService.getAll().pipe(map(
          books => loan.book = books.find(books => books.copies.find(copy => copy.id === loan.copyId))
      )).subscribe();
    }
  }


  public async return(loanId: string) {
    this.loanService.return(loanId)
        .pipe(
            tap(() => this.router.navigateByUrl('/books'))
        )
        .subscribe();
  }
}

