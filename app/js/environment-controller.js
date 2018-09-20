const MIN_TEMP = 65;
const MAX_TEMP = 75;

class EnvironmentController {
  constructor(hvac, ui) {
    this.fanPreviousStates = [false];
    this.hvac = hvac;
    this.ui = ui;
  }

  static tempTooLow(temp) {
    return temp < MIN_TEMP;
  }

  static tempTooHigh(temp) {
    return temp > MAX_TEMP;
  }

  tick() {
    this.getTemp((temp) => {
      this.tryRunningFan(temp);

      switch (true) {
        case (this.constructor.tempTooHigh(temp)):
          return this.cool();

        case (this.constructor.tempTooLow(temp)):
          return this.heat();

        default:
          return this.doNothing();
      }
    });
  }

  getTemp(callback) {
    this.hvac.temp((temp) => {
      this.ui.setTemp(temp);
      callback(temp);
    });
  }

  tryRunningFan(temp) {
    const isFanOn = this.shouldTurnFanOn(temp);

    this.hvac.fan(isFanOn);
    this.ui.setFanState(isFanOn);
  }

  cool() {
    this.hvac.cool(true);
    this.ui.setCoolState(true);

    this.hvac.heat(false);
    this.ui.setHeatState(false);
  }

  heat() {
    this.hvac.cool(false);
    this.ui.setCoolState(false);

    this.hvac.heat(true);
    this.ui.setHeatState(true);
  }

  doNothing() {
    this.hvac.cool(false);
    this.ui.setCoolState(false);

    this.hvac.heat(false);
    this.ui.setHeatState(false);
  }

  shouldTurnFanOn(temp) {
    const nextState = this.getFanNextState(temp);

    this.fanPreviousStates.push(nextState);

    return nextState;
  }

  getFanNextState(temp) {
    const numMinutesFanLastOn = this.getNumMinutesFanLastOn();

    // The fan should not turn on if the temp is satisfactory
    if (!this.constructor.tempTooLow(temp) && !this.constructor.tempTooHigh(temp)) {
      return false;
    }

    // The fan can turn on if it has not been on before
    if (numMinutesFanLastOn <= 0) {
      return true;
    }

    // If the temp is too low, the fan can turn on if it hasn't been run
    // in more than 5 minutes
    if (this.constructor.tempTooLow(temp)) {
      return numMinutesFanLastOn > 5;
    }

    // If the temp is too high, the fan can turn on if it hasn't been run
    // in more than 3 minutes
    return numMinutesFanLastOn > 3;
  }

  getNumMinutesFanLastOn() {
    return this.fanPreviousStates
      .slice()
      .reverse()
      .indexOf(true) + 1;
  }
}
