import { spawn } from 'child_process';
import { Utils } from './index';

enum cliAction {
  Encrypt = `encrypt`,
  Decrypt = `decrypt`,
  Verify = 'is-peacemakr-ciphertext'
}

export class PeacemakrClient {
  apiKey: string;
  static noApiKeyError = `Please provide an API key to use Peacemakr`;

  constructor(apiKey: string) {
    // Ensure that API key has been provided
    if (apiKey === '') throw new Error(PeacemakrClient.noApiKeyError);
    this.apiKey = apiKey;
  }

  async encrypt(clearTextByteArray: Uint8Array): Promise<Uint8Array> {
    return await this.executeActionAndResolve(clearTextByteArray, `-${cliAction.Encrypt.toLocaleLowerCase()}`);
  }

  async encryptInDomain(clearTextByteArray: Uint8Array, domain: string): Promise<Uint8Array> {
    return await this.executeActionAndResolve(
      clearTextByteArray,
      `-${cliAction.Encrypt.toLocaleLowerCase()} -domain=${domain}`
    );
  }

  async decrypt(cipherTextByteArray: Uint8Array): Promise<Uint8Array> {
    return await this.executeActionAndResolve(cipherTextByteArray, `-${cliAction.Decrypt.toLocaleLowerCase()}`);
  }

  async isPeacemakrCiphertext(cipherTextByteArray: Uint8Array): Promise<boolean> {
    const notPeacemakrCipherMessage = 'Is not a Peacemakr ciphertext';
    const result = await this.executeActionAndResolve(cipherTextByteArray, `-${cliAction.Verify.toLocaleLowerCase()}`);
    return !Utils.uint8ArrayToString(result).includes(notPeacemakrCipherMessage);
  }

  private executeActionAndResolve(byteArray: Uint8Array, action: string): Promise<Uint8Array> {
    return new Promise((resolve, reject) => {
      const command = `echo "${Utils.uint8ArrayToString(byteArray)}" | peacemakr-cli ${action}`;
      const cp = spawn(command, {
        shell: true,
        env: {
          PEACEMAKR_APIKEY: this.apiKey
        }
      });
      let stdout = '';
      let stderr = '';
      cp.stdout.on('data', (contents) => {
        stdout += contents;
      });
      cp.stderr.on('data', (contents) => {
        stderr += contents;
      });
      cp.on('error', reject).on('close', function (code) {
        if (code === 0) {
          // remove '\n' from stdout
          resolve(Utils.stringToUint8Array(stdout.replace(/\r?\n|\r/g, '')));
        } else {
          reject(new Error(`Failed to ` + action + ` due to ` + stderr));
        }
      });
    });
  }
}
