const express =require('express');
const cors = require('cors');
const routes=require('./route');
const app = express();
const PORT =3000;
app.use(express.json());
app.use(cors());
app.use(routes);

/* mongoose.connect('mongodb://localhost/EvModel')
    .then(() => {
      console.log('Connected to MongoDB');
    })
    .catch((error) => {
      console.error('Error connecting to MongoDB:', error);
    });
*/

app.use((req, res, next)=>{
  res.status(404);
  res.json({
    error: 'Not found',
  });
});

app.listen(PORT);
module.exports = app;
