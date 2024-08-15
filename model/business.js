import { request, requestGeneric } from "~/assets/utils/axios";

// get a business
export const getBusiness = async (data) => {
  return await request
    .get(`/business/${data.businessId}`)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return { err: err.response && err.response.data || err };
    });
};

// update a business
export const updateBusiness = async (data) => {
  return await request
    .put(`/business`, data)
    .then((res) => {
      $nuxt.$gtm.push({eventCategory: 'Business', eventLabel: 'Update business', eventAction: 'update'});
      return res.data;
    })
    .catch((err) => {
      return { err: err.response && err.response.data || err };
    });
};

// get members of a business
export const getMembers = async (data) => {
  const businessId = data.businessId
  const Role = data.role
  const Status = data.status
  let url = `/business/${businessId}/users`
  if (Role && !Status) {
    url = `${url}?Role=${Role}`
  }
  if (!Role && Status) {
    url = `${url}?Status=${Status}`
  }
  if (Role && Status) {
    url = `${url}?Status=${Status}&Role=${Role}`
  }
  return await request
    .get(url)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return { err: err.response && err.response.data || err };
    });
};

// update a business's status
export const updateBusinessStatus = async (businessId, data) => {
  return await requestGeneric
    .put(`/business/${businessId}/status`, data)
    .then((res) => {
      $nuxt.$gtm.push({eventCategory: 'Business', eventLabel: 'Update business status', eventAction: data.status});
      return res.data;
    })
    .catch((err) => {
      return { err: err.response && err.response.data || err };
    });
};

// get all the transactions of the specific emails
export const getTransactions = async (data) => {
  const Emails = data.Emails
  let url = `/business/transactions/by-email?Emails=${Emails}`
  return await request
    .get(url)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return { err: err.response && err.response.data || err };
    });
};

// get the payment information of a business
export const getPaymentInfo = async (data) => {
  const businessId = data.businessId
  let url = `/business/${businessId}/paymentInfo`
  return await request
    .get(url)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return { err: err.response && err.response.data || err };
    });
};

// get business licenses
export const getBusinessLicenses = async (url) => {
  return await request
    .get(url)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return { err: err.response && err.response.data || err };
    });
};

// get the subscription information of a business
export const getSubscriptionInfo = async (data) => {
  const businessId = data.businessId
  let url = `/business/${businessId}/subscription/info`
  return await request
    .get(url)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return { err: err.response && err.response.data || err };
    });
};

// update card information
export const updateCard = async (data) => {
  return await request
    .put(`/business/paymentInfo?verify=true`, data)
    .then((res) => {
      $nuxt.$gtm.push({eventCategory: 'Business', eventLabel: 'Update payment info', eventAction: res.data.result});
      return res.data;
    })
    .catch((err) => {
      return { err: err.response && err.response.data || err };
    });
};

// Change AutoRenewal of an account
export const changeAutoRenewal = async (data) => {
  return await request
    .put(`/business/autoRenewal`, data)
    .then((res) => {
      $nuxt.$gtm.push({eventCategory: 'Business', eventLabel: 'Change auto renewal', eventAction: data.AutoRenewal});
      return res.data;
    })
    .catch((err) => {
      return { err: err.response && err.response.data || err };
    });
};

// Update business external store
export const updateBusinessStore = async (businessId, data) => {
  return await requestGeneric
    .put(`/business/${businessId}/store`, data)
    .then((res) => {
      $nuxt.$gtm.push({eventCategory: 'Business', eventLabel: 'Update business', eventAction: 'update'});
      return res.data;
    })
    .catch((err) => {
      return { err: err.response && err.response.data || err };
    });
};

// Remove business external store
export const removeBusinessStore = async (businessId) => {
  return await requestGeneric
    .delete(`/business/${businessId}/store`)
    .then((res) => {
      $nuxt.$gtm.push({eventCategory: 'Business', eventLabel: 'Delete business', eventAction: 'delete'});
      return res.data;
    })
    .catch((err) => {
      return { err: err.response && err.response.data || err };
    });
};