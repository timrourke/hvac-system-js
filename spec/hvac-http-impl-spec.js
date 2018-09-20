describe('HvacHttpImpl', () => {
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
        heatCalledWith.push(xhr.requestBody);
        xhr.respond(200, {}, '');
      }
    );

    server.respondWith(
      'POST',
      '/cool',
      function(xhr) {
        coolCalledWith.push(xhr.requestBody);
        xhr.respond(200, {}, '');
      }
    );

    server.respondWith(
      'POST',
      '/fan',
      function(xhr) {
        fanCalledWith.push(xhr.requestBody);
        xhr.respond(200, {}, '');
      }
    );
  });

  afterEach(() => {
    server.restore();
  });

  it('should send GET request', () => {
    HvacHttpImpl.get('/some-url', (xhrEvent) => {
      expect(xhrEvent.type).toBe('load');
      expect(xhrEvent.target.method).toBe('GET');
      expect(xhrEvent.target.url).toBe('/some-url');
      expect(xhrEvent.target.status).toBe(404);
    });
  });

  it('should send POST request', () => {
    HvacHttpImpl.post('/some-other-url', 'some body', (xhrEvent) => {
      expect(xhrEvent.type).toBe('load');
      expect(xhrEvent.target.method).toBe('POST');
      expect(xhrEvent.target.requestBody).toBe('some body');
      expect(xhrEvent.target.requestHeaders['Content-Type'])
        .toBe('application/x-www-form-urlencoded;charset=utf-8');
      expect(xhrEvent.target.url).toBe('/some-other-url');
      expect(xhrEvent.target.status).toBe(404);
    });
  });

  it('should serialize "turn on" command as form params', () => {
    const actual = HvacHttpImpl.serializeOnState(true);

    expect(actual).toBe('on=1');
  });

  it('should serialize "turn off" command as form params', () => {
    const actual = HvacHttpImpl.serializeOnState(false);

    expect(actual).toBe('on=0');
  });

  it('should call callback with temp', () => {
    const impl = new HvacHttpImpl();

    temp = 83;

    impl.temp((tempReturned) => {
      expect(tempReturned).toBe(83);
    });
  });

  it('should make a POST request to /heat to turn on heating', () => {
    const impl = new HvacHttpImpl();

    impl.heat(true);

    expect(heatCalledWith).toEqual(['on=1']);
  });

  it('should make a POST request to /heat to turn off heating', () => {
    const impl = new HvacHttpImpl();

    impl.heat(false);

    expect(heatCalledWith).toEqual(['on=0']);
  });

  it('should make a POST request to /cool to turn on cooling', () => {
    const impl = new HvacHttpImpl();

    impl.cool(true);

    expect(coolCalledWith).toEqual(['on=1']);
  });

  it('should make a POST request to /cool to turn off cooling', () => {
    const impl = new HvacHttpImpl();

    impl.cool(false);

    expect(coolCalledWith).toEqual(['on=0']);
  });

  it('should make a POST request to /fan to turn on fan', () => {
    const impl = new HvacHttpImpl();

    impl.fan(true);

    expect(fanCalledWith).toEqual(['on=1']);
  });

  it('should make a POST request to /fan to turn off fan', () => {
    const impl = new HvacHttpImpl();

    impl.fan(false);

    expect(fanCalledWith).toEqual(['on=0']);
  });
});