function FormatMobile(value) {
  if (!value) return "N/A";

  const phone = String(value).trim();
  if (!phone) return "N/A";

  return phone.startsWith("+63") ? phone : `+63 ${phone}`;
}

export default FormatMobile;
