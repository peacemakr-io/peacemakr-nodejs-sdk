import { PeacemakrClient, Utils } from '@peacemakr/nodejs-sdk';
import * as dotenv from 'dotenv';

const express = require('express');
const path = require('path');
const app = express();
const port = 3000;
// Please provide Peacemakr's API key via .env file or directly here
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
const apiKey: string = typeof process.env.PEACEMAKR_APIKEY !== 'undefined' ? process.env.PEACEMAKR_APIKEY! : '';

const peacemakrClient1 = new PeacemakrClient(apiKey);

app.get('/', (req: any, res: { send: (arg0: string) => void }) => {
  res.send("This is an implementation example of Peacemakr's NodeJS SDK. Available endpoints: '/encrypt?cleartext=cleartext&domain=optional'");
});

app.get('/encrypt', async (req: any, res: any) => {
  const clt: string = typeof req.query.cleartext !== 'undefined' ? req.query.cleartext! : 'DEFAULT TEST SECRET';
  const dom: string = typeof req.query.domain !== 'undefined' ? req.query.domain! : 'undefined';
  console.log('Received request to encrypt:' + clt + ', in domain: ' + dom);
  if (dom.match('undefined')) {
    console.log('No domain has been specified');
    await peacemakrClient1
      .encrypt(Utils.stringToUint8Array(clt))
      .then((result) => {
        console.log('Produced cipthertext: ' + Utils.uint8ArrayToString(result));
        return res.status(200).json({ ciphertext: Utils.uint8ArrayToString(result) });
      })
      .catch((error) => {
        console.log('failed to encrypt: ' + error);
        return res.status(500).json({ exception: error.toString() });
      });
  } else {
    console.log(`Domain ${dom} has been specified`);
    await peacemakrClient1
      .encryptInDomain(Utils.stringToUint8Array(clt), dom)
      .then((result) => {
        console.log(`Produced cipthertext in domain ${dom}: ` + Utils.uint8ArrayToString(result));
        return res.status(200).json({ ciphertext: Utils.uint8ArrayToString(result) });
      })
      .catch((error) => {
        console.log('failed to encrypt: ' + error);
        return res.status(500).json({ exception: error.toString() });
      });
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
