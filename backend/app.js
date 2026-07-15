const express = require('express');
const app = express();
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('./config/env');

const authRouter = require('./routes/auth.route');
const globalErrorHanlder = require('./middlewares/globalErrorHandler');

// TODO: restreindre à une whitelist d'origines en production
app.use(cors()); 
app.use(express.json({ limit: '10kb' }));
app.use(helmet());
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
}));

// Rate-limit dédié, plus strict, pour freiner le brute-force sur login/register
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { msg: 'Too many attempts, please try again later.' },
});

app.use('/api/auth', authLimiter, authRouter);
app.use(globalErrorHanlder);

module.exports = app;