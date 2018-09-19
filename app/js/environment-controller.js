function get(url, callback) {
  var oReq = new XMLHttpRequest();
  oReq.addEventListener("load", callback);
  oReq.open("GET", url);
  oReq.send();
}

function post(url, body, callback) {
  var oReq = new XMLHttpRequest();
  oReq.addEventListener("load", callback);
  oReq.open("POST", url);
  oReq.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  oReq.send(body);
}

function EnvironmentController(hvac) {
  const MIN_TEMP = 65;
  const MAX_TEMP = 75;
  this.fanPreviousStates = [false];

  this.tick = function tick() {
    get('/temp', (response) => {
      const temp = parseInt(response.target.response, 10);

      switch (true) {
        case (this.temperatureTooHigh(temp)):
          return this.tryTurningOnCooling(temp);
  
        case (this.temperatureTooLow(temp)):
          return this.tryTurningOnHeating(temp);
  
        default: 
          return this.doNothing(temp);
      }
    });
  }

  this.serializeOnState = function serializeOnState(shouldTurnOn) {
    if (shouldTurnOn) {
      return 'on=1';
    }

    return 'on=0';
  }

  this.tryTurningOnCooling = function tryTurningOnCooling(temp) {
    post('/cool', this.serializeOnState(true))
    post('/heat', this.serializeOnState(false));
    post('/fan', this.serializeOnState(this.shouldTurnFanOn(temp)));
  }

  this.tryTurningOnHeating = function tryTurningOnHeating(temp) {
    post('/cool', this.serializeOnState(false));
    post('/heat', this.serializeOnState(true));
    post('/fan', this.serializeOnState(this.shouldTurnFanOn(temp)));
  }

  this.doNothing = function doNothing(temp) {
    post('/cool', this.serializeOnState(false));
    post('/heat', this.serializeOnState(false));
    post('/fan', this.serializeOnState(this.shouldTurnFanOn(temp)));
  }

  this.shouldTurnFanOn = function shouldTurnFanOn(temperature) {
    let nextState = this.getFanNextState(temperature);

    this.fanPreviousStates.push(nextState);

    return nextState;
  }

  this.getFanNextState = function getFanNextState(temp) {
    let numMinutesFanLastOn = this.getNumMinutesFanLastOn();

    // The fan should not turn on if the temperature is satisfactory
    if (!this.temperatureTooLow(temp) && !this.temperatureTooHigh(temp)) {
      return false;
    }

    // The fan can turn on if it has not been on before
    if (numMinutesFanLastOn <= 0) {
      return true;
    }

    // If the temperature is too low, the fan can turn on if it hasn't been run
    // in more than 5 minutes
    if (this.temperatureTooLow(temp)) {
      return numMinutesFanLastOn > 5;
    }

    // If the temperature is too high, the fan can turn on if it hasn't been run
    // in more than 3 minutes
    return numMinutesFanLastOn > 3;
  }

  this.temperatureTooLow = function temperatureTooLow(temperature) {
    return temperature < MIN_TEMP;
  }

  this.temperatureTooHigh = function temperatureTooHigh(temperature) {
    return temperature > MAX_TEMP;
  }

  this.getNumMinutesFanLastOn = function getNumMinutesFanLastOn() {
    return this.fanPreviousStates
      .slice()
      .reverse()
      .indexOf(true) + 1;
  }
}