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
