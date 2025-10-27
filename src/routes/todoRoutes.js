import express from 'express'
import prisma from '../prismaClient.js'

const router = express.Router()

// Common in-memory sqlite db usage

// router.get('/', (req, res) => {
//     const getTodos = db.prepare(`
//         SELECT * FROM todos WHERE userid = ?    
//     `)
//     const todos = getTodos.all(req.userId)
//     res.json(todos)
// })

// router.post('/', (req, res) => {
//     const { task } = req.body

//     const insertTodo = db.prepare(`
//         INSERT INTO todos (userid, task)
//         VALUES (?, ?)    
//     `)

//     const result = insertTodo.run(req.userId, task)

//     res.json({
//         id: result.lastInsertRowid,
//         task,
//         completed: 0
//     })
// })

// router.put('/:id', (req, res) => {
//     const { id } = req.params
//     const { completed } = req.body

//     const updatedTodo = db.prepare(`
//         UPDATE todos
//         SET completed = ?
//         WHERE id = ?    
//     `)

//     updatedTodo.run(completed, id)

//     res.json({ message: 'Task completed!' })
// })

// router.delete('/:id', (req, res) => {
//     const { id } = req.params

//     const deleteTodo = db.prepare(`
//         DELETE FROM todos
//         WHERE id = ?
//         AND userid = ?    
//     `)

//     deleteTodo.run(id, req.userId)

//     res.json({ message: 'Task deleted!' })
// })

router.get('/', async (req, res) => {
    const todos = await prisma.todo.findMany({
        where: {
            userId: req.userId
        }
    })

    res.json(todos)
})

router.post('/', async (req, res) => {
    const { task } = req.body

    const todo = await prisma.todo.create({
        data: {
            task,
            userId: req.userId
        }
    })

    res.json({ todo })
})

router.put('/:id', async (req, res) => {
    const { id } = req.params
    const { completed } = req.body

    const updatedTodo = await prisma.todo.update({
        where: {
            id: parseInt(id),
            userId: req.userId
        },
        data: {
            completed: !!completed
        }
    })

    res.json(updatedTodo)
})

router.delete('/:id', async (req, res) => {
    const { id } = req.params

    await prisma.todo.delete({
        where: {
            id: parseInt(id),
            userId: req.userId
        }
    })

    res.send({ message: 'Task deleted!' })
})

export default router
