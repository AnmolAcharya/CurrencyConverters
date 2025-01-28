import axios from 'axios'
import express from "express"
import {config} from "dotenv"
import cors from "cors"
import connectDB from "./database/dbConnection.js"
import messageRouter from "./router/messageRouter.js"
import { currencies } from "../Frontend/CurrencyConverters/src/currencies.js"

const app = express()
config({path: "./config/config.env"})

app.use(cors({
    origin: [process.env.FRONTEND_URL],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
}))

app.use(express.json());
app.use(express.urlencoded({extended: true}))

app.use("/api/v1/message", messageRouter)

// Connect to MongoDB
connectDB();

app.get("/convert", async(req,res)=>{
    const {base_currency, currencies, amount} = req.query;
    console.log(base_currency, currencies);

    try{
        const response = await axios.get(
            `${process.env.BASE_URL}/latest`, {
                params: {
                    apikey: process.env.API_KEY,
                    base_currency,
                    currencies
                }
            }
        );
        res.json(response.data);
    } catch(error){
        console.error("Error fetching data:", error.messgae, error.resposne?.data);
        res.status(500).json({
            error: "Failed to convert currency"
        })
    }
})

// Add this after your middleware setup
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`MongoDB URI: ${process.env.MONGODB_URI}`);
  console.log(`Frontend URL: ${process.env.FRONTEND_URL}`);
}).on('error', (err) => {
  console.error('Server failed to start:', err);
});

