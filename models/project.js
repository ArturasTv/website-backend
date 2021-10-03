const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  project_name: {
    type: String,
    required: true,
  },
  project_description: {
    type: String,
    required: true,
  },
  git_url: {
    type: String,
    required: false,
    default: "",
  },
  project_url: {
    type: String,
    required: false,
    default: "",
  },
  path_url: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    required: false,
    default: Date.now,
  },
});

module.exports = mongoose.model("Project", projectSchema);
