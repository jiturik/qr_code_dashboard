import Api from "./Api";

export const GetDashBoardStats = async (payload) =>
  Api().post(`dashboard`, payload);
