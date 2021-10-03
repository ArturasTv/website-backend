const mongoose = require("mongoose");

const repositorySchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  html_url: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    //required: true,
    default: "description",
  },
  language: {
    type: String,
    //required: true,
    default: "language",
  },
  created_at: {
    type: String,
    required: false,
  },
});

module.exports = mongoose.model("Repository", repositorySchema);
