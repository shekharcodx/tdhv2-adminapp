import Cookies from "js-cookie";

const setItem = (key, value) => {
  localStorage.setItem(key, String(value));
};

const setObjectInLocalStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const getItem = (key) => {
  const val = localStorage.getItem(key);
  return val ? JSON.parse(val) : null;
};

const getSingleItem = (key) => {
  return localStorage.getItem(key);
};

const removeItem = (key) => {
  localStorage.removeItem(key);
};

const setToken = (token) => {
  Cookies.set("admin-token", token, { expires: 1 });
};

const getToken = () => {
  return Cookies.get("admin-token") || null;
};

const removeToken = () => {
  Cookies.remove("admin-token");
  Cookies.remove("adminRefreshToken");
};

const setUser = (user) => {
  Cookies.set("user-admin", JSON.stringify(user));
};

const getUser = () => {
  const user = Cookies.get("user-admin");
  return user ? JSON.parse(user) : null;
};

const removeUser = () => {
  Cookies.remove("user-admin");
};

const setUserRole = (role) => {
  Cookies.set("admin-role", role.toString(), { expires: 1 });
};

const getUserRole = () => {
  const role = Cookies.get("admin-role");
  return role ? parseInt(role, 10) : null;
};

const removeUserRole = () => {
  Cookies.remove("admin-role");
};

export {
  setItem,
  getItem,
  getSingleItem,
  setObjectInLocalStorage,
  removeItem,
  setToken,
  getToken,
  setUser,
  getUser,
  removeUser,
  removeToken,
  setUserRole,
  getUserRole,
  removeUserRole,
};
