const { v4: uuid } = require('uuid');
const _ = require('lodash');
const ValidationError = require('./validationError');

const checkCopy = function(copy) {
    if (!copy.submissionDate) {
        throw new ValidationError('The copy must have a submission date.');
    }
}

class CopyRepository {
    constructor(db, bookRepository) {
        this.db = db;
        this.bookRepository = bookRepository;
    }

    getAll(bookId) {
        const bookPath = this.bookRepository.getIdPath(bookId);
        if (bookPath == null) {
            throw new ValidationError('This book does not exists')
        }

        return this.db.getData(bookPath + '/copies');
    }

    getAllCopies() {
        const books = this.bookRepository.getAll()
        let copies = []

        books.forEach(book => {
            copies = copies.concat(book.copies)
        })

        return copies
    }

    get(bookId, copyId) {
        const copyPath = this.getIdPath(bookId, copyId);
        if (copyPath == null) {
            throw new ValidationError('This copy does not exists')
        }

        return this.db.getData(copyPath);
    }

    add(idBook, copy) {
        checkCopy(copy)
        copy.id = uuid();

        const books = this.bookRepository.getAll();
        const indexBook = _.findIndex(books, book => book.id === idBook);

        this.db.push(`/books[${indexBook}]/copies[]`, copy);

        return copy;
    }

    update(idBook, idCopy, copy) {
        if (copy.id !== idCopy) {
            throw new ValidationError('You cannot change the identifier.');
        }

        checkCopy(copy);
        const path = this.getIdPath(idBook, idCopy);
        if (path == null) {
            throw new ValidationError('This copy does not exists');
        }

        this.db.push(path, copy);

        return copy;
    }

    delete(idBook, idCopy) {
        const path = this.getIdPath(idBook, idCopy);
        if (path != null) {
            this.db.delete(path);
        }
    }
    
    getIdPath(bookId, id) {
        const copies = this.getAll(bookId);
        const index = _.findIndex(copies, { id });
        if (index == -1) {
            return null;
        }

        const bookPath = this.bookRepository.getIdPath(bookId);
        return bookPath +'/copies[' + index + ']';
    }
}

module.exports = CopyRepository;