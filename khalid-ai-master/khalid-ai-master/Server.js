// load all env config
require('dotenv').config();

// importing dependency
const bodyParser = require('body-parser');
const express = require('express');

const processor = require('./app/Main');
const verifyRequestSignature = require('./app/service/VerifyRequestSignature');
const { VALIDATION_TOKEN } = require('./app/module/Token');

const app = express();

app.set('port', process.env.PORT || 1263);
app.set('view engine', 'ejs');
app.use(bodyParser.json({ verify: verifyRequestSignature }));
app.use(express.static('public'));


/*
 * This function is only for webhook verification
 * Use your own validation token. Check that the token used in the Webhook
 * setup is the same token used here.
 *
 */

app.get('/webhook', (req, res) => {
  if (req.query['hub.mode'] === 'subscribe' &&
        req.query['hub.verify_token'] === VALIDATION_TOKEN) {
    console.log('[app.get] Validating webhook');
    res.status(200).send(req.query['hub.challenge']);
  } else {
    console.error('Failed validation. Make sure the validation tokens match.');
    res.sendStatus(403);
  }
});


/*
*
* All facebook messenger incoming chat will be handled here
*
*/
app.post('/webhook', processor);


/*
 * Start server
 * Webhooks must be available via SSL with a certificate signed by a valid
 * certificate authority.
 */
app.listen(app.get('port'), () => {
  console.log('[app.listen] Node app is running on port', app.get('port'));
});

