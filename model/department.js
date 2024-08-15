import { request,requestCoreApi,requestGeneric} from "~/assets/utils/axios";
import { getAllCookies } from "~/assets/utils/cookies";
import axios from "axios";

// get department list
export const getBusinessDepartments = async (data) => {
  return await requestGeneric
    .get(`/business/${data.hashId}/departments`)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return { err: err.response && err.response.data || err };
    });
};

// get a department
export const getDepartment = async (data) => {
  return await requestGeneric
    .get(`/department/${data.hashId}`)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return { err: err.response && err.response.data || err };
    });
};

// Add Department
export const addDepartment = async (data) => {
  return await requestGeneric
    .post(`/department`, data)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return { err: err.response && err.response.data || err };
    });
};

// Remove Department
export const removeDepartment = async (data) => {
  return await requestGeneric
    .delete(`/department/${data?.hashId}`)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return { err: err.response && err.response.data || err };
    });
};

// update Department
export const updateDepartment = async (data) => {
  return await requestGeneric
    .put(`/department`,data)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return { err: err.response && err.response.data || err };
    });
};

// Remove user from department
export const removeUserFromDepartment = async (data) => {
  return await requestGeneric
    .delete(`/department/${data?.hashId}/removeUser`, { data: { UserId: data.UserId } }) // Ensure correct format
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return { err: (err.response && err.response.data) || err };
    });
};

//upload image
export const uploadAvatarDept = async (data1) => {
  let data = new FormData();
    data.append('file', data1.file);
    data.append('width', data1.coordinates.width);
    data.append('height', data1.coordinates.height);
    data.append('left', data1.coordinates.left);
    data.append('top', data1.coordinates.top);
  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `${process.env.ACCOUNT_API_ENDPOINT}/department/avatar/upload`,
    headers: { 
      Authorization: `Bearer ${getAllCookies()[process.env.SSO_COOKIE_NAME]}`,
      client_time: new Date().toISOString(),
    },
    data : data
  };
  try {
    const response = await axios.request(config);
    return response.data;
  } catch (error) {
    throw error;
  }
};

//upload crop image
export const cropUploadAvatarDept = async (data) => {
  return await requestGeneric
  .post(`/department/avatar/crop-upload`, data)
  .then((res) => {
    return res.data;
  })
  .catch((err) => {
    return { err: err.response && err.response.data || err };
  });
};

//unassign team from dept
export const teamUnassign = async (data) => {
  return await requestGeneric
    .post(`/team/unassign`, data)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return { err: err.response && err.response.data || err };
    });
};

// return the list of users which user not belongs to dept
export const getUserNotbelongDept = async (data) => {
  return await requestGeneric
    .post(`/department/${data.hashId}/unassignUsers`,{ BusinessId: data.BusinessId })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return { err: err.response && err.response.data || err };
    });
};

// return the list of depts which user belongs to
export const getDeptuserbelong = async (data) => {
  return await requestGeneric
    .get(`/user/${data.hashId}/departments`)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return { err: err.response && err.response.data || err };
    });
};

//assign manager role in department
export const assignManagerRoleDept = async (data) => {
  return await requestGeneric
    .put(`/department/role`,data)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return { err: err.response && err.response.data || err };
    });
};

//unassign manager in the team
export const unassignManagerDept = async (data) => {
  return await requestGeneric
    .delete(`/department/role`,{data: { UserId: data.UserId, DeptId: data.DeptId}    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return { err: err.response && err.response.data || err };
    });
};

export const getUserAccessdept = async (data) => {
  return await requestGeneric
    .get(`/department/${data.DeptId}/usersRole?BusinessId=${data.BusinessId}&UserId=${data.UserId}`)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return { err: err.response && err.response.data || err };
    });
};
