const express =require('express');
const routes=require('./route');
const mongoose=require('mongoose');
const app = express();
app.use(express.json());
app.use(routes);
app.use((req, res, next)=>{
  res.status(404);
  res.json({
    error: 'Not found asset server',
  });
});

const configurations = {
  PORT: null,
  URL: null,
  setConfigurations(port, url) {
    this.PORT = port;
    this.URL = url;
    mongoose.connect(this.URL);
    app.listen(this.PORT);
  },
};

module.exports = {app, configurations};
