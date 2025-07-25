require("dotenv").config();
const mongoose = require("mongoose");

const connectDB = () =>
  main()
    .then(() => console.log("connection Successful!"))
    .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(process.env.MONGO_URI); //database connection
}
module.exports = connectDB;
