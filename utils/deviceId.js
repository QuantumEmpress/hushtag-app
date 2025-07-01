import * as SecureStore from "expo-secure-store"
import { v4 as uuidv4 } from "uuid"

const DEVICE_ID_KEY = "anonymous_user_id"

export async function getAnonymousUserId() {
  let storedId = await SecureStore.getItemAsync(DEVICE_ID_KEY)

  if (!storedId) {
    storedId = uuidv4()
    await SecureStore.setItemAsync(DEVICE_ID_KEY, storedId)
  }

  return storedId
}
