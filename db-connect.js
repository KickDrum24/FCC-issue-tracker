// const mongoose = require("mongoose");
let mongoose;
try {
    mongoose = require("mongoose");
    if(mongoose){
        console.log("connected to db");
    }
} catch (e) {
    console.log(e);
}
const db = mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

module.exports = db;