const express = require('express');

const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const app = express();

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(cors());

require('./mongoDB')();
require('./routes')(app);

app.listen(process.env.PORT || 8081, function (err) {
  if (err) {
    throw err;
  }
  console.log('App is running at http://localhost:%d in %s mode', process.env.PORT || 8081, app.get('env'));
});




