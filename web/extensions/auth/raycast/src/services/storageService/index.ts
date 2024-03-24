import { LocalStorage as localStorage } from "@raycast/api";

export enum LS_KEYS {
  USER = "user",
  SESSION = "session",
  KEY_ATTRIBUTES = "keyAttributes",
  ORIGINAL_KEY_ATTRIBUTES = "originalKeyAttributes",
  SUBSCRIPTION = "subscription",
  FAMILY_DATA = "familyData",
  PLANS = "plans",
  IS_FIRST_LOGIN = "isFirstLogin",
  JUST_SIGNED_UP = "justSignedUp",
  SHOW_BACK_BUTTON = "showBackButton",
  EXPORT = "export",
  THUMBNAIL_FIX_STATE = "thumbnailFixState",
  LIVE_PHOTO_INFO_SHOWN_COUNT = "livePhotoInfoShownCount",
  LOGS = "logs",
  USER_DETAILS = "userDetails",
  COLLECTION_SORT_BY = "collectionSortBy",
  THEME = "theme",
  WAIT_TIME = "waitTime",
  API_ENDPOINT = "apiEndpoint",
  MAP_ENABLED = "mapEnabled",
  SRP_SETUP_ATTRIBUTES = "srpSetupAttributes",
  SRP_ATTRIBUTES = "srpAttributes",
  CF_PROXY_DISABLED = "cfProxyDisabled",
  REFERRAL_SOURCE = "referralSource",
  CLIENT_PACKAGE = "clientPackage",
}

function __isParsableJson(params: any) {
  try {
    JSON.parse(params);
  } catch (_error) {
    return false;
  }
  return true;
}

export const setData = async (key: LS_KEYS, value: object) => {
  if (typeof localStorage === "undefined") {
    return null;
  }
  await localStorage.setItem(key, JSON.stringify(value));
};

export const removeData = async (key: LS_KEYS) => {
  if (typeof localStorage === "undefined") {
    return null;
  }
  await localStorage.removeItem(key);
};

export const getData = async <ReturnValue extends localStorage.Value | object>(
  key: LS_KEYS,
): Promise<ReturnValue | null> => {
  try {
    if (typeof localStorage === "undefined" || typeof key === "undefined") {
      return null;
    }

    const data = await localStorage.getItem(key);

    if (typeof data === "undefined" || data === "undefined") {
      return null;
    }
    if (data && typeof data === "string" && __isParsableJson(data)) {
      return JSON.parse(data) as ReturnValue;
    }
    return data as ReturnValue;
  } catch (e) {
    console.log(e, "Failed to Parse JSON for key " + key);
    throw e;
  }
};

export const clearData = async () => {
  if (typeof localStorage === "undefined") {
    return null;
  }
  await localStorage.clear();
};
