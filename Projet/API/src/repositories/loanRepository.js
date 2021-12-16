const { v4: uuid } = require('uuid');
const _ = require('lodash');
const ValidationError = require('./validationError');

const checkLoan = function(loan) {
    if (!loan.loanDate) {
        throw new ValidationError('The loan must have a date.');
    }
    if (!loan.userId) {
        throw new ValidationError('The loan must have a userId.');
    }
    if (!loan.copyId) {
        throw new ValidationError('The loan must have a copyId.');
    }
}

const checkValidity = function (loan, users, copies ) {
    const user = loan.userId;
    if (!(_.some(users, { id : user }))) {
        throw new ValidationError('This user does not exist.');
    }

    const copy = loan.copyId;
    if (!(_.some(copies, { id : copy }))) {
        throw new ValidationError('This copy does not exist.');
    }
}

const checkAvaibility = function (loan, loans) {
    if (_.some(loans, { copyId : loan.copyId })) {
        throw new ValidationError('This copy has already been loaned');
    }
}

class LoanRepository {
    constructor(db, userRepository, copyRepository) {
        this.db = db;
        this.userRepository = userRepository;
        this.copyRepository = copyRepository;
    }

    getAll() {
        return this.db.getData("/loans");
    }

    add(loan) {
        const users = this.userRepository.getAll();
        const copies = this.copyRepository.getAllCopies();
        const loans = this.getAll();

        checkLoan(loan);
        checkValidity(loan, users, copies);
        checkAvaibility(loan, loans);

        loan.id = uuid();
        this.db.push("/loans[]", loan);

        return loan;
    }

    get(id) {
        const loans = this.getAll();
        return _.find(loans, { id });
    }

    delete(id) {
        const path = this.getIdPath(id);
        if (path != null) {
            this.db.delete(path);
        }
        
    }

    getUserAllLoans(userId) {
        const loans = this.getAll()

        return loans.filter(loan => loan.userId === userId)
    }

    getIdPath(id) {
        const loans = this.getAll();
        const index = _.findIndex(loans, { id });
        if (index == -1) {
            return null;
        }

        return '/loans[' + index + ']';
    }
}

module.exports = LoanRepository;