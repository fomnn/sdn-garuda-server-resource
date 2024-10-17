import { model, Schema } from "mongoose"

const parentsSchema = new Schema({
  first_name: String,
  middle_name: String,
  last_name: String,
  contact_number: { type: String, unique: true },
  email: String,
  gender: { type: String, enum: ["male", "female"] },
  address: String,
  occupation: String,
  children: [
    {
      student_id: String,
      relationship: { type: String, enum: ['father', 'mother', 'guardian'] }
    },
  ]
})

export const Parent = model("parents", parentsSchema)