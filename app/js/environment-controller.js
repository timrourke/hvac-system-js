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
  this.hvac = hvac;
  this.fanPreviousStates = [false];

  this.tick = function tick() {
    if (this.hvac.temp() > 75) {
      this.hvac.cool(true);
      this.hvac.heat(false);
      this.hvac.fan(this.shouldTurnFanOn(this.hvac.temp()));
    }
    else if (this.hvac.temp() < 65){
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
    let nextState = false;
    let shouldFanNormallyTurnOn = temperature < 65 || temperature > 75;
    let numMinutesFanLastOn = this.fanPreviousStates
      .reverse()
      .indexOf(true) + 1;

    let fanWasOnWithinLast5Minutes = numMinutesFanLastOn > 0 &&
      numMinutesFanLastOn < 5;

    if (!fanWasOnWithinLast5Minutes && shouldFanNormallyTurnOn) {
      nextState = true;
    }

    this.fanPreviousStates.push(nextState);

    return nextState;
  }
}

function createStubHvac(initialTemperature) {
  return new Hvac(initialTemperature);
}