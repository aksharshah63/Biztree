import axios from "axios";
import { request, requestGeneric, handleResponse } from "~/assets/utils/axios";

// user login
export const login = async (data) => {
  return await requestGeneric
    .post(`/auth/login`, data)
    .then(async(res) => {
      $nuxt.$gtm.push({event: 'login', userEmail: data.Email});
      await new Promise(r => setTimeout(r, 2000));
      return res.data;
    })
    .catch((err) => {
      return { err: err.response && err.response.data || err };
    });
};

// verify sso token
export const verifyToken = async (data) => {
  return await request
    .post(`/user/sso/verify`, data)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return { err: err.response && err.response.data || err };
    });
};

// get user data
export const getUser = async (data) => {
  return await request
    .get(`/user/${data.userId}`)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return { err: err.response && err.response.data || err };
    });
};

// send reset password link
export const sendResetLink = async (Email, data) => {
  return await requestGeneric
    .post(`/auth/token/${Email}`, data)
    .then((res) => {
      $nuxt.$gtm.push({event: 'password_reset_requested', email: Email});
      return res.data;
    })
    .catch((err) => {
      return { err: err.response && err.response.data || err };
    });
};

// change password with token
export const changePasswordWithToken = async (data) => {
  return await request
    .post(`/user/changePasswordWithToken`, data)
    .then((res) => {
      $nuxt.$gtm.push({event: 'password_resetted', email: data.Email});
      return res.data;
    })
    .catch((err) => {
      return { err: err.response && err.response.data || err };
    });
};

// user register
export const create = async (data) => {
  const request = axios.create({
    baseURL: process.env.ACCOUNT_API_ENDPOINT
  });
  return await request
    .post(`/user/`, data)
    .then((res) => {
      $nuxt.$gtm.push({eventCategory: 'Goal', eventLabel: 'n/a', eventAction: 'Account Created', userID: res.data.Id, businessId: res.data.BusinessId, email: data.Email});
      return res.data;
    })
    .catch((err) => {
      return { err: err.response && err.response.data || err };
    });
};

// user register 
export const register = async (data) => {
  return await request
    .post(`/user/register-invite`, data)
    .then((res) => {
      $nuxt.$gtm.push({eventCategory: 'Account', eventLabel: 'Register invited', eventAction: 'create', userID: res.data.Id, businessId: res.data.BusinessId});
      return res.data;
    })
    .catch((err) => {
      return { err: err.response && err.response.data || err };
    });
};

// update a user
export const updateUser = async (data) => {
  return await request
    .put(`/user`, data)
    .then((res) => {
      $nuxt.$gtm.push({eventCategory: 'Account', eventLabel: 'Update user', eventAction: 'update'});
      return res.data;
    })
    .catch((err) => {
      return { err: err.response && err.response.data || err };
    });
};

// change password
export const changePassword = async (data) => {
  return await request
    .post(`/user/changePassword`, data)
    .then((res) => {
      $nuxt.$gtm.push({event: 'password_resetted', email: data.Email});
      return res.data;
    })
    .catch((err) => {
      return { err: err.response && err.response.data || err };
    });
};

// invite a person
export const invitePerson = async (data) => {
  return await request
    .post(`/user/invite`, data)
    .then((res) => {
      $nuxt.$gtm.push({eventCategory: 'Account', eventLabel: 'Invite person', eventAction: 'invite', invitedEmail: data.Email});
      return res.data;
    })
    .catch((err) => {
      return { err: err.response && err.response.data || err };
    });
};

// accept invite
export const acceptInvite = async (data) => {
  return await request
    .post(`/user/accept-invite`, data)
    .then((res) => {
      $nuxt.$gtm.push({eventCategory: 'Account', eventLabel: 'Accept invite', eventAction: 'accept', invitedEmail: data.Email});
      return res.data;
    })
    .catch((err) => {
      return { err: err.response && err.response.data || err };
    });
};

// delete user
export const deleteUser = async (data) => {
  return await request
    .delete(`/user/${data.userId}`, data)
    .then((res) => {
      $nuxt.$gtm.push({eventCategory: 'Account', eventLabel: 'Delete user', eventAction: 'delete', deletedUserId: data.userId});
      return res.data;
    })
    .catch((err) => {
      return { err: err.response && err.response.data || err };
    });
};

// update a user's status
export const updateUserStatus = async (data) => {
  return await request
    .put(`/user/status`, data)
    .then((res) => {
      $nuxt.$gtm.push({eventCategory: 'Account', eventLabel: 'Update user status', eventAction: 'update', updatedUserId: data.Id});
      return res.data;
    })
    .catch((err) => {
      return { err: err.response && err.response.data || err };
    });
};

// update a user's role
export const updateUserRole = async (data) => {
  return await request
    .put(`/user/role`, data)
    .then((res) => {
      $nuxt.$gtm.push({eventCategory: 'Account', eventLabel: 'Update user role', eventAction: 'update', updatedUserId: data.Id, newRole: data.Role});
      return res.data;
    })
    .catch((err) => {
      return { err: err.response && err.response.data || err };
    });
};

// upload user avatar from local file
export const uploadAvatar = async (data) => {
  const requestOptions = {
    method: 'POST'
  }
  const formData = new FormData()
  formData.append('file', data.file)
  formData.append('width', data.coordinates.width)
  formData.append('height', data.coordinates.height)
  formData.append('left', data.coordinates.left)
  formData.append('top', data.coordinates.top)
  requestOptions.body = formData
  return fetch(`${process.env.BackEnd_API_URL}/user/avatar/upload`, requestOptions).then(handleResponse)
};

// upload user avatar
export const cropUploadAvatar = async (data) => {
  return await request
    .post(`/user/avatar/crop-upload`, data)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return { err: err.response && err.response.data || err };
    });
};

// --------- old ----------------
// user logout
export const logout = async () => {
  $nuxt.$gtm.push({eventCategory: 'Account', eventLabel: 'logout', eventAction: 'logout'});
  return await request.get(`/user/logout`).then((e) => {
    // delete the token cookie
    // delete store auth
    // return status
  });
};

// create organization
export const createOrganization = async (data) => {
  $nuxt.$gtm.push({...data, eventCategory: 'Account', eventLabel: 'Create organization', eventAction: 'create'});
  return request.post(`/user/createOrganization`, data);
};

// invite Teammates
export const inviteTeammates = async (data) => {
  $nuxt.$gtm.push({...data, eventCategory: 'Account', eventLabel: 'Invite teammates', eventAction: 'invite'});
  return request.post(`/user/inviteTeammates`, data);
};

export const validateRequest = async (data) => {
  const { contact, tokenType } = data;
  return request.get(`/user/validate/${contact}/${tokenType}`);
};

export const checkValidity = async (token) => {
  return request.get(`/user/checkValidity/${token}`);
};
