import axios from "axios";
import { requestReferral } from "~/assets/utils/axios";

// get referral data
export const referralDetails = async () => {
  return await requestReferral
    .get(`/v1/referrals`)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return { err: err.response && err.response.data || err };
    });
};



// get referral data
export const transactionsData = async () => {
  return await requestReferral
    .get(`/v1/transactions`)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return { err: err.response && err.response.data || err };
    });
};


// update referral data
export const updateTransactionData = async (id, data) => {
  return await requestReferral
    .patch(`/v1/transactions/${id}`, data)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return { err: err.response && err.response.data || err };
    });
};

// get referral data
export const inviteByEmailAddress = async (data) => {
  return await requestReferral
    .post(`/v1/referrals/send-mail`, data)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return { err: err.response && err.response.data || err };
    });
};


// verify referral 
export const verifyReferral = async (data) => {

  const request = axios.create({
    baseURL: process.env.REFERRAL_ENDPOINT,
    headers: {
      Authorization: `Bearer ${data?.token}`,
      client_time: new Date().toISOString(),
    }
  });

  delete data.token;

  return await request
    .post(`/v1/referrals/verify`, data)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      // return { err: err.response && err.response.data || err };
      console.log("errerrerr", err);
    });
};



// new referral 
export const newReferral = async (data) => {
  const request = axios.create({ baseURL: process.env.REFERRAL_ENDPOINT, });
  return await request
    .post(`/v1/referrals/new-referral`, data)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      console.log("errerrerr", err);
    });
};




// get referrals
export const getAllReferrals = async (data = {}) => {
  var url = `/v1/referrals/get-all?`
  if (data?.limit) url = url + `limit=${data?.limit}&page=${data?.page || 1}&`
  if (data?.type) url = url + `type=${data?.type}&`
  return await requestReferral
    .get(url)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return { err: err.response && err.response.data || err };
    });
};



// get users transactions
export const getUsersTransactions = async (data = {}) => {
  var url = `/v1/transactions/get-all?`
  if (data?.UserId) url = url + `UserId=${data?.UserId}&`
  if (data?.limit) url = url + `limit=${data?.limit}&page=${data?.page || 1}&`
  return await requestReferral
    .get(url)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return { err: err.response && err.response.data || err };
    });
};


// get program settings
export const getProgramSettings = async (data = {}) => {
  return await requestReferral
    .get(`/v1/settings`)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return { err: err.response && err.response.data || err };
    });
};


// get program settings
export const updateProgramSettings = async (data = {}) => {
  return await requestReferral
    .patch(`/v1/settings/${data?.id}`, data)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return { err: err.response && err.response.data || err };
    });
};
