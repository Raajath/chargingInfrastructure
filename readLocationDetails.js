const { Location } = require('./infrastructureSchema');

async function findLocationByName(locationName) {
  try {
    const location = await Location.findOne({ locationName: locationName })
      .populate({  
        path: 'chargePoints',
        populate: {
          path: 'connectors',
          model: 'Connector'
        }
      })
      .exec();

    return location;
  } catch (error) {
    console.error('Error finding location by name:', error);
    throw error;
  }
}
module.exports={findLocationByName};