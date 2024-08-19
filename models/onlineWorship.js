import { Schema, model } from 'mongoose'
// import validator from 'validator'
// 定義一個新的 Mongoose Schema，這裡用於創建線上祭祀商品的數據模型
const schema = new Schema({
  image: {
    type: String,
    required: [true, '寶貝圖片必填']
  },
  name: {
    type: String,
    required: [true, '寶貝名稱必填']
  },
  date: {
    type: Date,
    required: [false, '日期必填']
  },
  description: {
    type: String,
    required: [false, '可以跟寶貝說說話']
  }
}, {
  timestamps: true,
  versionKey: false
})
// 使用定義好的 schema 創建並導出一個模型，模型名為 'onlineWorship'
export default model('onlineWorship', schema)
