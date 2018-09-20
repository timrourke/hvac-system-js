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
      const ui = new UiController();
      environmentController = new EnvironmentController(hvac, ui);
      environmentController.tick();
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
      const ui = new UiController();
      environmentController = new EnvironmentController(hvac, ui);
      environmentController.tick();
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
      const ui = new UiController();
      environmentController = new EnvironmentController(hvac, ui);
      environmentController.tick();
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
      const ui = new UiController();
      environmentController = new EnvironmentController(hvac, ui);
      environmentController.tick();
      environmentController.tick();
      environmentController.tick();
      environmentController.tick();
      environmentController.tick();
      environmentController.tick();
      environmentController.tick();
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
      const ui = new UiController();
      environmentController = new EnvironmentController(hvac, ui);
      environmentController.tick();
      environmentController.tick();
      environmentController.tick();
      environmentController.tick();
      environmentController.tick();
    });
    Then(() => {
      expect(fanCalledWith).toEqual([true, false, false, false, true]);
    });
  });

  describe('should set min temp', () => {
    let ctrl;
    When(() => {
      const hvac = new HvacHttpImpl();
      const ui = new UiController();
      ctrl = new EnvironmentController(hvac, ui);
      ctrl.setMinTemp(40);
    });
    Then(() => {
      expect(ctrl.minTemp).toBe(40);
    });
  });

  describe('should set max temp', () => {
    let ctrl;
    When(() => {
      const hvac = new HvacHttpImpl();
      const ui = new UiController();
      ctrl = new EnvironmentController(hvac, ui);
      ctrl.setMaxTemp(90);
    });
    Then(() => {
      expect(ctrl.maxTemp).toBe(90);
    });
  });

  describe('should not set min temp to below 0', () => {
    let ctrl;
    When(() => {
      const hvac = new HvacHttpImpl();
      const ui = new UiController();
      ctrl = new EnvironmentController(hvac, ui);
      ctrl.setMinTemp(-34);
    });
    Then(() => {
      expect(ctrl.minTemp).toBe(0);
    });
  });

  describe('should not set max temp to above 100', () => {
    let ctrl;
    When(() => {
      const hvac = new HvacHttpImpl();
      const ui = new UiController();
      ctrl = new EnvironmentController(hvac, ui);
      ctrl.setMaxTemp(127);
    });
    Then(() => {
      expect(ctrl.maxTemp).toBe(127);
    });
  });

  describe('should prevent min temp from being set higher than max temp', () => {
    let ctrl;
    When(() => {
      const hvac = new HvacHttpImpl();
      const ui = new UiController();
      ctrl = new EnvironmentController(hvac, ui);
      ctrl.setMaxTemp(72);
      ctrl.setMinTemp(80);
    });
    Then(() => {
      expect(ctrl.minTemp).toBe(72);
    });
  });

  describe('should prevent max temp from being set lower than min temp', () => {
    let ctrl;
    When(() => {
      const hvac = new HvacHttpImpl();
      const ui = new UiController();
      ctrl = new EnvironmentController(hvac, ui);
      ctrl.setMinTemp(29);
      ctrl.setMaxTemp(8);
    });
    Then(() => {
      expect(ctrl.maxTemp).toBe(29);
    });
  });
});
