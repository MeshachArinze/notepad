const mongoose = require("mongoose");
const noteSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },

  password: {
    type: Strng,
    required: true,
  },

  roles: [
    {
      type: String,
      default: "Emplooyee",
    },
  ],

  active: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model("User", noteSchema);
