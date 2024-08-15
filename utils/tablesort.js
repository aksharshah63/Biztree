import { orderBy, get } from "lodash";
import { DateTime } from "luxon";
const typeMap = new Map([
  ["date", sortDateColumn],
  ["phone", sortPhoneColumn],
  ["string", sortStringColumn],
  ["number", sortNumberColumn],
  ["week", sortWeekDays]
]);
export function sortColumn({ items, field }) {
  if (field.header_icon.type && typeMap.has(field.header_icon.type)) {
    return typeMap.get(field.header_icon.type)({ items, field });
  }
  return orderBy(
    items,
    [(item) => get(item, field.header_icon.sortKey)],
    getSortOrder({ field })
  );
}
function updateSortIcon({ field }) {
  let icon =
    field.header_icon.isActive == false ? "long-arrow-up" : "long-arrow-down";
  field.header_icon.icon = icon;
}
function getSortOrder({ field }) {
  // updateSortIcon({ field });
  return field.header_icon.isActive ? "desc" : "acs";
}
function sortDateColumn({ items, field }) {
  return orderBy(
    items,
    [
      (item) => {
        const dateField = get(item, field.header_icon.sortKey);
        const dateTime = DateTime.fromISO(dateField);
        if (dateTime.isValid) {
          return dateTime.toJSDate();
        }
        if (field.header_icon.isActive) return -Infinity;
        return Infinity;
      },
    ],
    getSortOrder({ field })
  );
}
function sortWeekDays({ items, field }) {
  return orderBy(
    items,
    [
      (item) => {
        const weekData = get(item, field.header_icon.sortKey);
        if (field.header_icon.isActive) {
          if (!weekData) return -Infinity;
        }
        return weekData;
      },
    ],
    getSortOrder({ field })
  );
}
function sortPhoneColumn({ items, field }) {
  return orderBy(
    items,
    [
      (item) => {
        const phone = get(item, field.header_icon.sortKey);
        return parseInt(phone ? phone.replace(/\D/g, "") : "", 10);
      },
    ],
    getSortOrder({ field })
  );
}
function sortStringColumn({ items, field }) {
  return orderBy(
    items,
    [(item) => get(item, field.header_icon.sortKey)?.toLowerCase() ?? ""],
    getSortOrder({ field })
  );
}
function sortNumberColumn({ items, field }) {
  return orderBy(
    items,
    [(item) => get(item, field.header_icon.sortKey) ?? ""],
    getSortOrder({ field })
  );
}