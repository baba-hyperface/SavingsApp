import {} from 'dotenv/config';
import express from 'express';
import connectDB from './config/db.js';
import {loginrouter} from './routes/loginrouter.js';
import cors from 'cors';
import savingPlanRouter from './routes/savingPlanRoutes.js';
import { updateDetuctionAmount } from './routes/loginrouter.js';
import userRouter from './routes/userRouter.js';
// import './controllers/cornsjob.js';

const app = express();
app.use(express.json());
app.use(cors());

app.use('/api', loginrouter);
app.post('/api/updateDetuctionAmount/:id',updateDetuctionAmount);
app.use('/api',userRouter)
app.use('/api', savingPlanRouter);

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