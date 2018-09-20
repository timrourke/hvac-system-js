class HvacHttpImpl {
  temp(callback) {
    this.constructor.get('/temp', (response) => {
      callback(parseInt(response.target.response, 10));
    });
  }

  heat(shouldHeat) {
    this.constructor.post('/heat', this.constructor.serializeOnState(shouldHeat));
  }

  cool(shouldCool) {
    this.constructor.post('/cool', this.constructor.serializeOnState(shouldCool));
  }

  fan(shouldRunFan) {
    this.constructor.post('/fan', this.constructor.serializeOnState(shouldRunFan));
  }

  static get(url, callback) {
    const oReq = new XMLHttpRequest();
    oReq.addEventListener("load", callback);
    oReq.open("GET", url);
    oReq.send();
  }

  static post(url, body, callback) {
    const oReq = new XMLHttpRequest();
    oReq.addEventListener("load", callback);
    oReq.open("POST", url);
    oReq.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    oReq.send(body);
  }

  static serializeOnState(shouldTurnOn) {
    if (shouldTurnOn) {
      return 'on=1';
    }

    return 'on=0';
  }
}

