import VueCookies from 'vue-cookies'
// Get cookie by name
export const getCookie = function (name) {
  var match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match && decodeURI(match[2]);
};

// Get All Cookies
export const getAllCookies = function () {
  return document.cookie.split(";").reduce(
    (ac, str) =>
      Object.assign(ac, {
        [decodeURI(str.split("=")[0].trim())]: decodeURI(str.split("=")[1]),
      }),
    {}
  );
};

// Set Cookies from object
export const setCookiesFromObj = function (obj) {
  document.cookie.split(";").forEach(function (c) {
    document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
  });
  Object.keys(obj).forEach((item) => {
    document.cookie = `${encodeURI(item)}=${encodeURI(obj[item])}; expires=Thu, 18 Dec 2030 12:00:00 UTC;`;
  });
};

export function setTrackingSource(query = {}) {

  /**
   * Examples to test against
   *  http://localhost:8080/human-resources/?SourceAccount=us&SourceAdGroup=equipment-purchase-contract&SourceKeyword=equipment-purchase-contract&SourceQParam=equipment-purchase-contract&SourceEntryPoint=%2Fsearch%2F%3Ft%3Dequipment-purchase-contract&SourceGuid=1765454743.1572343896&SourceABTest=WEBAPP-034&SourceDesktopApp=BIB8-001
   *  http://localhost:8080/account/create/?CreationPage=%2F1234%2F&entryPoint=%2Fsearch%2F%3Ft%3Ddeed
   *  http://localhost:8080/?q=cancel-agreement&a=cancel-lease&s=google&c=world2
   *  http://localhost:8080/?SourceDesktopApp=BIB8-WIN
   *  http://localhost:8080/?q=equipment-purchase-contract&a=equipment-purchase-contract&s=google&c=us
   *  http://localhost:8080/?q=equipment-purchase-contract&ppc=1
   */

  /**
   * SourceAccount  	- whatever value comes from Gogole Ads
   * SourceAdGroup  	- whatever value comes from Gogole Ads
   * SourceKeyword  	- the value of the "q" param sent from Google Ads to the PPC LP
   * SourceQParam  	- the value of the "q" param sent from Google Ads to the PPC LP
   * SourceEntryPoint	- the place where we want people to land after they create the account
   * SourceGuid  		- the Google User ID grabbed from the PPC LP to be sent to the app, so Google will know it is the same person
   * SourceABTest  	- a potential tracking variable form a LP test
   * SourceDesktopApp	- the "source" sent by the Electron App
   */



  const oldGlobal = JSON.parse(sessionStorage.getItem('trafficSource')) || {} // init

  /* 
  * Custom tracking values
  * To avoid poluting the object with meaningless JSON strings
  * filter the "CustomTracking" key content to provide only useful data
  */
  const oldCustomTracking = oldGlobal.CustomTracking || {} // init
  let newCustomTracking = { ...oldCustomTracking } // init
  if (query.CustomTracking) {
    const ct = {}
    query.CustomTracking.split("|").forEach(pair => {
      const values = pair.split(":")
      ct[values[0]] = values[1]
    })
    newCustomTracking = { ...newCustomTracking, ...ct }
  }
  /* SourceDesktopApp */
  const SourceDesktopApp = query.SourceDesktopApp || oldCustomTracking.SourceDesktopApp || null // determine value
  if (SourceDesktopApp != null) newCustomTracking = { ...newCustomTracking, SourceDesktopApp } // add to sub-object only if relevant

  /* SourceABTest */
  const SourceABTest = query.SourceABTest || oldCustomTracking.SourceABTest || null // determine value
  if (SourceABTest != null) newCustomTracking = { ...newCustomTracking, SourceABTest } // add to sub-object only if relevant



  /*
  * Source traffic values
  */
  const qParam = (query.q || query.SourceQParam || oldGlobal.SourceQParam || "").toLowerCase().split(/[ -]/g);
  const url = new URL(window.location.href);
  let newGlobal = {
    SourceChannel: query.utm_source || query.SourceChannel || oldGlobal.SourceChannel || null,
    SourceCampaign: query.utm_campaign || query.SourceCampaign || oldGlobal.SourceCampaign || null,
    SourceAccount: query.c || query.SourceAccount || oldGlobal.SourceAccount || null,
    SourceAdGroup: query.a || query.ppc || query.SourceAdGroup || oldGlobal.SourceAdGroup || null,
    SourceKeyword: query.q || query.SourceKeyword || oldGlobal.SourceKeyword || null,
    SourceQParam: qParam.join('-') || null,
    DocName: qParam.map(e => e && e[0]?.toUpperCase() + e.substring(1)).join(' ') || null,
    CreationPage: query.CreationPage || oldGlobal.CreationPage || `${url.origin}${url.pathname}`,
    CustomTracking: Object.keys(newCustomTracking)?.length ? newCustomTracking : null,
  }


  /* Write new values */
  sessionStorage.setItem('trafficSource', JSON.stringify(newGlobal))
}



export function getTrackingSource() {
  const setSources = JSON.parse(sessionStorage.getItem('trafficSource'));
  setSources?.CustomTracking && (setSources.CustomTracking = JSON.stringify(setSources.CustomTracking));

  return {
    ...setSources,
    SourceGuid: VueCookies.get('_ga'),
  }
}
