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
