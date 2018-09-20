describe('UiController', () => {
  const element = {
    innerHTML: null,
    value: null,
  };

  beforeEach(() => {
    element.innerHTML = null;
    element.value = null;
  });

  it('should set temp', () => {
    const expectedTemp = '89';

    const controller = new UiController(element, null, null, null);

    controller.setTemp(expectedTemp);

    expect(element.innerHTML).toBe(expectedTemp);
  });

  it('should set fan to "ON"', () => {
    const controller = new UiController(null, element, null, null);

    controller.setFanState(true);

    expect(element.innerHTML).toBe('ON');
  });

  it('should set fan to "OFF"', () => {
    const controller = new UiController(null, element, null, null);

    controller.setFanState(true);

    expect(element.innerHTML).toBe('ON');
  });

  it('should set cool to "ON"', () => {
    const controller = new UiController(null, null, null, element);

    controller.setCoolState(true);

    expect(element.innerHTML).toBe('ON');
  });

  it('should set cool to "OFF"', () => {
    const controller = new UiController(null, null, null, element);

    controller.setCoolState(true);

    expect(element.innerHTML).toBe('ON');
  });

  it('should set heat to "ON"', () => {
    const controller = new UiController(null, null, element, null);

    controller.setHeatState(true);

    expect(element.innerHTML).toBe('ON');
  });

  it('should set heat to "OFF"', () => {
    const controller = new UiController(null, null, element, null);

    controller.setHeatState(true);

    expect(element.innerHTML).toBe('ON');
  });

  it('should set min temp input value', () => {
    const controller = new UiController(null, null, null, null, element, null);

    controller.setMinTemp(34);

    expect(element.value).toBe(34);
  });

  it('should set max temp input value', () => {
    const controller = new UiController(null, null, null, null, null, element);

    controller.setMaxTemp(99);

    expect(element.value).toBe(99);
  });
});