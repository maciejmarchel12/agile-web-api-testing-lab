import dotenv from 'dotenv';
import express from 'express';
import moviesRouter from './api/movies';
// import bodyParser from 'body-parser'
import loglevel from 'loglevel';

if (process.env.NODE_ENV === 'test') {
    loglevel.setLevel('warn')
    } else {
    loglevel.setLevel('info')
    }


dotenv.config();

const app = express();

const port = process.env.PORT;
app.use(express.json());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded());
app.use('/api/movies', moviesRouter);

app.listen(port, () => {
  loglevel.info(`Server running at ${port}`);
});

export default app;