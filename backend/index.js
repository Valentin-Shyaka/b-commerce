const express = require("express")
const cors = require("cors")
const { Client } = require("pg");
const dotenv = require("dotenv")

const app = express()
const Routes = require("./routes/route.js");
const { default: mongoose } = require("mongoose");

const PORT = process.env.PORT || 5000

dotenv.config();

app.use(express.json({ limit: '10mb' }))
app.use(cors())

// PostgreSQL connection
mongoose
    .connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(console.log("Connected to MongoDB"))
    .catch((err) => console.log("NOT CONNECTED TO NETWORK", err))
app.use('/', Routes);

app.listen(PORT, () => {
    console.log(`Server started at port no. ${PORT}`)
})