import Api from "./Api";

export const getProfile = async () => Api().get("master/profile");

export const getNewNotifications = async () =>
  Api().get("master/new-notifications");

export const getAllNotifications = async (params) =>
  Api().get("master/all-notifications", { params });

export const getAllData = async ({ master, limit, page, search, deleted, selectedSortOrder }) =>
  Api().get(`label/list/${master}/all`, { params: { page, limit, search, deleted, selectedSortOrder } })

export const getAllTreeDataActive = async (master, sub_master, limit, page) =>
  Api().get(`label/active/${master}/${sub_master}/all`, {
    params: { limit, page },
  });

export const getValueData = async (master, id, deleted = 0) =>
  Api().get(`label/val/${master}/${id}`, {
    params: { deleted },
  });

export const updateData = async (master, payload, id) => {
  payload.lbl_cat = master;

  const response = await Api().put(`label/${id}`, payload);

  return response;
};

export const addData = async (master, payload) => {
  payload.lbl_cat = master;

  const response = await Api().post(`label`, payload);

  return response;
};

export const uploadImages = async (formData) =>
  Api().post(`master/uploadImages`, formData);

export const uploadFiles = async (formData, onUploadProgress) => {
  const response = await Api().post(`master/uploadFiles`, formData, {
    headers: {
      "content-type": "multipart/form-data",
      "Access-Control-Allow-Origin": "*",
    },
    onUploadProgress
  });

  return response;
};

export const deleteLabel = async (payload) => {
  const response = await Api().post("label/delete", payload);
  return response;
};
