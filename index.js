
import express from 'express';
import cors from 'cors';
import connectDB from '../TinyURLProject/dataBase.js'
import linkRoutes from './Routes/links.js'
import userRoutes from './Routes/users.js'

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

connectDB();

const port = 3000;

// Routes
app.use('/links', linkRoutes);
app.use('/users', userRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});