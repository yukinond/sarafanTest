import { Schema, model } from 'mongoose'
import { v4 as uuid } from 'uuid'


const MenuSchema = new Schema({
  menuType: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: String, required: true },
  image: { type: String, required: true },
  isAvailable : { type: Boolean, required: true, default: false },
  createdDate: { type: Date, default: new Date() },
  cooking: { type:Array, required: false, default: [] },
  details: { type: Array, required: false, default: [] },
  uuid: { type: String, required: true, default: uuid() },
  updatedDate: { type: Date, default: null },
})


export const Menu = model('Menu', MenuSchema)
