import { supabase } from "../supabase";

export const createMemo = async (
  memoName,
  memoDescription,
  memoUrl,
  individualTarget,
  batchEmployeeIds,
  recipientType,
  memoCreatorID
) => {
  const memoNameTrim = memoName.trim();
  const memoURLTrim = memoUrl.trim();

  let memoRows = [];

  // ==============================
  // INDIVIDUAL
  // ==============================
  if (recipientType === "individual") {
    if (!individualTarget?.trim()) {
      throw new Error("Please select an employee.");
    }

    memoRows = [
      {
        title: memoNameTrim,
        url: memoURLTrim,
        employee_id: individualTarget,
        posted_by: memoCreatorID,
        description: memoDescription,
        is_read: false,
      },
    ];
  }

  // ==============================
  // BATCH
  // ==============================
  if (recipientType === "batch") {
    if (!batchEmployeeIds?.length) {
      throw new Error(
        "No employees were selected for the batch."
      );
    }

    memoRows = batchEmployeeIds.map((employeeId) => ({
      title: memoNameTrim,
      url: memoURLTrim,
      employee_id: employeeId,
      posted_by: memoCreatorID,
      description: memoDescription,
      is_read: false,
    }));
  }

  // ==============================
  // VALIDATE
  // ==============================
  if (memoRows.length === 0) {
    throw new Error("No memo recipients found.");
  }

  // ==============================
  // INSERT
  // ==============================
  const { error } = await supabase
    .from("memo")
    .insert(memoRows);

  if (error) {
    console.error("❌ Create Memo Error:", error);
    throw error;
  }

  return true;
};