const mongoose = require("mongoose");

//Job Schema
const jobSchema = new mongoose.Schema(
  {
    externalId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    title: String,
    description: String,
    company: String,
    location: String,
    category: String,
    type: String,
    url: String,
    postedAt: Date,
    source: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Job", jobSchema);
