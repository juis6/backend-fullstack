import 'dotenv/config'
import express from 'express'
import morgan from 'morgan'
import path from 'path'
import url from 'url'

import authRoutes from './routes/authRoutes.js'

const __filename = url.fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const PORT = process.env.PORT || 5000

const app = express()

app.use(morgan('tiny'))
app.use(express.static(path.join(__dirname, '../public')))
app.use(express.json())

app.use('/auth', authRoutes)

app.get('/', (req, res) => {
    return res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

app.listen(PORT, () => {
    console.log(`Server is listening on PORT ${PORT}`)
    console.log(`Curl http://localhost:${PORT}`)
})
