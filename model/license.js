import { request, requestGeneric } from "~/assets/utils/axios";

// get licenses of a business
export const getBusinessLicenses = async (data) => {
  return await requestGeneric
    .put(`/business/${data.BusinessId}/licenses?${data.QueryParams}`)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return { err: err.response && err.response.data || err };
    });
};

// get detail information of a license key
export const getLicenseDetail = async (data) => {
    return await request
      .get(`/license/${data.LicenseKey}`)
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        return { err: err.response && err.response.data || err };
      });
};

// Renew a license belonging to the business
export const renewLicense = async (data) => {
    return await requestGeneric
      .put(`/business/${data.BusinessId}/renew`, { key: data.LicenseKey })
      .then((res) => {
        $nuxt.$gtm.push({eventCategory: 'Business', eventLabel: 'Renew license', eventAction: 'renew'});
        return res.data;
      })
      .catch((err) => {
        return { err: err.response && err.response.data || err };
      });
};