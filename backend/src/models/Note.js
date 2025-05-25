import mongoose from "mongoose";

// 1 - create a schema
const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true } // mongoDB auto gives createdAt, updatedAt fields
);

// 2 - create model based off of that schema
const Note = mongoose.model("Note", noteSchema);

export default Note;
