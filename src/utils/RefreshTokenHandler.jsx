import axios from "axios";
import { getCookie, removeCookie } from "./index";
import Constants from "./Constants";

const RETRIESCOUNT = 2;

export const handleGetRefreshToken = async (maxRetries = RETRIESCOUNT) => {
  let attempt = 0;

  const tryRefresh = async () => {
    try {
      const data = { refreshToken: getCookie("refreshToken") };
      const response = await axios.post(
        `${Constants.BASE_URL}auth/refresh-token`,
        data,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        },
      );

      if (response?.data?.success && response?.data?.data?.refreshToken) {
        window.reload();
      } else {
        throw new Error("Invalid refresh response");
      }
    } catch {
      if (attempt < maxRetries - 1) {
        attempt++;
        await tryRefresh();
      } else {
        removeCookie("refreshToken");
        removeCookie("token");
        window.location.reload();
      }
    }
  };

  await tryRefresh();
};
