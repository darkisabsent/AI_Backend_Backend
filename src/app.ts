import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.route';
import profileRoutes from './routes/profile.route';
import { ENV } from './config/env';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);

app.listen(ENV.PORT, () => {
  console.log(`Server running on http://localhost:${ENV.PORT}`);
});
