import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import db from '../db.js'

const router = express.Router()

router.post('/register', (req, res) => {
    const { username, password } = req.body

    const hash = bcrypt.hashSync(password, 10)

    try {
        const insertUser = db.prepare(`
            INSERT INTO users (username, password)
            VALUES (?, ?)
        `)
        const result = insertUser.run(username, hash)

        const defaultTask = "Welcome! Add your first task"
        const insertTodo = db.prepare(`
            INSERT INTO todos (userid, task)
            VALUES (?, ?)
        `)
        insertTodo.run(result.lastInsertRowid, defaultTask)

        const token = jwt.sign({
            id: result.lastInsertRowid,
            expiresIn: '24h'
        }, process.env.JWT_SECRET)

        res.json({ token })
    } catch (err) {
        console.log(err.message)
        res.sendStatus(503)
    }
})

router.post('/login', (req, res) => {

})

export default router
