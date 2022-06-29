// This is a test file for Mongo/Mongoose.

const mongoose = require("mongoose");

if (process.argv.length < 3) {
    console.log("Choose one method: node mongo.js <password> OR node mongo.js <password> <new_name> <new_number>");
    process.exit(1);
}

const password = process.argv[2];
const newName = process.argv[3];
const newNumber = process.argv[4];

const url = `mongodb+srv://exc:${password}@cluster0.dbpaaus.mongodb.net/phonebookApp?retryWrites=true&w=majority`;

const personSchema = new mongoose.Schema({
    name: String,
    number: String
});

const Person = mongoose.model("Person", personSchema);

mongoose
    .connect(url)
    .then(() => {
        if (process.argv.length === 3) {
            console.log("Phonebook:");
            Person.find({}).then(result => {
                result.forEach(person => {
                    console.log(person.name, person.number);
                });
                mongoose.connection.close();
            });
        } else {
            const person = new Person({
                name: newName,
                number: newNumber
            });

            return person.save().then(() => {
                mongoose.connection.close();
            });
        }
    });
