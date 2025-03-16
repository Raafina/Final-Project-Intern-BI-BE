const express = require('express');
const router = require('./routes');
const cors = require('cors');
const app = express();
const port = 3010;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.use('/api', router);

// Error middleware
app.use((err, req, res, next) => {
  let statusCode = 500;
  let message = 'Internal Server Error';

  if (err.statusCode) {
    statusCode = err.statusCode;
  }
  if (err.message) {
    message = err.message;
  }

  res.status(statusCode).json({
    success: false,
    data: null,
    message,
  });
});

app.listen(port, () =>
  console.log(`Server running on port http://localhost:${port}`)
);
