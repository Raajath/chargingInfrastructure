const express =require('express');
const routes=require('./route');
const app = express();
const PORT =process.env.PORT;
app.use(express.json());
app.use(routes);

app.use((req, res, next)=>{
  res.status(404);
  res.json({
    error: 'Not found asset server',
  });
});


app.listen(PORT);
module.exports = app;
