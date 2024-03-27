import { usePromise } from "@raycast/utils";
import { LS_KEYS } from "@ente/shared/storage/localStorage/index.js";
import { User } from "@ente/shared/user/types.js";
import { getData } from "../../services/storageService/index.js";
// import { getEmail } from "../../services/storageService/helper.js";

// export const useToken = () => {
//   const email = use(getEmail);
//   return { email };
// };

export const useUser = () => {
  const user = usePromise(async () => await getData<User>(LS_KEYS.USER));
  return user;
};

export const useLogin = (): {
  isLoggedIn: boolean;
  isLoggedInChecking: boolean;
} => {
  // useEffect(() => {
  //   async function checkData() {
  //     const services = await checkIfCached(SERVICES_KEY);
  //     const apps = await checkIfCached(APPS_KEY);
  //     setLogin(services || apps);
  //   }

  //   checkData();
  // }, []);

  // useEffect(() => {
  //   // remove cached values if Authy Id has been changed
  //   async function invalidateCache() {
  //     const isExist = await checkIfCached(AUTHY_ID);
  //     if (isExist) {
  //       const { authyId } = getPreferenceValues<{ authyId: string }>();
  //       const cachedId = await getFromCache<string>(AUTHY_ID);
  //       if (authyId != cachedId) {
  //         await removeFromCache(SECRET_SEED);
  //         await removeFromCache(DEVICE_ID);
  //         await removeFromCache(SERVICES_KEY);
  //         await removeFromCache(APPS_KEY);
  //         await removeFromCache(REQUEST_ID);
  //         setLogin(false);
  //       }
  //     }
  //   }

  //   invalidateCache();
  // });

  return {
    isLoggedIn: false,
    isLoggedInChecking: false,
  };
};
