const Promise = require('axios');

class SeatingProxy {

  getSeatingData(cinemaId, sessionId) {
    return new Promise.get(`https://drafthouse.com/s/mother/v1/app/seats/${cinemaId}/${sessionId}`)
      .then((response) => {
        return response.data.data.seatingData.areas;
      }).catch(error => {
        console.log(error);
        return error;
    })
  }

  getSessionData(cinemaId, sessionId) {
    return new Promise.get(`https://drafthouse.com/s/mother/v1/app/showtime/${cinemaId}/${sessionId}?userSessionId=5ec2cb6b2f4548d8917bc248e98243f8`)
      .then((response) => {
        console.log(response.body);
        return response.data;
      }).catch(error => {
        console.log(error);
    });
  }
}

module.exports = SeatingProxy;