class UiController {
  constructor(tempEl = {}, fanEl = {}, heatEl = {}, coolEl = {}) {
    this.tempEl = tempEl;
    this.fanEl = fanEl;
    this.heatEl = heatEl;
    this.coolEl = coolEl;
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
}