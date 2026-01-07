const env = import.meta.env;
const config = {
  BASE_URL: env.VITE_ENV_BASE_URL,
  LOCAL_URL: env.VITE_ENV_LOCAL_URL,
  S3_UPLOADER: {
    RECAPTCHA_SITE_KEY: env.VITE_ENV_RECAPTCHA_SITE_KEY || "fallback-key",
  },
  GOOGLE_MAPS_KEY: env.VITE_GOOGLE_MAPS_API_KEY,
};
export default config;
