const connectToMongo = require('./db');
const express = require('express')

const startServer = async () => {
    try {
        await connectToMongo();
        // Other code to start your server
    } catch (error) {
        console.error('Error during server startup:', error.message);
    }
}

startServer();

const app = express()
const port = 5000

app.use(express.json());

app.use('/api/auth' , require('./routes/auth'));
app.use('/api/notes' , require('./routes/notes'));

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`);
})