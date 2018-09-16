function Hvac(initialTemperature) {
  this.temperature = initialTemperature;
  this.coolCalledWith = [];
  this.heatCalledWith = [];
  this.fanCalledWith = [];

  this.cool = function cool(shouldCool) {
    this.coolCalledWith.push(shouldCool);
  }

  this.heat = function heat(shouldHeat){
    this.heatCalledWith.push(shouldHeat);
  }

  this.fan = function fan(shouldFanBeSet){
    this.fanCalledWith.push(shouldFanBeSet);
  }

  this.temp = function temp() {
    return this.temperature;
  }
}

function EnvironmentController(hvac) {
  const MIN_TEMP = 65;
  const MAX_TEMP = 75;
  this.hvac = hvac;
  this.fanPreviousStates = [false];

  this.tick = function tick() {
    if (this.temperatureTooHigh(this.hvac.temp())) {
      this.hvac.cool(true);
      this.hvac.heat(false);
      this.hvac.fan(this.shouldTurnFanOn(this.hvac.temp()));
    }
    else if (this.temperatureTooLow(this.hvac.temp())){
      this.hvac.cool(false);
      this.hvac.heat(true);
      this.hvac.fan(this.shouldTurnFanOn(this.hvac.temp()));
    }
    else {
      this.hvac.cool(false);
      this.hvac.heat(false);
      this.hvac.fan(this.shouldTurnFanOn(this.hvac.temp()));
    }
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

function createStubHvac(initialTemperature) {
  return new Hvac(initialTemperature);
}