export function validateMongoUri(uri) {
  if (!uri) {
    return 'Connection URI is required';
  }

  try {
    const url = new URL(uri);
    if (url.protocol !== 'mongodb:' && url.protocol !== 'mongodb+srv:') {
      return 'Invalid MongoDB URI protocol';
    }
    return null;
  } catch {
    return 'Invalid connection URI format';
  }
}