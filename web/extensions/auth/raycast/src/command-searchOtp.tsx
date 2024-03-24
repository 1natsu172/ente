import { OtpList } from "./pages/OtpList/index.js";
import { Login } from "./pages/Login/index.js";
import { useLogin } from "./hooks/accountHooks/index.js";

export default function SearchOtp() {
  const { isLoggedIn, isLoggedInChecking } = useLogin();

  if (!isLoggedIn) {
    return <Login />;
  }
  return <OtpList isLoggedInChecking={isLoggedInChecking} />;
}
