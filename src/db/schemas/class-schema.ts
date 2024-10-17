import { model, Schema } from "mongoose"

const classSchema = new Schema({
  class_name: { type: String, unique: true },
  teacher_id: String,
  students: [String],
})

export const Class = model("classes", classSchema)