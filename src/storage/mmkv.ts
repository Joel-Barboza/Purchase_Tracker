import { createMMKV } from 'react-native-mmkv';

export const storage = createMMKV({
  id: 'purchase-tracker-storage',
  encryptionKey: undefined, // optional, add later if needed
});
