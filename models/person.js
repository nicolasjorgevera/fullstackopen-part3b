const mongoose = require ('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const url = process.env.MONGODB_URI

console.log('connecting to', url);

mongoose.connect(url)
// mongoose.connect('mongodb+srv://fullstackopen:fullstackopen@cluster0.2o7kwsc.mongodb.net/phoneagenda?retryWrites=true&w=majority')
    .then (result => console.log('connected to MongoDB'))
    .catch ((error) => console.log('error connecting to MongoDB:', error.message))

mongoose.plugin(schema => {
    schema.pre('findByIdAndUpdate' , setRunValidators)
    schema.pre('findOneAndUpdate' , setRunValidators)
})
function setRunValidators (){
    this.setOptions({ runValidators: true})
}

const personSchema = new mongoose.Schema ({
    name :  {
        type: String,
        minlength: 3,
        unique: true
    },
    number : {
        type: String,
        minlength: 8
    }
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString ()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

personSchema.plugin(uniqueValidator)

module.exports = mongoose.model('Person', personSchema)

