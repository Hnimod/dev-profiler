import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();
const app = express();
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
if (process.env.DB_STRING && process.env.DB_PASSWORD) {
  const dbString = process.env.DB_STRING.replace(
    '<PASSWORD>',
    process.env.DB_PASSWORD
  );
  mongoose
    .connect(dbString, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    })
    .then(() => console.log('-----Database connected!!!'))
    .catch((err) => console.log('-----Database connect failed!!!', err));
} else {
  throw new Error('Database environment variables not found');
}

/////////////////////////////////////////////////////////////////////
app.use(express.json());
/////////////////////////////////////////////////////////////////////

process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  console.log('-----Uncaught Exception. App closing...');
  process.exit(1);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`-----App running on port ${port}...`));

process.on('unhandledRejection', (reason, promise) => {
  console.log('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});
