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
    const { username, password } = req.body

    try {
        const getUser = db.prepare(`
            SELECT * FROM users WHERE username = ?    
        `)
        const user = getUser.get(username)

        if (!user) {
            return res
                .status(404)
                .json({ message: 'User not found!' })
        }

        const isValid = bcrypt.compare(password, user.password)

        if (!isValid) {
            return res
                .status(401)
                .json({ message: 'Invalid password!' })
        }

        const token = jwt.sign({
            id: user.id,
            expiresIn: '24h'
        }, process.env.JWT_SECRET)

        res.json({ token })
    } catch (err) {
        console.log(err.message)
        res.sendStatus(503)
    }
})

export default router
