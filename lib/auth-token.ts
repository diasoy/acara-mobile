import * as SecureStore from "expo-secure-store";

const ACCESS_TOKEN_KEY = "acara_access_token";

let cachedAccessToken: string | null = null;
let hasLoadedAccessToken = false;

async function loadAccessTokenIfNeeded(): Promise<void> {
  if (hasLoadedAccessToken) {
    return;
  }

  cachedAccessToken = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
  hasLoadedAccessToken = true;
}

export async function getAccessToken(): Promise<string | null> {
  await loadAccessTokenIfNeeded();
  return cachedAccessToken;
}

export async function setAccessToken(accessToken: string): Promise<void> {
  cachedAccessToken = accessToken;
  hasLoadedAccessToken = true;
  await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken);
}

export async function clearAccessToken(): Promise<void> {
  cachedAccessToken = null;
  hasLoadedAccessToken = true;
  await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
}

export async function hydrateAccessToken(): Promise<string | null> {
  return getAccessToken();
}
