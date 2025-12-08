import express from 'express';
import cors from 'cors';
import secretRoutes from './routes/secretRoutes.js'; // Note the .js extension

const app = express();

// Middleware
app.use(cors());             // Allows frontend to connect
app.use(express.json());     // Parses incoming JSON bodies

// Routes
app.use('/api/secret', secretRoutes);

// Health Check (Good for testing if server is alive)
app.get('/', (req, res) => {
  res.status(200).json({ 
    message: "FlashPaper API is running 🚀" 
  });
});

export default app;