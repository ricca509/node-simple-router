const httpMocks = require('node-mocks-http');
const { router, supportedHttpMethods } = require('../index');

describe('router', () => {
  let request;
  let response;

  it('accepts multiple paths for the same method', () => {
    const request1 = httpMocks.createRequest({
      method: 'POST',
      url: '/api/search'
    });

    const request2 = httpMocks.createRequest({
      method: 'POST',
      url: '/api/add'
    });

    const request3 = httpMocks.createRequest({
      method: 'POST',
      url: '/api/remove'
    });

    response = httpMocks.createResponse();

    const { matcher } = router();
    const mock = jest.fn();
    matcher.post(/\/api\/search.*/, mock);
    matcher.post(/\/api\/add.*/, mock);
    matcher.post(/\/api\/remove.*/, mock);

    matcher(request1, response);
    matcher(request2, response);
    matcher(request3, response);

    expect(mock).toHaveBeenCalledTimes(3);
    expect(mock).toHaveBeenCalledWith(request1, response);
    expect(mock).toHaveBeenCalledWith(request2, response);
    expect(mock).toHaveBeenCalledWith(request3, response);

  });

  describe.each(supportedHttpMethods)('when a %s request is made to matching route', method => {
    beforeEach(() => {
      request = httpMocks.createRequest({
        method: method,
        url: '/api/search?q=technology'
      });

      response = httpMocks.createResponse();
    });

    it('maps it to the handler', () => {
      const { matcher } = router();
      const mock = jest.fn();
      matcher[method.toLowerCase()](/\/api\/search.*/, mock);

      matcher(request, response);

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
      const { matcher, routes } = router();

      const mockHandler = jest.fn();
      const mockNoHandler = jest.fn();
      matcher.post(/\/api\/search.*/, mockHandler);

      matcher.post(/\/api\/searchss.*/, () => {});
      matcher.post(mockNoHandler);

      matcher(request, response);

      expect(mockNoHandler).toHaveBeenCalledTimes(1);
      expect(mockHandler).not.toHaveBeenCalled();
      expect(mockNoHandler).toHaveBeenCalledWith(request, response);
    });
  });
});