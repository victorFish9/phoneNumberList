const mongoose = require("mongoose")

if (process.argv.length < 3) {
    console.log("give password as argument")
    process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const phone = process.argv[4]
console.log(name, phone)
const url = `mongodb+srv://victorcherkasov222:${password}@cluster0.rueauli.mongodb.net/phoneNumberList?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const phoneNumberSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const PhoneNumber = mongoose.model('Phone number', phoneNumberSchema)

if (name && phone) {
    var phoneNumber = new PhoneNumber({
        name: name,
        number: phone
    })

    phoneNumber.save().then(result => {
        console.log(`added ${name} number ${phone} to phonebook`)
        mongoose.connection.close()
    })

} else {
    PhoneNumber.find({}).then(result => {
        result.forEach(x => {
            console.log(x)
        })
        mongoose.connection.close()
    })
}

