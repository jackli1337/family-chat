const
    express = require('express'),
    app = express();
let server = app.listen(8000);
app.use(express.static(`client`));