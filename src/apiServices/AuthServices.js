import Api from "./Api";

export const Login = async (payload) => Api().post(`/admin/login`, payload);

export const GetUserProfile = async () => Api().get(`auth/get-profile`);
