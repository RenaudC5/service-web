class copyController {
    constructor(copyRepository) {
        this.copyRepository = copyRepository;
    }

    getAll(req, res) {
        const copies = this.copyRepository.getAll(req.params.bookId);
        res.json(copies);
    }

    create(req, res) {
        const bookId = req.params.bookId
        const copy = this.copyRepository.add(bookId, req.body);

        res.location(`/books/${bookId}/copies/${copy.id}`);
        res.status(201).send(copy);
    }
    
    get(req, res) {
        const copy = this.copyRepository.get(req.params.bookId, req.params.copyId);
        if (copy == null) {
            res.status(404).send(null);
        } else {
            res.status(200).send(copy);
        }
    }
    
    update(req, res) {
        const copy = this.copyRepository.update(req.params.bookId, req.params.copyId, req.body)
        res.status(200).send(copy);
    }

    getAvailableCopies(req, res) {
        const copy = this.copyRepository.getAvailableCopies(req.params.bookId)
        res.status(200).send(copy);
    }
    
    delete(req, res) {
        this.copyRepository.delete(req.params.bookId, req.params.copyId);
        res.status(204).send(null);
    }
}

module.exports = copyController;