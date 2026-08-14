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