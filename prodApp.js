const {configurations} = require('./index');
process.env.PORT = 3000;
process.env.MONGO_URL = 'mongodb://localhost/EvModel';
configurations.setConfigurations(process.env.PORT, process.env.MONGO_URL);
