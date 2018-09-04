
```
const { router } = require('node-simple-router');
const { home, search, handler404 } = require('./handlers');

router.get(/\/api\/search.*/, news);
router.get(/\/app.*/, home);
// Catchall route
router.get(handler404);

// Express
const app = express();
app.use(router);

// Plain node http/https
const server = http.createServer(router);
```