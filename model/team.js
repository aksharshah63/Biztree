import { request,requestCoreApi,requestGeneric} from "~/assets/utils/axios";
import { getAllCookies } from "~/assets/utils/cookies";
import axios from "axios";

// Add Team
export const addTeam = async (data) => {
    return await requestGeneric
      .post(`/team`, data)
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        return { err: err.response && err.response.data || err };
      });
  };

// assign the team to the department
export const addTeamtoDepartment= async (data) => {
    return await requestGeneric
        .put(`/team/${data.hashId}/attachDepartment/${data.DeptId}`,{ BusinessId: data.BusinessId })
        .then((res) => {
        return res.data;
        })
        .catch((err) => {
        return { err: err.response && err.response.data || err };
        });
  };

//list of users
export const getUsers= async (data) => {
    return await requestGeneric
      .get(`/business/${data.hashId}/users`)
      .then((res) => {
      return res.data;
      })
      .catch((err) => {
      return { err: err.response && err.response.data || err };
      });
  };

// assign the user to the department
export const addUsertoDepartment= async (data) => {
  return await requestGeneric
      .post(`/department/${data.hashId}/addUser`,{ UserId: data.UserId, BusinessId: data.BusinessId })
      .then((res) => {
      return res.data;
      })
      .catch((err) => {
      return { err: err.response && err.response.data || err };
      });
};

//add user to team 
export const addUsertoTeam= async (data) => {
  return await requestGeneric
      .post(`/team/${data.hashId}/addUser`,{ UserId: data.UserId, BusinessId: data.BusinessId })
      .then((res) => {
      return res.data;
      })
      .catch((err) => {
      return { err: err.response && err.response.data || err };
      });
};

//get teams
export const getTeam = async (data) => {
  return await requestGeneric
    .get(`/business/${data.hashId}/teams`)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return { err: err.response && err.response.data || err };
    });
};

//update teams
export const updateTeam = async (data) => {
  return await requestGeneric
    .put(`/team`,data)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return { err: err.response && err.response.data || err };
    });
};

//get teams
export const getTeams = async (data) => {
  return await requestGeneric
    .get(`/business/${data.hashId}/teams`)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return { err: err.response && err.response.data || err };
    });
};

// get a users from team
export const getTeamUser = async (data) => {
  return await requestGeneric
    .get(`/team/${data?.hashId}/users`)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return { err: err.response && err.response.data || err };
    });
};

// Remove team
export const removeTeam = async (data) => {
  return await requestGeneric
    .delete(`/team/${data?.hashId}`)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return { err: err.response && err.response.data || err };
    });
};

// Remove team from department
export const removeTeamFromDepartmet = async (data) => {
  return await requestGeneric
    .delete(`/team/${data.hashId}/detachDepartment/${data.deptId}`)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return { err: err.response && err.response.data || err };
    });
};

//remove user to team 
export const removeUser = async (data) => {
  return await requestGeneric
    .delete(`/team/${data?.hashId}/removeUser`, {
      data: { UserId: data.userId }
    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return { err: (err.response && err.response.data) || err };
    });
};

export const uploadAvatarTeam = async (data1) => {
    let data = new FormData();
    data.append('file', data1.file);
    data.append('width', data1.coordinates.width);
    data.append('height', data1.coordinates.height);
    data.append('left', data1.coordinates.left);
    data.append('top', data1.coordinates.top);
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${process.env.ACCOUNT_API_ENDPOINT}/team/avatar/upload`,
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

  export const cropUploadAvatarTeam = async (data) => {
    return await requestGeneric
    .post(`/team/avatar/crop-upload`, data)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return { err: err.response && err.response.data || err };
    });
  };

// return the list of teams which user belongs to
export const getTeamuserbelong = async (data) => {
  return await requestGeneric
    .get(`/user/${data.hashId}/teams`)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return { err: err.response && err.response.data || err };
    });
};

// return the list of users which user not belongs to dept
export const getUserNotbelongTeam = async (data) => {
  return await requestGeneric
    .post(`/team/${data.hashId}/unassignUsers`,{ BusinessId: data.BusinessId })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return { err: err.response && err.response.data || err };
    });
};

//assign manager role in team
export const assignManagerRole = async (data) => {
  return await requestGeneric
    .put(`/team/role`,data)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return { err: err.response && err.response.data || err };
    });
};

//unassign manager in the team
export const unassignManager = async (data) => {
  return await requestGeneric
    .delete(`/team/role`,{data: { UserId: data.UserId, TeamId: data.TeamId}    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return { err: err.response && err.response.data || err };
    });
};

export const getUserAccess = async (data) =>{
  return await requestGeneric
    .get(`/team/${data.TeamId}/usersRole?BusinessId=${data.BusinessId}&UserId=${data.UserId}`)
    .then((res)=>{
      return res.data;
    })
    .catch((err)=>{
      return { err: err.response && err.response.data || err };
    });
}