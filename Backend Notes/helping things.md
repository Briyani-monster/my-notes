```
app.use(express.static(path.join(__dirname, 'public')));
```


`path.js`
to get complete directory name

```
const path = require('path');
module.exports = path.dirname(process.mainModule.filename);
```


to use `body-parser`

`npm i body-parser`

```
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
```

