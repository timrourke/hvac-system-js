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

describe("should manage temperature", () => {
  let temp;
  let server;
  let coolCalledWith = [];
  let heatCalledWith = [];
  let fanCalledWith = [];

  beforeEach(() => {
    coolCalledWith = [];
    heatCalledWith = [];
    fanCalledWith = [];

    server = sinon.fakeServer.create({
      respondImmediately: true,
    });

    server.respondWith(
      'GET',
      '/temp',
      function(xhr) {
        xhr.respond(
          200,
          {},
          temp.toString()
        )
      }
    );

    server.respondWith(
      'POST',
      '/heat',
      function(xhr) {
        heatCalledWith.push(xhr.requestBody === 'on=1');
        xhr.respond(200, {}, '');
      }
    );

    server.respondWith(
      'POST',
      '/cool',
      function(xhr) {
        coolCalledWith.push(xhr.requestBody === 'on=1');
        xhr.respond(200, {}, '');
      }
    );

    server.respondWith(
      'POST',
      '/fan',
      function(xhr) {
        fanCalledWith.push(xhr.requestBody === 'on=1');
        xhr.respond(200, {}, '');
      }
    );
  });

  afterEach(() => {
    server.restore();
  });

  describe("turns on cooling and fan when temperature > 75", () => {
    When(() => {
      temp = 76;
      const hvac = new HvacHttpImpl();
      this.environmentController = new EnvironmentController(hvac);
      this.environmentController.tick();
    });
    Then(() => {
      expect(coolCalledWith[0]).toEqual(true);
      expect(heatCalledWith[0]).toEqual(false);
      expect(fanCalledWith[0]).toEqual(true);
    });
  });

  describe("turns on heat and fan when temperature < 65", () => {
    When(() => {
      temp = 64;
      const hvac = new HvacHttpImpl();
      this.environmentController = new EnvironmentController(hvac);
      this.environmentController.tick();
    });
    Then(() => {
      expect(coolCalledWith[0]).toEqual(false);
      expect(heatCalledWith[0]).toEqual(true);
      expect(fanCalledWith[0]).toEqual(true);
    });
  });

  describe("does not call cool, heat, or fan when temperature between 65 and 75", () => {
    When(() => {
      temp = 70;
      const hvac = new HvacHttpImpl();
      this.environmentController = new EnvironmentController(hvac);
      this.environmentController.tick();
    });
    Then(() => {
      expect(coolCalledWith[0]).toEqual(false);
      expect(heatCalledWith[0]).toEqual(false);
      expect(fanCalledWith[0]).toEqual(false);
    });
  });

  describe("after the heating and fan are turned on, fan can't run for 5 minutes", () => {
    When(() => {
      temp = 64;
      const hvac = new HvacHttpImpl();
      this.environmentController = new EnvironmentController(hvac);
      this.environmentController.tick();
      this.environmentController.tick();
      this.environmentController.tick();
      this.environmentController.tick();
      this.environmentController.tick();
      this.environmentController.tick();
      this.environmentController.tick();
    });
    Then(() => {
      expect(fanCalledWith).toEqual([true, false, false, false, false, false, true]);
    });
  });

  describe("after the cooling and fan are turned on, fan won't run again for 3 minutes",
  () => {
    When(() => {
      temp = 76;
      const hvac = new HvacHttpImpl();
      this.environmentController = new EnvironmentController(hvac);
      this.environmentController.tick();
      this.environmentController.tick();
      this.environmentController.tick();
      this.environmentController.tick();
      this.environmentController.tick();
    });
    Then(() => {
      expect(fanCalledWith).toEqual([true, false, false, false, true]);
    });
  });
});
