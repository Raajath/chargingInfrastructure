const {configurations} = require('./index');
const {setEstimateUrl}=require('./estimateChargeTime');
setEstimateUrl(process.env.ESTIMATE_URL);
configurations.setConfigurations(process.env.PORT, process.env.MONGO_URL);
