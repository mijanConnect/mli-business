import { getMediaBaseUrl } from "../../config/runtimeConfig";

export const getImageUrl = (path) => {
  const baseUrl = getMediaBaseUrl();

  if (!path || typeof path !== "string") {
    return "/images/default-avatar.png";
  }
  if (path.startsWith("blob:") || path.startsWith("data:")) return path;
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  if (path.startsWith("/")) return `${baseUrl}${path}`;
  return `${baseUrl}/${path}`;
};
