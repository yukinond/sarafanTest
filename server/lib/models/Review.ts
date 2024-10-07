import { Schema, model } from 'mongoose'
import { v4 as uuid } from 'uuid'

const ReviewSchema = new Schema({
  name: { type: String, required: true },
  rating: { type: Number, required: true },
  text: { type: String, required: false },
  date: { type: Date, required: true },
  user: { type: Schema.Types.String, ref: 'User', required: true },
  order: { type: Schema.Types.String, ref: 'Order', required: true },
  images: { type: Array, required: false },
  recipientphone: { type: String, required: true },
  createdAt: { type: Date, required: false, default: Date.now },
  products: { type: Array, required: false },
  uuid: { type: String, required: true, default: uuid() },
})

export const Review = model('Review', ReviewSchema)
