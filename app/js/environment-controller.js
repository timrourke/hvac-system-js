class EnvironmentController {
  constructor(hvac, ui, minTemp = 65, maxTemp = 75) {
    this.fanPreviousStates = [false];
    this.hvac = hvac;
    this.ui = ui;
    this.setMinTemp(minTemp);
    this.setMaxTemp(maxTemp);
  }

  tempTooLow(temp) {
    return temp < this.minTemp;
  }

  tempTooHigh(temp) {
    return temp > this.maxTemp;
  }

  tick() {
    this.getTemp((temp) => {
      this.tryRunningFan(temp);

      switch (true) {
        case (this.tempTooHigh(temp)):
          return this.cool();

        case (this.tempTooLow(temp)):
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
    if (!this.tempTooLow(temp) && !this.tempTooHigh(temp)) {
      return false;
    }

    // The fan can turn on if it has not been on before
    if (numMinutesFanLastOn <= 0) {
      return true;
    }

    // If the temp is too low, the fan can turn on if it hasn't been run
    // in more than 5 minutes
    if (this.tempTooLow(temp)) {
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

  static parseTempInput(temp) {
    let newValue = parseInt(`${temp}`.trim(), 10);

    if (isNaN(newValue) || newValue < 0) {
      newValue = 0;
    }

    return newValue;
  }

  getMinTempWithinRange(temp) {
    if (temp > this.maxTemp) {
      return this.maxTemp;
    }

    return temp;
  }

  getMaxTempWithinRange(temp) {
    if (temp < this.minTemp) {
      return this.minTemp;
    }

    return temp;
  }

  setMinTemp(temp) {
    let newValue = this.getMinTempWithinRange(
      this.constructor.parseTempInput(temp)
    );

    this.minTemp = newValue;

    this.ui.setMinTemp(newValue);
  }

  setMaxTemp(temp) {
    let newValue = this.getMaxTempWithinRange(
      this.constructor.parseTempInput(temp)
    );

    this.maxTemp = newValue;

    this.ui.setMaxTemp(newValue);
  }
}
