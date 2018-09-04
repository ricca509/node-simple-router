
```
const { router } = require('node-router');
const { home, news, handler404 } = require('./handlers');

router.get(/\/api\/news.*/, news);
router.get(/\/app.*/, home);
router.get(handler404);

app.use(router);

```