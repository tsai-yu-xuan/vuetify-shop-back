import { Router } from 'express'
import * as auth from '../middlewares/auth.js'
import upload from '../middlewares/upload.js'
import admin from '../middlewares/admin.js'
import { create, getAll, edit, getId } from '../controllers/service.js'

const router = Router()

router.post('/', auth.jwt, admin, upload, create)
router.get('/all', auth.jwt, admin, getAll)
router.get('/:id', getId)
router.patch('/:id', auth.jwt, admin, upload, edit)

export default router
