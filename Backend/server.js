import {} from 'dotenv/config';
import express from 'express';
import connectDB from './config/db.js';
import {loginrouter} from './routes/loginrouter.js';
import cors from 'cors';
import savingPlanRouter from './routes/savingPlanRoutes.js';
import userRouter from './routes/userRouter.js';
import historyrouter from './routes/history.js';
import cookieParser from 'cookie-parser';
import categoriesrouter from './routes/categoryrouter.js';
// import './controllers/cornsjob.js';

const app = express();
app.use(express.json());

const corsOptions = {
    origin: 'http://localhost:5173',  // Frontend URL
    credentials: true,  // Allow cookies to be sent in cross-origin requests
};

app.use(cors(corsOptions)); 

app.use(cookieParser());

app.use('/api', loginrouter);
app.use('/api',historyrouter);
app.use('/api',userRouter);
app.use('/api', savingPlanRouter);
app.use('/api',categoriesrouter);
app.use('/',(req,res)=>{
    res.send("this is home Route");
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => { 
    try{
        await connectDB();
        console.log(`server running on, ${PORT}`);
    }catch(err){
        console.log("Error in lisening",err);
    }
}
);