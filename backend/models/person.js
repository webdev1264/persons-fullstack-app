const mongoose = require("mongoose");

const MONGODB_URI = process.env.MONGODB_URI;

mongoose.set("strictQuery", false);
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((e) => console.log("Error connecting to MongoDB", e.message));

const personSchema = new mongoose.Schema({
  name: { type: String, minLength: 3, required: true },
  number: {
    type: String,
    required: true,
    validate: {
      validator: (number) => {
        return /^\d{2,3}-\d{6,8}$/.test(number);
      },
      message: (props) => `${props.value} is not a valid telephone number.`,
    },
  },
});

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Person", personSchema);
