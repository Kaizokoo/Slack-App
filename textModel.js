const mongoose = require("mongoose");

const textMessageSchema = mongoose.Schema({
  message: {
    type: String,
    required: true,
  },
});

const message = mongoose.model("message", textMessageSchema);
module.exports = message;
