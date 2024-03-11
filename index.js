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

let server;

const configurations = {
  PORT: null,
  URL: null,
  async setConfigurations(port, url) {
    this.PORT = port;
    this.URL = url;
    await mongoose.connect(this.URL);
    server=app.listen(this.PORT);
  },
};
const stopServer = () => {
  server.close();
};

module.exports = {app, configurations, stopServer};
