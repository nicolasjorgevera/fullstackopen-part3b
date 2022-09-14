const mongoose =  require ('mongoose')

if (!(process.argv.length === 3 || process.argv.length === 5)) {
    console.log(`
    Usage:
    
    node mongo.js <password>                    Return all register in the agenda
    node mongo.js <password> <name> <number>    Add a register to de agenda
    
    `)
    process.exit(1)
}

const password = process.argv[2]

const url =
  //`mongodb+srv://fullstack:${password}@cluster0-ostce.mongodb.net/test?retryWrites=true`
  `mongodb+srv://fullstackopen:${password}@cluster0.2o7kwsc.mongodb.net/phoneagenda?retryWrites=true&w=majority`
mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name : String,
    number: String
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
    Person.find({}).then(result => {
        result.forEach(person => console.log(person))
    })
    mongoose.connection.close()
}

if (process.argv.length === 5){
    const name = process.argv[3]
    const number = process.argv[4]
    const person = new Person ({
        name : name,
        number : number
    })
    person.save().then(result => {
        console.log(`added ${name} number ${number} to phonebook`)
        mongoose.connection.close()
    })
}


