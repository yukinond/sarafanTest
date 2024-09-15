import { Schema, model } from 'mongoose'
import { v4 as uuid } from 'uuid'


const OrderSchema = new Schema({
  user: { type: Schema.Types.String, ref: 'User', required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  createdDate: { type: Date, default: new Date() },
  uuid: { type: String, required: true, default: uuid() },
  pickup: { type: Boolean, default: true },
  products: { type: Array, required: true },
  status: { type: String, required: true, default: 'created' },
  comment: { type: String, required: true, default: 'Нет.' },
  updatedDate: { type: Date, default: null },
})


export const Order = model('Order', OrderSchema)
