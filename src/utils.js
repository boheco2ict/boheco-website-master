function extractBillDetails(dataArray) {
  if (!Array.isArray(dataArray) || dataArray.length < 8) {
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
  ] = dataArray;

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
