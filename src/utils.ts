export class Utils {
  /**
   * Converts String to Uint8Array
   * @param string input
   */
  static stringToUint8Array(string: string): Uint8Array {
    if (string != null) {
      return new TextEncoder().encode(string);
    }
    throw new Error(`String input parameter can not be null`);
  }

  /**
   * Converts Uint8Array to String
   * @param uint8Array input
   */
  static uint8ArrayToString(uint8Array: Uint8Array): string {
    if (uint8Array != null) {
      return new TextDecoder('utf-8').decode(uint8Array);
    }
    throw new Error(`Uint8Array input parameter can not be null`);
  }
}
