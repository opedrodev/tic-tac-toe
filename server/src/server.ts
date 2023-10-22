import dotenv from 'dotenv'
import App from './App'

dotenv.config()

const { server } = new App()

server.listen(process.env.PORT || 3001, () => {
    console.log(`Server is running on port ${process.env.PORT || 3001}`)
})
