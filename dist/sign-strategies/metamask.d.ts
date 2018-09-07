/**
 * Delegates the sign process into the metamask browser addon
 * @param data Data to be signed
 * @throws {TypeError} if no metamask instance is found on the window context
 */
export default function metamaskSign(...data: any[]): Promise<string>;
