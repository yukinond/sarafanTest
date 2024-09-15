import { Schema, model } from 'mongoose'
import { v4 as uuid } from 'uuid'


const CookingSchema = new Schema({
  type: { type: String, required: true },
  name: { type: String, required: true },
  composition: { type: String, required: true },
  image: { type: String, required: true },
  createdDate: { type: Date, default: new Date() },
  uuid: { type: String, required: true, default: uuid() },
  updatedDate: { type: Date, default: null },
})


export const Cooking = model('Cooking', CookingSchema)
