import FormatDate from "./FormatDate";
import FormatMobile from "./FormatMobile";
import FormatMoney from "./FormatMoney";

function FormatValue(employee, field) {
  const value = employee?.[field.key];

  if (field.type === "date") return FormatDate(value);
  if (field.type === "money") return FormatMoney(value);
  if (field.type === "mobile") return FormatMobile(value);

  return value || "N/A";
}

export default FormatValue;
