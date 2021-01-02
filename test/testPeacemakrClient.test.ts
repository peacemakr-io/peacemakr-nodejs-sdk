import { PeacemakrClient } from '../src';
import { Utils } from '../src';
import * as dotenv from 'dotenv';
import assert = require('assert');

// Please provide Peacemakr's API key via .env file or directly here
dotenv.config();
const apiKey: string = typeof process.env.PEACEMAKR_APIKEY !== 'undefined' ? process.env.PEACEMAKR_APIKEY! : '';

function isAPIKeyProvided(): boolean {
  return apiKey !== '';
}

describe('Test PeacemakrClient', function () {
  // the initial call to the server (if running tests for the time) may take more than 2000ms
  // the default time out for Mocha is 2000, pumping up the time out to 15000ms
  this.timeout(15000);
  // a test string
  const secretInTheClear = `This is a super important secret`;
  // a good Peacemakr client; please provide your valid API key for testing
  let peacemakrClient: PeacemakrClient;
  if (isAPIKeyProvided()) {
    peacemakrClient = new PeacemakrClient(apiKey);
  }

  it('Test encrypt/decrypt/verify', async () => {
    if (isAPIKeyProvided()) {
      let startTime = Date.now();
      const encryptedBytes = await peacemakrClient.encrypt(Utils.stringToUint8Array(secretInTheClear));
      let endTime = Date.now();
      console.log(`Encryption took: ` + (endTime - startTime));

      startTime = Date.now();
      assert.ok(await peacemakrClient.isPeacemakrCiphertext(encryptedBytes), 'Expected a valid Peacemakr ciphertext');
      endTime = Date.now();
      console.log(`Verification took: ` + (endTime - startTime));

      startTime = Date.now();
      const decryptedBytes = await peacemakrClient.decrypt(encryptedBytes);
      endTime = Date.now();
      console.log(`Encryption took: ` + (endTime - startTime));
      // compare stings before and after ecryption/decryption
      assert.ok(
        Utils.uint8ArrayToString(decryptedBytes) === secretInTheClear,
        `Data does not match before and after encryption/decryption`
      );
    } else {
      console.warn(`Skipping test - ` + PeacemakrClient.noApiKeyError);
      return it.skip;
    }
  });

  it(`Test failure to decrypt`, async () => {
    if (isAPIKeyProvided()) {
      let errorThrown = false;
      try {
        await peacemakrClient.decrypt(Utils.stringToUint8Array(`Not a Peacemakr ciphertext`));
      } catch (e) {
        errorThrown = true;
      }
      assert.ok(errorThrown, `An Error should have occurred while decrypting an invalid cipthertext`);
    } else {
      console.warn(`Skipping test - ` + PeacemakrClient.noApiKeyError);
      return it.skip;
    }
  });

  it(`Test no API key has been provided`, async () => {
    let errorThrown = false;
    try {
      new PeacemakrClient('');
    } catch (e) {
      errorThrown = true;
      assert.ok(
        e.toString().includes(PeacemakrClient.noApiKeyError),
        `An Error should have occurred when no API key has been provided`
      );
    }
    assert.ok(errorThrown, `An Error should have occurred when no API key has been provided`);
  });
});
