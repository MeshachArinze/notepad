const mongoose = require("mongoose");
const AutoIncrement = require('mongoose-sequence')(mongoose);;
const noteSchema = new mongoose.Schema({
  username: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },

  title: {
    type: String,
    required: true,
  },
  
  text: 
    {
      type: String,
      default: "Emplooyee",
    },
  

  completed: {
    type: Boolean,
    default: true,
  },

  timestamps: true
});

noteSchema.plugin(AutoIncrement, {
    inc_field: 'ticket',
    id: 'ticketNums',
    start_seq: 500
})

module.exports = mongoose.model("Notes", noteSchema);
