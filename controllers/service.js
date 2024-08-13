import Service from '../models/service.js'
import { StatusCodes } from 'http-status-codes'
import validator from 'validator'

// 匯出一個名為 'create' 的非同步函數，用於處理創建新的服務資源
export const create = async (req, res) => {
  try {
    // 將上傳文件的路徑儲存到請求主體 (req.body) 的 image 屬性中
    req.body.image = req.file.path
    // 使用 Service 模型創建新的服務資源，並將請求主體 (req.body) 的數據傳入
    const result = await Service.create(req.body)
    // 如果創建成功，回應狀態碼 200 (OK)，並回傳成功訊息和結果
    res.status(StatusCodes.OK).json({
      success: true,
      // 這裡的 message 是一個空字符串，通常用來傳遞任何附加的訊息
      // 在這個情況下，由於操作成功且不需要特別的訊息，所以是空的。
      message: '',
      // 這裡的 result 是一個變數，包含了創建新服務資源後返回的結果。
      // 這可能是一個資料庫紀錄或其他相關的數據，將它返回給客戶端，以便客戶端知道創建了什麼。
      result
    })
  } catch (error) {
    // 如果捕捉到錯誤且錯誤類型為 'ValidationError'，表示數據驗證失敗
    if (error.name === 'ValidationError') {
      // 取得錯誤對應的第一個鍵名
      const key = Object.keys(error.errors)[0]
      // 根據鍵名取得對應的錯誤訊息
      const message = error.errors[key].message
      // 回應狀態碼 400 (Bad Request)，並回傳錯誤訊息
      // res.json() 方法將 JavaScript 對象轉換為 JSON 格式，並作為 HTTP 回應的主體發送給客戶端。
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message
      })
    } else {
      // 如果捕捉到其他錯誤，回應狀態碼 500 (Internal Server Error)，並回傳通用的錯誤訊息
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: '未知錯誤'
      })
    }
  }
}

export const getAll = async (req, res) => {
  try {
    // 取得排序參數，如果未提供則使用默認值
    const sortBy = req.query.sortBy || 'createdAt'
    const sortOrder = req.query.sortOrder || 'desc'
    const regex = new RegExp(req.query.search || '', 'i')

    // 查詢資料庫，根據搜尋條件及排序參數取得所有匹配的產品資料
    const data = await Service
      .find({
        $or: [
          { name: regex },
          { description: regex }
        ]
      })
      .sort({ [sortBy]: sortOrder })

    // 計算所有產品的總數量
    const total = await Service.estimatedDocumentCount()

    // 回應狀態碼 200 (OK)，並返回成功訊息和查詢結果
    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result: {
        data,
        total
      }
    })
  } catch (error) {
    // 打印錯誤訊息並回應通用的伺服器內部錯誤訊息
    console.log(error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: '未知錯誤'
    })
  }
}

// 匯出一個名為 'edit' 的非同步函數，用於編輯現有的產品資源
export const edit = async (req, res) => {
  try {
    // 驗證傳入的產品 ID 是否為有效的 MongoDB ID，如果無效則拋出錯誤
    if (!validator.isMongoId(req.params.id)) throw new Error('ID')
    // 將上傳文件的路徑儲存到請求主體 (req.body) 的 image 屬性中，如果文件存在的話
    req.body.image = req.file?.path

    // 使用 Service 模型查找並更新指定 ID 的產品資料
    // `findByIdAndUpdate` 方法會根據傳入的 ID 更新產品資料
    // `runValidators: true` 會在更新操作時執行模型的驗證
    // 如果找不到產品，`orFail` 方法會拋出一個 'NOT FOUND' 的錯誤
    await Service.findByIdAndUpdate(req.params.id, req.body, { runValidators: true }).orFail(new Error('NOT FOUND'))
    // 如果成功更新產品，回應狀態碼 200 (OK)，並返回成功訊息
    res.status(StatusCodes.OK).json({
      success: true,
      message: ''
    })
  } catch (error) {
    // 如果捕捉到錯誤，首先檢查錯誤的類型
    if (error.name === 'CastError' || error.message === 'ID') {
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: '服務項目 ID 格式錯誤'
      })
    } else if (error.message === 'NOT FOUND') {
      res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: '查無服務項目'
      })
    } else if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      const message = error.errors[key].message
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message
      })
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: '未知錯誤'
      })
    }
  }
}

// 匯出一個名為 'getId' 的非同步函數，用於根據 ID 取得單個服務資料
export const getId = async (req, res) => {
  try {
    // 驗證傳入的產品 ID 是否為有效的 MongoDB ID，如果無效則拋出錯誤
    if (!validator.isMongoId(req.params.id)) throw new Error('ID')
    // 使用 Service 模型根據 ID 查找單個服務資料
    // `findById` 方法會根據傳入的 ID 查找相應的資料
    // 如果找不到資料，`orFail` 方法會拋出一個 'NOT FOUND' 的錯誤
    const result = await Service.findById(req.params.id).orFail(new Error('NOT FOUND'))

    // 如果成功找到資料，回應狀態碼 200 (OK)，並返回成功訊息與查詢結果
    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result
    })
  } catch (error) {
    // 如果捕捉到錯誤，首先檢查錯誤的類型
    if (error.name === 'CastError' || error.message === 'ID') {
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: '服務項目 ID 格式錯誤'
      })
    } else if (error.message === 'NOT FOUND') {
      res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: '查無服務項目'
      })
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: '未知錯誤'
      })
    }
  }
}
