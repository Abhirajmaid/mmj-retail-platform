const SUBSCRIBERS_KEY = "mmj_mock_subscribers";

const readSubscribers = () => {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(SUBSCRIBERS_KEY) || "[]");
  } catch (error) {
    return [];
  }
};

const postSubscriber = async (data) => {
  const existing = readSubscribers();
  const next = [...existing, { mobile_number: data.mobile_number }];
  if (typeof window !== "undefined") {
    localStorage.setItem(SUBSCRIBERS_KEY, JSON.stringify(next));
  }
  return { data: { data: { mobile_number: data.mobile_number } } };
};

export default {
  postSubscriber,
};