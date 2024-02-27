const express =require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const routes=require('./route');
const app = express();
const PORT =3000;

mongoose.connect('mongodb://localhost/EVModelling')
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Failed to connect to MongoDB', err));

app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors());
app.use(routes);

app.use((req, res, next)=>{
  const error=new Error('Not found');
  error.status=404;
  next(error);
});

app.use((error, req, res, next)=>{
  res.status(error.status||500);
  res.json({
    error: error.message,
  });
});


app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
module.exports = app;
