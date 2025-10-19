import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';  
import 'dotenv/config';

const app = express();
const PORT = process.env.PORT || 4000;


//middlewares
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

//api endpoint
app.get('/', (req, res) => {
    res.send('Hello from Express server!');
});

//start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
}); 