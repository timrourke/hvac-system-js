describe("should manage temperature", () => {
  beforeEach(() => {
    this.xhr = sinon.useFakeXMLHttpRequest();
    this.requests = [];

    this.xhr.onCreate = (xhr) => {
      this.requests.push(xhr);
    };
  });

  afterEach(() => {
    this.xhr.restore();
  });

  describe('can assert on fake ajax request', () => {
    When(() => {
      get('/temp', () => {});
    });
    Then(() => {
      expect(this.requests.length).toEqual(1);
      this.requests[0].respond(200, {}, '75');
      expect(this.requests[0].response).toEqual('75');
    });
  });

  describe("turns on cooling and fan when temperature > 75", function() {
    When(function() {
      this.stubHvac = createStubHvac(76);
      this.environmentController = new EnvironmentController(this.stubHvac);
      this.environmentController.tick();
    });
    Then(function() {
      expect(this.stubHvac.coolCalledWith[0]).toEqual(true);
      expect(this.stubHvac.heatCalledWith[0]).toEqual(false);
      expect(this.stubHvac.fanCalledWith[0]).toEqual(true);
    });
  });
  
  describe("turns on heat and fan when temparature < 65", function() {
    When(function() {
      this.stubHvac = createStubHvac(64);
      this.environmentController = new EnvironmentController(this.stubHvac);
      this.environmentController.tick();
    });
    Then(function() {
      expect(this.stubHvac.coolCalledWith[0]).toEqual(false);
      expect(this.stubHvac.heatCalledWith[0]).toEqual(true);
      expect(this.stubHvac.fanCalledWith[0]).toEqual(true);
    });
  });
  
  describe("does not call cool, heat, or fan when temperature between 65 and 75", function() {
    When(function() {
      this.stubHvac = createStubHvac(70);
      this.environmentController = new EnvironmentController(this.stubHvac);
      this.environmentController.tick();
    });
    Then(function() {
      expect(this.stubHvac.coolCalledWith[0]).toEqual(false);
      expect(this.stubHvac.heatCalledWith[0]).toEqual(false);
      expect(this.stubHvac.fanCalledWith[0]).toEqual(false);
    });
  });
  
  describe("heater is currently on, when heater is turned off, fan can't run for 5 minutes", function(){
    When(function() {
      this.stubHvac = createStubHvac(64);
      this.environmentController = new EnvironmentController(this.stubHvac);
      this.environmentController.tick();
      this.environmentController.tick();
      this.environmentController.tick();
      this.environmentController.tick();
      this.environmentController.tick();
      this.environmentController.tick();
      this.environmentController.tick();
    });
    Then(function() {
      expect(this.stubHvac.fanCalledWith).toEqual([true, false, false, false, false, false, true]);
    });
  });
  
  describe("after the cooling and fan are turned on, the fan won't run again for 3 minutes", function
  () {
    When(function() {
      this.stubHvac = createStubHvac(76);
      this.environmentController = new EnvironmentController(this.stubHvac);
      this.environmentController.tick();
      this.environmentController.tick();
      this.environmentController.tick();
      this.environmentController.tick();
      this.environmentController.tick();
    });
    Then(function() {
      expect(this.stubHvac.fanCalledWith).toEqual([true, false, false, false, true]);
    });
  });
});
