import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes';
import { connectDB } from './config/database';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
connectDB();
app.use('/api', routes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`API running on port ${PORT}`));

