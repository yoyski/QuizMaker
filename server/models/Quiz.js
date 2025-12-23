import mongoose from "mongoose";

// Option is just a string, no need for separate schema
const questionSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
      trim: true,
    },
    options: {
      type: [String], // Array of option strings
      validate: {
        validator: function (v) {
          return v.length >= 2; // Must have at least 2 options
        },
        message: "Each question must have at least 2 options",
      },
    },
    correctIndex: {
      type: Number,
      default: null, // Can be null if no correct answer is selected yet
    },
  },
  { _id: true } // Each question will have its own _id
);

const quizSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: "Untitled Quiz",
      trim: true,
    },
    questions: {
      type: [questionSchema],
      default: [],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, 
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true } // createdAt and updatedAt
);

export default mongoose.model("Quiz", quizSchema);
