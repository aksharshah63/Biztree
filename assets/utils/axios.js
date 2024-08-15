import axios from "axios";
import { getAllCookies } from "~/assets/utils/cookies";

const request = axios.create({
  baseURL: process.env.BackEnd_API_URL,
  headers: {
    Authorization: `Bearer ${getAllCookies()[process.env.SSO_COOKIE_NAME]}`,
    client_time: new Date().toISOString(),
  }
});


const requestReferral = axios.create({
  baseURL: process.env.REFERRAL_ENDPOINT,
  headers: {
    Authorization: `Bearer ${getAllCookies()[process.env.SSO_COOKIE_NAME]}`,
    client_time: new Date().toISOString(),
  }
});

const requestGeneric = axios.create({
  baseURL: process.env.ACCOUNT_API_ENDPOINT,
  headers: {
    Authorization: `Bearer ${getAllCookies()[process.env.SSO_COOKIE_NAME]}`,
    client_time: new Date().toISOString(),
  }
});


const requestCoreApi = axios.create({
  baseURL: process.env.DEV_CORE_ENDPOINT,
  headers: {
    Authorization: `Bearer ${getAllCookies()[process.env.SSO_COOKIE_NAME]}`,
    client_time: new Date().toISOString(),
  }
});

const requestPaypal = axios.create({
  baseURL: process.env.PAYPAL_API_ENDPOINT,
  headers: {}
});

const handleResponse = (response) => {
  return response.text().then(text => {
    const data = text && JSON.parse(text)
    if (!response.ok) {
      if (response.status === 401) {
        // auto logout if 401 response returned from api
        // logout()
        location.reload(true)
      }
      const error = (data && data.message) || response.statusText
      return Promise.reject(error)
    }
    return data
  })
}

export { request, requestReferral, requestGeneric, requestPaypal, requestCoreApi, handleResponse };
