function SessionData() {
  this.data = function Film() {
    this.market = function Market() {
      this.id;
      this.cinemas = function Cinemas() { //todo: be list of cinemas
        this.id;
        this.timeZoneName;
      }
    };
    this.userSessionId;
    this.sessions = function Sessions() { //todo: be list of sessions
      this.cinemaId;
      this.sessionId;
      this.status;
      this.cinemaTimeZoneName;
      this.showTimeUtc;
      this.screenNumber;
    };
  };
};