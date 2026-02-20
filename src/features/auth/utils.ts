export const getToken = (): string => {
  const token = sessionStorage.getItem("ifob_token");
  if (token) {
    return token;
  } else {
    return import.meta.env.VITE_TOKEN || "";
  }
};