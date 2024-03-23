import { use } from "react";
import { getEmail } from "../../services/storageService/helper.js";

export const useEmail = () => {
  const email = use(getEmail);
  return { email };
};
