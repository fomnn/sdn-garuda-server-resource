import { model, Schema } from "mongoose"

const subjectSchema = new Schema({
  subject_name: String,
  grade: { type: Number, nullable: true }
})

export const Subject = model("subjects", subjectSchema)