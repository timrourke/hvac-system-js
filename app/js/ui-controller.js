class UiController {
  constructor(tempEl = {}, fanEl = {}, heatEl = {}, coolEl = {}, minTempEl = {}, maxTempEl = {}) {
    this.tempEl = tempEl;
    this.fanEl = fanEl;
    this.heatEl = heatEl;
    this.coolEl = coolEl;
    this.minTempEl = minTempEl;
    this.maxTempEl = maxTempEl;
  }

  setTemp(temp) {
    this.tempEl.innerHTML = temp;
  }

  setFanState(isFanOn) {
    this.fanEl.innerHTML = isFanOn ?
      'ON' :
      'OFF';
  }

  setHeatState(isHeatOn) {
    this.heatEl.innerHTML = isHeatOn ?
      'ON' :
      'OFF';
  }

  setCoolState(isCoolOn) {
    this.coolEl.innerHTML = isCoolOn ?
      'ON' :
      'OFF';
  }

  setMinTemp(newValue) {
    this.minTempEl.value = newValue;
  }

  setMaxTemp(newValue) {
    this.maxTempEl.value = newValue;
  }
}