const personsRouter = require("express").Router();
const Person = require("../models/person");

personsRouter.get("/", (request, response, next) => {
    Person.find({})
        .then(persons => {
            response.json(persons);
        })
        .catch(error => next(error));
});

personsRouter.get("/info", (request, response, next) => {
    Person.countDocuments()
        .then(result => {
            const message = `
                <p>Phonebook has info for ${result} people</p>
                <p>${Date()}</p>
            `;
            response.send(message);
        })
        .catch(error => next(error));
});

personsRouter.get("/:id", (request, response, next) => {
    Person.findById(request.params.id)
        .then(person => {
            if (person) {
                response.json(person);
            } else {
                response.status(404).end();
            }
        })
        .catch(error => next(error));
});

personsRouter.delete("/:id", (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
        .then(() => {
            response.status(204).end();
        })
        .catch(error => next(error));
});

personsRouter.post("/", (request, response, next) => {
    const body = request.body;

    if (body.name === undefined || body.number === undefined) {
        return response.status(400).json({
            error: "Missing name or number"
        });
    }

    const person = new Person({
        name: body.name,
        number: body.number
    });

    person.save()
        .then(savedPerson => {
            response.json(savedPerson);
        })
        .catch(error => next(error));
});

personsRouter.put("/:id", (request, response, next) => {
    const body = request.body;

    const person = {
        name: body.name,
        number: body.number
    };

    Person.findByIdAndUpdate(request.params.id, person, { new: true, runValidators: true, context: "query" })
        .then(updatedPerson => {
            response.json(updatedPerson);
        })
        .catch(error => next(error));
});

module.exports = personsRouter;
