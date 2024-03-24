import { addLocalLog } from "@ente/shared/logging/index.js";
import { APPS } from "@ente/shared/apps/constants.js";
import { getSRPAttributes } from "@ente/accounts/api/srp.js";
import { sendOtt } from "@ente/accounts/api/user.js";
import { PAGES } from "@ente/accounts/constants/pages.js";
import { LS_KEYS, setData } from "./storageService/index.js";

export const loginUser = async (email: string): Promise<{ nextAction: PAGES }> => {
  try {
    // setData(LS_KEYS.USER, { email });
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
