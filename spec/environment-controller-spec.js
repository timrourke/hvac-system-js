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

    server = sinonFakeServerBuilder(
      () => temp.toString(),
      (xhr) => heatCalledWith.push(xhr.requestBody === 'on=1'),
      (xhr) => coolCalledWith.push(xhr.requestBody === 'on=1'),
      (xhr) => fanCalledWith.push(xhr.requestBody === 'on=1')
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
