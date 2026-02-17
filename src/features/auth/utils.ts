export const getToken = (): string => {
  const token = localStorage.getItem("token");
  if (token) {
    return token;
  } else {
    return import.meta.env.VITE_TOKEN || "";
  }
};