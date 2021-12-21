import { User } from "./user";
import { Book } from "./book";

export class Loan {
    public user: User;
    public book: Book;
    constructor(
        public id: string,
        public userId: string,
        public copyId: string,
        public loanDate: string
    ) {}
}