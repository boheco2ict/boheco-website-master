function extractBillDetails(response) {
  // If backend return string message

  if (typeof response === "string") {
    if (response.includes("You don't have a bill")) {
      return {
        error: new Error(response),
        data: null,
      };
    }
  }

  // If backend returns an array
  if (!Array.isArray(response) || response.length < 8) {
    return {
      error: new Error("Invalid bill data format"),
      data: null,
    };
  }

  const [
    accountNumber,
    consumerName,
    referenceNumber,
    billingMonth,
    amount,
    dueDate,
    billStatus,
    kWhUsed,
  ] = response;

  return {
    error: null,
    data: {
      accountNumber: accountNumber?.trim() || null,
      consumerName: consumerName?.trim() || null,
      referenceNumber: referenceNumber?.trim() || null,
      billingMonth: billingMonth || null,
      amount: amount || null,
      dueDate: dueDate || null,
      billStatus: billStatus || null,
      kWhUsed:
        typeof kWhUsed === "number" ? kWhUsed : parseInt(kWhUsed, 10) || null,
    },
  };
}

export { extractBillDetails };

export const formatName_FN_MI_LN = (FN, MI, LN) => {
    const middleInitial = MI ? `${MI.charAt(0)}.` : "";
    return `${FN} ${middleInitial} ${LN}`.replace(/\s+/g, " ").trim();
};
export const formatName_FN_MN_LN = (FN, MN, LN) => {
    const middleName = MN ? MN : "";
    return `${FN} ${middleName} ${LN}`.replace(/\s+/g, " ").trim();
};
export const formatDate_Month_Day_Year = (date) => new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "2-digit",
    year: "numeric",
});

export const formatBillingMonth_Year = (date) => {
  if (!date) return "—";

  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
};