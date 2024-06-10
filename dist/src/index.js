import express from 'express';
import router from './routes.js';
import cors from 'cors';
const app = express();
const PORT = process.env.PORT || 8080;
const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
    optionSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use('/', router);
app.listen(PORT, () => {
    console.log('server has been started on port', PORT);
});
