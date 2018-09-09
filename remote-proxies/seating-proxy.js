const axios = require('axios');

class SeatingProxy {

  constructor() {}

  getSeatingData() {
    axios.all([
      axios.get('https://drafthouse.com/s/mother/v1/app/seats/0006/125211'),
      axios.get(' https://drafthouse.com/s/mother/v1/app/showtime/0006/125211?userSessionId=5ec2cb6b2f4548d8917bc248e98243f8')
    ]).then(axios.spread((response1, response2) => {
      console.log(response1.body);
      console.log(response2.body);
    })).catch(error => {
      console.log(error);
    });
  }
}
module.exports = SeatingProxy;