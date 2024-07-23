import { Router } from 'express'
import * as auth from '../middlewares/auth.js'
import admin from '../middlewares/admin.js'
import { create, getAll, get } from '../controllers/order.js'

const router = Router()

router.post('/', auth.jwt, create)
router.get('/', auth.jwt, get)
router.get('/all', auth.jwt, admin, getAll)

export default router
