import { Schema, model } from 'mongoose'

const schema = new Schema({
  name: {
    type: String,
    required: [true, '服務項目名稱必填']
  },
  price: {
    type: Number,
    required: [true, '服務項目價格必填'],
    min: [0, '服務項目價格不能小於 0']
  },
  image: {
    type: String,
    required: [true, '服務項目圖片必填']
  },
  description: {
    type: String,
    required: [true, '服務項目說明必填']
  },
  category: {
    type: String,
    required: [true, '服務項目分類必填'],
    enum: {
      values: ['優惠專案', '個別火化', '團體火化', '紀念飾品區'],
      message: '服務項目分類錯誤'
    }
  },
  telephone: {
    type: Number,
    required: [true, '服務項目電話必填']
  },
  sell: {
    type: Boolean,
    required: [true, '服務項目上架狀態必填']
  }
}, {
  timestamps: true,
  versionKey: false
})

export default model('service', schema)
