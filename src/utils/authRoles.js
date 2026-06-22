export const MERCHANT_ROLES = [
"ADMIN_MERCHANT",
  "MERCHANT",
  "VIEW_MERCHANT",
  // Legacy typo values still returned by some accounts
  "ADMIN_MERCHANT",
  "MERCHANT",
  "VIEW_MERCHANT",
];

export const getProfileRole = (profile) =>
  profile?.user?.role || profile?.role || null;

export const isMerchantRole = (role) => MERCHANT_ROLES.includes(role);

export const getMerchantRedirectPath = (role) =>
  role === "VIEW_MERCHANT" || role === "VIEW_MERCHANT"
    ? "/sell-management"
    : "/";
