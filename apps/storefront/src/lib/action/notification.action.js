import { notifications } from "@/src/data/notifications";

const getNotification = async () => ({ data: { data: notifications } });


export default {
  getNotification,
};