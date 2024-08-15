// check payment
export function checkPayment(account) {
    let paymentMethodExpire = false;
    let licenseExpire = false;

    if (account.businessStatus !== "FREETRIAL") {
        account.paymentMethodExpirationDays / 30 < 6 && (paymentMethodExpire = account.paymentMethodExpirationDays);
        !account.AutoRenewal && account.licenseExpirationDays < 30 && (licenseExpire = account.licenseExpirationDays);
    }

    return {
        paymentMethodExpire,
        licenseExpire,
    };
}

// Capitalize string
export function capitalize(label) {
    return (label || "")
        .replace(/\//g, "")
        .replace(/-/g, " ")
        .replace(/\s+/g, " ")
        .split(" ")
        .map((word) => {
            return word.length > 2 ? word.charAt(0).toUpperCase() + word.slice(1) : word;
        })
        .join(" ");
}

// URL to file
export async function urlToFile(url, fileName) {
    return await fetch(url)
        .then((res) => res.blob())
        .then((blob) => new File([blob], fileName || Date.now(), { type: blob.type }));
}

// file to formData
export function fileToFormData(file) {
    const formData = new FormData();
    formData.append("file", file);
    return formData;
}

// sanitize url string
export function sanitizeUrlString(term) {
    return !term
        ? ""
        : decodeURIComponent(
              term
                  .replace(/[`~!@#$%^&*()|+\=?;:",.<>\{\}\[\]\\\/]/g, " ")
                  .replace(/\s+/g, " ")
                  .trim()
          );
}

export function extensionToIconName(extension) {
    if (extension == "pdf") return "pdf";
    if (extension == "doc") return "word";
    if (extension == "xls") return "excel";
    return "awesome-file";
}

export function getBrowser(userAgent) {
    if (!userAgent) return null;

    if (/trident/i.test(userAgent)) return "msie";
    if (/ope?ra?/i.test(userAgent)) return "opera";
    if (/edge?/i.test(userAgent)) return "edge";
    if (/chrome/i.test(userAgent)) return "chrome";
    if (/firefox/i.test(userAgent)) return "firefox";
    if (/safari/i.test(userAgent)) return "safari";

    return null;
}

/**
 * Position the contextual menu upon click click coordinates
 * on the trigger DOM element
 */
export function contextMenuPositioning(domContextMenu) {
    const clickCoords = $nuxt.$store.state.context.clickCoords;
    const selector = domContextMenu.getBoundingClientRect();
    const margin = 16; // move the context menu away from the cursor to make it fully readable
    const top = clickCoords.y + selector.height < window.innerHeight + window.scrollY ? clickCoords.y - margin : clickCoords.y - selector.height - margin;
    const left = clickCoords.x + selector.width < window.innerWidth ? clickCoords.x + margin : clickCoords.x - selector.width - margin;

    return {
        top: top + "px",
        left: left + "px",
    };
}
