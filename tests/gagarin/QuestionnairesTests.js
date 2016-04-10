describe('clinical:hl7-resources-questionnaire', function () {
  var server = meteor();
  var client = browser(server);

  it('Questionnaires should exist on the client', function () {
    return client.execute(function () {
      expect(Questionnaires).to.exist;
    });
  });

  it('Questionnaires should exist on the server', function () {
    return server.execute(function () {
      expect(Questionnaires).to.exist;
    });
  });

});
