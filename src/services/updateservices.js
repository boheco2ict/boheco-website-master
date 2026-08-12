import { supabase } from "../supabase";


export const approveApplication = async (application) => {
  console.log("approve application:", application);

  // -----------------------------------------
  // Validate application
  // -----------------------------------------
  if (!application?.id) {
    throw new Error(
      "Unable to approve application: No application ID was provided."
    );
  }

  if (!application?.employee_id) {
    throw new Error(
      "Unable to approve application: No employee ID was provided."
    );
  }

  if (!application?.leave_type) {
    throw new Error(
      "Unable to approve application: No leave type was provided."
    );
  }

  try {
    // -----------------------------------------
    // 1. Get employee leave balances
    // -----------------------------------------
    const balances =
      application.employee?.employee_leave_balances;

    if (!Array.isArray(balances)) {
      throw new Error(
        "Employee leave balances were not found."
      );
    }

    // -----------------------------------------
    // 2. Find matching leave type
    // -----------------------------------------
    const balanceRow = balances.find(
      (balance) =>
        String(balance.leave_type)
          .trim()
          .toLowerCase() ===
        String(application.leave_type)
          .trim()
          .toLowerCase()
    );

    if (!balanceRow) {
      throw new Error(
        `No matching leave balance found for leave type: ${application.leave_type}`
      );
    }

    console.log(
      "✅ Matching balance row:",
      balanceRow
    );

    // -----------------------------------------
    // 3. Calculate new balance
    // -----------------------------------------
    const currentBalance = Number(
      balanceRow.leave_balance || 0
    );

    const requestedDays = Number(
      application.days_requested || 0
    );

    console.log({
      currentBalance,
      requestedDays,
    });

    if (requestedDays <= 0) {
      throw new Error(
        "The requested leave days must be greater than zero."
      );
    }

    if (requestedDays > currentBalance) {
      throw new Error(
        `Insufficient leave balance. Available: ${currentBalance} days. Requested: ${requestedDays} days.`
      );
    }

    const newBalance =
      currentBalance - requestedDays;

    console.log(
      `Leave balance: ${currentBalance} → ${newBalance}`
    );
    // -----------------------------------------
    // 4. Update leave balance
    // -----------------------------------------
    const {
      data: updatedBalance,
      error: updateBalanceError,
    } = await supabase
      .from("employee_leave_balances")
      .update({
        leave_balance: newBalance,
        updated_at: new Date().toISOString(),
      })
      .eq("employee_id", application.employee_id)
      .eq("leave_type", application.leave_type)
      .select("*")
      .single();

    if (updateBalanceError) {
      console.error(
        "❌ Failed to update leave balance:",
        updateBalanceError
      );

      throw new Error(
        updateBalanceError.message ||
          "Failed to update employee leave balance."
      );
    }

    if (!updatedBalance) {
      throw new Error(
        "Leave balance was not updated."
      );
    }

    

    // -----------------------------------------
    // 5. Approve leave application
    // -----------------------------------------
    const {
      data: updatedApplication,
      error: applicationError,
    } = await supabase
      .from("leave_applications")
      .update({
        status: "approved",
        approved_at: new Date().toISOString(),
      })
      .eq("id", application.id)
      .select("*")
      .single();

    if (applicationError) {
      console.error(
        "❌ Failed to approve leave application:",
        applicationError
      );

      throw new Error(
        applicationError.message ||
          "Failed to approve leave application."
      );
    }

    if (!updatedApplication) {
      throw new Error(
        "Leave application was not updated."
      );
    }



    // -----------------------------------------
    // 6. Return updated records
    // -----------------------------------------
    return {
        application: updatedApplication,
        balance: updatedBalance,
    };
  } catch (error) {
    console.error(
      "❌ Approval failed:",
      error
    );

    throw new Error(
      error?.message ||
        "An unexpected error occurred while approving the leave application."
    );
  }
};

export const rejectApplication = async (application_id, reason) => {

  // Validate application ID
  if (!application_id) {
    throw new Error(
      "Unable to reject application: No application ID was provided."
    );
  }

  // Validate rejection reason
  if (!reason || !reason.trim()) {
    throw new Error(
      "Please provide a reason for rejecting this leave application."
    );
  }

  try {
    const { data, error } = await supabase
      .from("leave_applications")
      .update({
        status: "rejected",
        rejection_reason: reason.trim(),
        rejected_at: new Date().toISOString(),
      })
      .eq("id", application_id)
      .select()
      .single();

    // Supabase error
    if (error) {
      console.error(
        "❌ Supabase reject application error:",
        error
      );

      throw new Error(
        error.message ||
          "Failed to reject the leave application."
      );
    }

    // No record was updated
    if (!data) {
      console.error(
        "❌ No leave application was updated."
      );

      throw new Error(
        "The leave application could not be found or was not updated."
      );
    }


    return data;

  } catch (error) {
    console.error(
      "❌ Failed to reject leave application:",
      error
    );

    // Preserve our custom errors
    throw new Error(
      error?.message ||
        "An unexpected error occurred while rejecting the leave application."
    );
  }
};

export const markAsReadMemo = async (memoData) => {
  if (!memoData) {
    throw new Error(
      "Unable to mark as read: No data was provided."
    );
  }
  try {
    const { data, error } = await supabase
      .from("memo")
      .update({
        is_read: "TRUE",
        read_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", memoData.id)
      .select()
      .single();

    // Supabase error
    if (error) {
      console.error(
        "Supabase mark as read error:",
        error
      );

      throw new Error(
        error.message ||
          "Failed to mark as read."
      );
    }

    // No record was updated
    if (!data) {
      console.error(
        "No record was updated."
      );

      throw new Error(
        "The record could not be found or was not updated."
      );
    }


    return data;

  } catch (error) {
    console.error(
      "❌ Failed to update mark as read:",
      error
    );

    // Preserve our custom errors
    throw new Error(
      error?.message ||
        "An unexpected error occurred while marking as read."
    );
  }
}