const httpMocks = require('node-mocks-http');
const { router, supportedHttpMethods } = require('../index');

describe('router', () => {
  let request;
  let response;

  describe.each(supportedHttpMethods)('when a %s request is made to matching route', method => {
    beforeEach(() => {
      request = httpMocks.createRequest({
        method: method,
        url: '/api/search?q=technology'
      });

      response = httpMocks.createResponse();
    });

    it('maps it to the handler', () => {
      const mock = jest.fn();
      router[method.toLowerCase()](/\/api\/search.*/, mock);

      router(request, response);

      expect(mock).toHaveBeenCalledTimes(1);
      expect(mock).toHaveBeenCalledWith(request, response);
    });
  });

  describe('when a request is made to a route with no path declared', () => {
    beforeEach(() => {
      request = httpMocks.createRequest({
        method: 'POST',
        url: '/unknown'
      });

      response = httpMocks.createResponse();
    });

    it('maps it to the handler', () => {
      const mockHandler = jest.fn();
      const mockNoHandler = jest.fn();
      router.post(/\/api\/search.*/, mockHandler);
      router.post(mockNoHandler);

      router(request, response);

      expect(mockNoHandler).toHaveBeenCalledTimes(1);
      expect(mockHandler).not.toHaveBeenCalled();
      expect(mockNoHandler).toHaveBeenCalledWith(request, response);
    });
  });
});