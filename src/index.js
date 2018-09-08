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
    for (let [path, options] of routes.entries()) {
      let { handler, method } = options;

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

  supportedHttpMethods.forEach(method => {
    matcher[method.toLowerCase()] = (path, handler) => {
      if (!handler) {
        handler = path;
        path = /.*/;
      }

      routes.set(path, { handler, method });
    };
  });

  return {
    matcher,
    routes() {
      const configuredRoutes = [];
      for (let [_, options] of routes.entries()) {
        let { path, method } = options;
        configuredRoutes.push(`${method}: ${path}`);
      }

      return configuredRoutes;
    }
  };
}

module.exports = {
  router,
  supportedHttpMethods
};