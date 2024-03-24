import { User } from "@ente/shared/user/types.js";
import { LS_KEYS, getData, setData } from "./index.js";

export const getToken = async () => {
  const user = await getData<User>(LS_KEYS.USER);
  return user?.token;
};

export const getUserID = async () => {
  const user = await getData<User>(LS_KEYS.USER);
  return user?.id;
};

export const isFirstLogin = async () => {
  const is = await getData<{ status: boolean }>(LS_KEYS.IS_FIRST_LOGIN);
  return is?.status ?? false;
};

export async function setIsFirstLogin(status: boolean) {
  await setData(LS_KEYS.IS_FIRST_LOGIN, { status });
}

export const justSignedUp = async () => {
  const a = await getData<{ status: boolean }>(LS_KEYS.JUST_SIGNED_UP);
  return a?.status ?? false;
};

export async function setJustSignedUp(status: boolean) {
  await setData(LS_KEYS.JUST_SIGNED_UP, { status });
}

export async function getLocalMapEnabled() {
  const a = await getData<{ value: boolean }>(LS_KEYS.MAP_ENABLED);
  return a?.value ?? false;
}

export async function setLocalMapEnabled(value: boolean) {
  await setData(LS_KEYS.MAP_ENABLED, { value });
}

export async function getLocalReferralSource() {
  const a = await getData<{ source: string }>(LS_KEYS.REFERRAL_SOURCE);
  return a?.source;
}

export async function setLocalReferralSource(source: string) {
  await setData(LS_KEYS.REFERRAL_SOURCE, { source });
}
