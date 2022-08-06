/**
 * Convert "0x4306D7a79265D2cb85Db0c5a55ea5F4f6F73C4B1" to "0x430...c4b1".
 */
export function addressToShortAddress(address: string): string {
  let shortAddress = address;
  if (address?.length > 10) {
    shortAddress = `${address.substring(0, 6)}...${address.substring(
      address.length - 4,
    )}`;
  }
  return shortAddress?.toLowerCase();
}

export async function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, _) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as any);
    reader.readAsDataURL(blob);
  });
}

export async function base64ToBlob(base64: string): Promise<Blob> {
  const result = await fetch(base64);
  return result.blob();
}
