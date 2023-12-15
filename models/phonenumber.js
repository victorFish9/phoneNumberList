const mongoose = require("mongoose")
//`mongodb+srv://victorcherkasov222:${password}@cluster0.rueauli.mongodb.net/phoneNumberList?retryWrites=true&w=majority`
mongoose.set('strictQuery', false)
const url = process.env.MONGODB_URI

console.log("Connecting to ", url)

mongoose.connect(url)
    .then(result => {
        console.log("All good!")
    }).catch((error) => {
        console.log("error to connect the MongoDB:", error.message)
    })



const phoneNumberSchema = new mongoose.Schema({
    name: String,
    number: String,
})

phoneNumberSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('PhoneNumber', phoneNumberSchema)