export const extractAuthTokens = (payload) => {
  const data = payload?.data ?? payload;

  const accessToken =
    data?.accessToken || data?.token || payload?.accessToken || payload?.token;

  const refreshToken =
    data?.refreshToken || payload?.refreshToken || null;

  const role =
    data?.user?.role || data?.role || payload?.user?.role || payload?.role;

  return { accessToken, refreshToken, role };
};
