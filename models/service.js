// 從 mongoose 導入 Schema 和 model，用於創建 MongoDB 文檔的模式和模型。
import { Schema, model } from 'mongoose'

// 定義一個新的模式 schema，用於描述服務項目的結構和驗證。
const schema = new Schema({
  // 定義 name 欄位，用於存儲服務項目的名稱。
  name: {
    type: String, // 欄位類型為字串。
    required: [true, '服務項目名稱必填'] // 此欄位必填，未提供時返回錯誤信息。
  },
  price: { // 定義 price 欄位，用於存儲服務項目的價格。
    type: Number,
    required: [true, '服務項目價格必填'],
    min: [0, '服務項目價格不能小於 0']
  },
  image: {
    type: String,
    required: [true, '服務項目圖片必填']
  },
  description: { // 定義 description 欄位，用於存儲服務項目的詳細說明。
    type: String,
    required: [true, '服務項目說明必填']
  },
  category: { // 定義 category 欄位，用於存儲服務項目的分類。
    type: String,
    required: [true, '服務項目分類必填'],
    enum: {
      values: ['優惠專案', '個別火化', '團體火化'],
      message: '服務項目分類錯誤'
    }
  },
  sell: { // 定義 sell 欄位，用於表示服務項目的上架狀態。
    type: Boolean,
    required: [true, '服務項目上架狀態必填']
  }
}, {
  // 啟用時間戳，Mongoose 會自動添加 createdAt 和 updatedAt 欄位。
  timestamps: true,
  // 禁用版本鍵，避免自動生成 __v 欄位。
  versionKey: false
})
// 使用模式 schema 創建一個 Mongoose 模型 services，並導出該模型。
export default model('services', schema)
