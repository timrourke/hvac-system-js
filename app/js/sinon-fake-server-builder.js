function sinonFakeServerBuilder(
  getTemp,
  heatCallback,
  coolCallback,
  fanCallback
) {
  const server = sinon.fakeServer.create({
    respondImmediately: true,
  });

  server.respondWith(
    'GET',
    '/temp',
    function(xhr) {
      xhr.respond(
        200,
        {},
        getTemp()
      );
    }
  );

  server.respondWith(
    'POST',
    '/heat',
    function(xhr) {
      heatCallback(xhr);
      xhr.respond(200, {}, '');
    }
  );

  server.respondWith(
    'POST',
    '/cool',
    function(xhr) {
      coolCallback(xhr);
      xhr.respond(200, {}, '');
    }
  );

  server.respondWith(
    'POST',
    '/fan',
    function(xhr) {
      fanCallback(xhr);
      xhr.respond(200, {}, '');
    }
  );

  return server;
}
