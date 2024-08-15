import { requestPaypal } from "~/assets/utils/axios";

// get all the transactions of the specific paypal subscription
export const getPaypalTransactions = async (data) => {
  const subscriptionId = data.subscriptionId
  let url = `/subscription/${subscriptionId}/transactions`
  return await requestPaypal
    .get(url)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return { err: err.response && err.response.data || err };
    });
};

// get the paypal payment information
export const getPaypalPaymentInfo = async (data) => {
  const subscriptionId = data.subscriptionId
  let url = `/subscription/${subscriptionId}/show`
  return await requestPaypal
    .get(url)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return { err: err.response && err.response.data || err };
    });
};

// get the paypal plan information
export const getPaypalPlanInfo = async (data) => {
  const planId = data.planId
  let url = `plan/${planId}/show`
  return await requestPaypal
    .get(url)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return { err: err.response && err.response.data || err };
    });
};

// get the paypal plan information
export const createPaypalSubscription = async (data) => {
  let url = `subscription/create`
  return await requestPaypal
    .post(url, data)
    .then((res) => {
      $nuxt.$gtm.push({eventCategory: 'Paypal', eventLabel: 'Create Paypal subscription', eventAction: 'create'});
      return res.data;
    })
    .catch((err) => {
      return { err: err.response && err.response.data || err };
    });
};

// get the paypal plan information
export const cancelPaypalSubscription = async (data) => {
  const subscriptionId = data.subscriptionId
  let url = `subscription/${subscriptionId}/cancel`
  return await requestPaypal
    .post(url, null)
    .then((res) => {
      $nuxt.$gtm.push({eventCategory: 'Paypal', eventLabel: 'Cancel Paypal subscription', eventAction: 'cancel'});
      return res.data;
    })
    .catch((err) => {
      return { err: err.response && err.response.data || err };
    });
};