import { mockUsers } from "@/src/data/users";

const USERS_KEY = "mmj_mock_users";
const SUBSCRIBERS_KEY = "mmj_mock_subscribers";

const getSeededUsers = () => mockUsers.map((user) => ({ ...user }));

const readUsers = () => {
  if (typeof window === "undefined") return getSeededUsers();
  try {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || "null");
    if (Array.isArray(users) && users.length) return users;
    localStorage.setItem(USERS_KEY, JSON.stringify(getSeededUsers()));
    return getSeededUsers();
  } catch (error) {
    return getSeededUsers();
  }
};

const saveUsers = (users) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }
};

const saveSubscriber = (mobile_number) => {
  if (typeof window === "undefined") return;
  try {
    const list = JSON.parse(localStorage.getItem(SUBSCRIBERS_KEY) || "[]");
    localStorage.setItem(
      SUBSCRIBERS_KEY,
      JSON.stringify([...list, { mobile_number }])
    );
  } catch (error) {
    localStorage.setItem(
      SUBSCRIBERS_KEY,
      JSON.stringify([{ mobile_number }])
    );
  }
};

const registerUser = async (data) => {
  const users = readUsers();
  const duplicate = users.find((user) => user.email === data.email);
  if (duplicate) {
    return Promise.reject({
      response: {
        data: { error: { message: "Email is already registered." } },
      },
    });
  }

  const user = {
    id: users.length + 1,
    username: data.username,
    email: data.email,
    password: data.password,
    mobile_number: data.mobile_number,
  };
  saveUsers([...users, user]);
  return { data: { user, jwt: `mock-jwt-${user.id}` } };
};

const signIn = async (data) => {
  const users = readUsers();
  const user = users.find(
    (item) => item.email === data.email && item.password === data.password
  );
  if (!user) {
    return Promise.reject({
      response: {
        data: { error: { message: "Invalid email or password." } },
      },
    });
  }

  return { data: { user, jwt: `mock-jwt-${user.id}` } };
};

const postSubscriber = async (data) => {
  saveSubscriber(data.mobile_number);
  return { data: { data: { mobile_number: data.mobile_number } } };
};

const fetchLoggedInUser = async (token) => {
  const parsedId = Number(String(token || "").replace("mock-jwt-", ""));
  const users = readUsers();
  const user = users.find((item) => item.id === parsedId) || users[0];
  return { data: user };
};

export default {
  registerUser,
  signIn,
  postSubscriber,
  fetchLoggedInUser,
};