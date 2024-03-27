import { HttpStatusCode } from "axios";
import { addLocalLog } from "@ente/shared/logging/index.js";
import { APPS } from "@ente/shared/apps/constants.js";
import { SRPSetupAttributes } from "@ente/accounts/types/srp.js";
import { configureSRP } from "@ente/accounts/services/srp.js";
import { getSRPAttributes } from "@ente/accounts/api/srp.js";
import { putAttributes, sendOtt, verifyOtt } from "@ente/accounts/api/user.js";
import { PAGES } from "@ente/accounts/constants/pages.js";
import { LS_KEYS, getData, setData } from "./storageService/index.js";
import { UserVerificationResponse } from "@ente/accounts/types/user";

import { ApiError } from "@ente/shared/error";

import InMemoryStore, { MS_KEYS } from "@ente/shared/storage/InMemoryStore";
import { clearFiles } from "@ente/shared/storage/localForage/helpers";

import { getLocalReferralSource, setIsFirstLogin } from "@ente/shared/storage/localStorage/helpers";
import { clearKeys } from "@ente/shared/storage/sessionStorage";
import { KeyAttributes, User } from "@ente/shared/user/types.js";

export const loginUser = async (email: string): Promise<{ nextAction: PAGES }> => {
  try {
    setData(LS_KEYS.USER, { email });
    const srpAttributes = await getSRPAttributes(email);
    addLocalLog(() => ` srpAttributes: ${JSON.stringify(srpAttributes)}`);

    if (!srpAttributes || srpAttributes.isEmailMFAEnabled) {
      await sendOtt(APPS.AUTH, email);
      // route to mfa
      return { nextAction: PAGES.VERIFY };
    } else {
      await setData(LS_KEYS.SRP_ATTRIBUTES, srpAttributes);
      // route to cred
      return { nextAction: PAGES.CREDENTIALS };
    }
  } catch (e) {
    if (e instanceof Error) {
      throw Error(`UNKNOWN_ERROR (reason:${e.message})`);
    } else {
      throw Error(`UNKNOWN_ERROR (reason:${JSON.stringify(e)})`);
    }
  }
};

export const checkMfaCode = async ({
  email,
  ott,
}: {
  email: string | null;
  ott: string;
}): Promise<{ nextAction: PAGES } | undefined> => {
  try {
    if (!email) {
      throw Error("email not found");
    }

    const referralSource = getLocalReferralSource();
    const resp = await verifyOtt(email, ott, referralSource);
    const { keyAttributes, encryptedToken, token, id, twoFactorSessionID, passkeySessionID } =
      resp.data as UserVerificationResponse;
    if (passkeySessionID) {
      const user = await getData<User>(LS_KEYS.USER);
      await setData(LS_KEYS.USER, {
        ...user,
        passkeySessionID,
        isTwoFactorEnabled: true,
        isTwoFactorPasskeysEnabled: true,
      });
      setIsFirstLogin(true);
      return { nextAction: PAGES.CREDENTIALS };
    } else if (twoFactorSessionID) {
      await setData(LS_KEYS.USER, {
        email,
        twoFactorSessionID,
        isTwoFactorEnabled: true,
      });
      setIsFirstLogin(true);
      return { nextAction: PAGES.TWO_FACTOR_VERIFY };
    } else {
      await setData(LS_KEYS.USER, {
        email,
        token,
        encryptedToken,
        id,
        isTwoFactorEnabled: false,
      });
      if (keyAttributes) {
        await setData(LS_KEYS.KEY_ATTRIBUTES, keyAttributes);
        await setData(LS_KEYS.ORIGINAL_KEY_ATTRIBUTES, keyAttributes);
      } else {
        const ORIGINAL_KEY_ATTRIBUTES = await getData<KeyAttributes>(LS_KEYS.ORIGINAL_KEY_ATTRIBUTES);
        if (ORIGINAL_KEY_ATTRIBUTES && token) {
          await putAttributes(token, ORIGINAL_KEY_ATTRIBUTES);
        }
        const SRP_SETUP_ATTRIBUTES = await getData<SRPSetupAttributes>(LS_KEYS.SRP_SETUP_ATTRIBUTES);
        if (SRP_SETUP_ATTRIBUTES) {
          const srpSetupAttributes: SRPSetupAttributes = SRP_SETUP_ATTRIBUTES;
          await configureSRP(srpSetupAttributes);
        }
      }
      await clearFiles();
      setIsFirstLogin(true);
      const redirectURL = InMemoryStore.get(MS_KEYS.REDIRECT_URL);
      InMemoryStore.delete(MS_KEYS.REDIRECT_URL);
      if (keyAttributes?.encryptedKey) {
        clearKeys();
        return { nextAction: redirectURL ?? PAGES.CREDENTIALS };
      } else {
        return { nextAction: redirectURL ?? PAGES.GENERATE };
      }
    }
  } catch (e) {
    if (e instanceof ApiError) {
      if (e?.httpStatusCode === HttpStatusCode.Unauthorized) {
        throw Error("INVALID_CODE");
      } else if (e?.httpStatusCode === HttpStatusCode.Gone) {
        throw Error("EXPIRED_CODE");
      }
    } else {
      throw e;
    }
  }
};

export const resendMfaCode = async ({ appName, email }: { appName: APPS; email: string }) => {
  await sendOtt(appName, email);
};
