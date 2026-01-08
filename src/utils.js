function extractBillDetails(message) {
  if (message.includes("You don't have a bill")) {
    const firstLine = message.split("\n")[0];
    return {
      error: new Error(firstLine),
      data: null,
    };
  }

  // Regular expressions
  const amountMatch = message.match(/₱(\d{1,3}(?:,\d{3})*\.\d{2})/);
  const dueDateMatch = message.match(/due on ([A-Za-z]+\s\d{1,2},\s\d{4})/);
  const kwhMatch = message.match(/KWH Used:\s*(\d+)/i);
  const statusMatch = message.match(/Bill Status:\s*(\w+)/i);

  // Extracted values
  const amount = amountMatch ? amountMatch[1] : null;
  const dueDate = dueDateMatch ? dueDateMatch[1] : null;
  const kWhUsed = kwhMatch ? parseInt(kwhMatch[1], 10) : null;
  const billStatus = statusMatch ? statusMatch[1] : null;

  return {
    error: null,
    data: {
      amount,
      dueDate,
      kWhUsed,
      billStatus,
    },
  };
}

export { extractBillDetails };
