import express from 'express'
import morgan from 'morgan'
import path from 'path'
import url from 'url'

const __filename = url.fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const PORT = process.env.PORT || 5000

const app = express()

app.use(express.static(path.join(__dirname, '../public')))

app.get('/', morgan('tiny'), (req, res) => {
    return res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

app.listen(PORT, () => {
    console.log(`Server is listening on PORT ${PORT}`)
    console.log(`Curl http://localhost:${PORT}`)
})
