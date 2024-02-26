const mongoose = require('mongoose');
const {insertAll}=require('./insertFunctions');


mongoose.connect('mongodb://localhost/EvModelling')
    .then(async function() {
      console.log('Connected to MongoDB');

      try {
        const inputConnectorData=[
          [{
            type: 'A',
            wattage: 100,
            manufacturer: 'Manufacturer1',
          },
          {
            type: 'B',
            wattage: 100,
            manufacturer: 'Manufacturer1',
          },
          {
            type: 'C',
            wattage: 100,
            manufacturer: 'Manufacturer1',
          },
          ],
          [
            {
              type: 'AA',
              wattage: 10,
              manufacturer: 'Manufacturer2',
            },
            {
              type: 'BB',
              wattage: 10,
              manufacturer: 'Manufacturer2',
            },
          ],
        ];
        await insertAll('MUMBAI', 'GAIL', inputConnectorData);
      } catch (error) {
        console.error('Error:', error);
      }
    })
    .catch((error) => {
      console.error('Error connecting to MongoDB:', error);
    });
