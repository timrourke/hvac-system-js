describe("should manage temperature", () => {
  let temp;
  let server;
  let coolCalledWith = [];
  let heatCalledWith = [];
  let fanCalledWith = [];

  function getTemp() {
    return temp.toString();
  }

  beforeEach(() => {
    coolCalledWith = [];
    heatCalledWith = [];
    fanCalledWith = [];
    
    server = sinon.fakeServer.create({
      autoRespond: true,
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
        heatCalledWith.push(xhr.requestBody === 'on=1' ? true : false);
        xhr.respond(200, {}, '');
      }
    );

    server.respondWith(
      'POST',
      '/cool',
      function(xhr) {
        coolCalledWith.push(xhr.requestBody === 'on=1' ? true : false);
        xhr.respond(200, {}, '');
      }
    );

    server.respondWith(
      'POST',
      '/fan',
      function(xhr) {
        fanCalledWith.push(xhr.requestBody === 'on=1' ? true : false);
        xhr.respond(200, {}, '');
      }
    );
  });

  afterEach(() => {
    server.restore();
  });

  describe("turns on cooling and fan when temperature > 75", function() {
    When(function() {
      temp = 76;
      this.environmentController = new EnvironmentController();
      this.environmentController.tick();
    });
    Then(function() {
      expect(coolCalledWith[0]).toEqual(true);
      expect(heatCalledWith[0]).toEqual(false);
      expect(fanCalledWith[0]).toEqual(true);
    });
  });
  
  describe("turns on heat and fan when temparature < 65", function() {
    When(function() {
      temp = 64;
      this.environmentController = new EnvironmentController();
      this.environmentController.tick();
    });
    Then(function() {
      expect(coolCalledWith[0]).toEqual(false);
      expect(heatCalledWith[0]).toEqual(true);
      expect(fanCalledWith[0]).toEqual(true);
    });
  });
  
  describe("does not call cool, heat, or fan when temperature between 65 and 75", function() {
    When(function() {
      temp = 70;
      this.environmentController = new EnvironmentController();
      this.environmentController.tick();
    });
    Then(function() {
      expect(coolCalledWith[0]).toEqual(false);
      expect(heatCalledWith[0]).toEqual(false);
      expect(fanCalledWith[0]).toEqual(false);
    });
  });
  
  describe("heater is currently on, when heater is turned off, fan can't run for 5 minutes", function(){
    When(function() {
      temp = 64;
      this.environmentController = new EnvironmentController();
      this.environmentController.tick();
      this.environmentController.tick();
      this.environmentController.tick();
      this.environmentController.tick();
      this.environmentController.tick();
      this.environmentController.tick();
      this.environmentController.tick();
    });
    Then(function() {
      expect(fanCalledWith).toEqual([true, false, false, false, false, false, true]);
    });
  });
  
  describe("after the cooling and fan are turned on, the fan won't run again for 3 minutes", function
  () {
    When(function() {
      temp = 76;
      this.environmentController = new EnvironmentController();
      this.environmentController.tick();
      this.environmentController.tick();
      this.environmentController.tick();
      this.environmentController.tick();
      this.environmentController.tick();
    });
    Then(function() {
      expect(fanCalledWith).toEqual([true, false, false, false, true]);
    });
  });
});
