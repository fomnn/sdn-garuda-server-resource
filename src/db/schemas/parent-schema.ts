import mongoose from "mongoose"

if (mongoose.models.parents) {
  console.log(mongoose.models.parents)
  delete mongoose.models.parents
}

const parentsSchema = new mongoose.Schema({
  name: { type: String, required: true },
  tahun_lahir: {type: Number, default: null},
  jenjang_pendidikan: {type: String, required: true },
  pekerjaan: {type: String, required: true },
  penghasilan: {type: String, required: true },
  NIK: { type: String, required: true },
})

export const Parent = mongoose.model("parents", parentsSchema)
