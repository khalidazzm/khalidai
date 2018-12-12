const { APP_SECRET } = require('../module/Token');
const crypto = require('crypto');

const verifyRequestSignature = (req, res, buf) => {
  const signature = req.headers['x-hub-signature'];
  console.log('[DEBUG] signature', signature);

  if (!signature) {
    // In DEV, log an error. In PROD, throw an error.
    console.error("Couldn't validate the signature.");
  } else {
    const elements = signature.split('=');
    const method = elements[0];
    const signatureHash = elements[1];

    const expectedHash = crypto.createHmac('sha1', APP_SECRET)
      .update(buf)
      .digest('hex');

    if (signatureHash !== expectedHash) {
      throw new Error("Couldn't validate the request signature.");
    }
  }
};

module.exports = verifyRequestSignature;