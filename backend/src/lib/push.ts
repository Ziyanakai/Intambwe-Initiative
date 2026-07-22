import Expo, { ExpoPushMessage } from 'expo-server-sdk'

const expo = new Expo()

export async function sendPush(token: string, title: string, body: string, data?: Record<string, unknown>) {
  if (!Expo.isExpoPushToken(token)) return
  const message: ExpoPushMessage = { to: token, sound: 'default', title, body, data }
  try {
    await expo.sendPushNotificationsAsync([message])
  } catch {
    // non-blocking — push failure should not break the API response
  }
}
