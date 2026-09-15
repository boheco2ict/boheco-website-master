function FormatMoney(value) {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return "N/A";

  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(amount);
}

export default FormatMoney;
