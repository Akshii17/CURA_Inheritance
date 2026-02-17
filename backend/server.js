const express = require('express');
const cors = require('cors');

const ipfsRoute = require('./route/ipfsRoute');

require('dotenv').config();

const app = express(); 

app.use(cors({
origin:[process.env.CLIENT_URL,"http://localhost:5173"],
    credentials:true,
}))


app.use(express.json({limit:"8mb"})); // for images


app.use('/api/v1/ipfs',ipfsRoute);



app.listen(process.env.PORT, () => {
  console.log("Database connected and Server running on ", process.env.PORT);
});
