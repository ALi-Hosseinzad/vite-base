export const createSearchObject = (searchParams, { sortBy, operation }) => {
  const criteria = [];
  for (const [key, value] of searchParams.entries()) {
    if (
      key !== "pageNumber" &&
      key !== "recordsPerPage" &&
      key !== "isEnabled" &&
      key !== "isActive" &&
      key !== "fullname" &&
      key !== "fullName" &&
      key !== "cardReceived" &&
      key !== "verifyOfflineAuth" &&
      key !== "rfBranch.branchName" &&
      key !== "bin" &&
      key !== "expression" &&
      key !== "description" &&
      key !== "steps" &&
      key !== "bankName" &&
      key !== "menuCaption" &&
      key !== "menuKey" &&
      key !== "isVisible" &&
      key !== "isFinancial" &&
      key !== "facilityDescription" &&
      key !== "isServiceActive" &&
      key !== "reasonDescription" &&
      key !== "itemName" &&
      key !== "isLocked" &&
      key !== "event"
    ) {
      criteria.push({
        key: key,
        value: value,
        operation: operation || "equals",
      });
    } else if (key === "isEnabled" || key === "isVisible" || key === "isFinancial" || key === "isLocked" || key === "isActive") {
      criteria.push({
        key: key,
        value: value === "true" ? true : false,
        operation: "equals",
      });
    } else if (key === "cardReceived" || key === "verifyOfflineAuth") {
      criteria.push({
        key: key,
        value: value === "true" ? true : value === "false" ? false : null,
        operation: value === "null" ? "isNull" : "equals",
      });
    } else if (
      key === "fullname" ||
      key === "fullName" ||
      key === "rfBranch.branchName" ||
      key === "bin" ||
      key === "expression" ||
      key === "description" ||
      key === "steps" ||
      key === "bankName" ||
      key === "menuCaption" ||
      key === "facilityDescription" ||
      key === "reasonDescription" ||
      key === "itemName" ||
      key === "event"
    ) {
      criteria.push({
        key: key,
        value: value,
        operation: "contains",
      });
    } else if (key === "menuKey") {
      criteria.push({
        key: key,
        value: value,
        operation: "startsWith",
      });
    } else if (key === "isServiceActive") {
      if (value === "false") {
        criteria.push(
          {
            key: "isForPwa",
            value: false,
            operation: "equals",
          },
          {
            key: "isForWeb",
            value: false,
            operation: "equals",
          },
          {
            key: "isForMobile",
            value: false,
            operation: "equals",
          }
        );
      } else if (value === "true") {
        criteria.push({
          operation: "or",
          criteria: [
            {
              key: "isForPwa",
              value: true,
              operation: "equals",
            },
            {
              key: "isForWeb",
              value: true,
              operation: "equals",
            },
            {
              key: "isForMobile",
              value: true,
              operation: "equals",
            },
          ],
        });
      }
    }
  }

  return {
    offset: `${(searchParams.get("pageNumber") - 1) * searchParams.get("recordsPerPage")}`,
    count: `${searchParams.get("recordsPerPage")}`,
    [sortBy && "sort_by"]: sortBy,
    criteria: {
      operation: "and",
      criteria: criteria,
    },
  };
};
