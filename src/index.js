const url = require('url');

const fgRed = '\x1b[31m';
const fgGreen = '\x1b[32m';
const reset = '\x1b[0m';
const logGreen = msg => console.log(`${fgGreen}%s${reset}`, `router: ${msg}`);
const logRed = msg => console.log(`${fgRed}%s${reset}`, `router: ${msg}`);

const supportedHttpMethods = [
  'GET',
  'POST',
  'PUT',
  'DELETE',
  'HEAD',
  'CONNECT',
  'OPTIONS',
  'TRACE',
  'PATCH'
];

const router = () => {
  const routes = new Map();

  const matcher = (req, res) => {
    var { pathname } = url.parse(req.url);
    for (let [method, options] of routes.entries()) {
      let { path, handler } = options;

      if (method === req.method) {
        const match = path.test && path.test(pathname);
        if (match === true) {
          logGreen(`found match "${path}" for "${req.url}"`);
          return handler(req, res);
        }
      }
    }

    logRed(`no match found for "${req.url}"`);
  };

  const methods = supportedHttpMethods.forEach(method => {
    matcher[method.toLowerCase()] = (path, handler) => {
      if (!handler) {
        handler = path;
        path = /.*/;
      }

      routes.set(method, { path, handler });
    };
  });

  return matcher;
}

module.exports = {
  router: router(),
  supportedHttpMethods
};