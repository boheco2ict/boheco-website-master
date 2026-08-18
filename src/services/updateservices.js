import { supabase } from "../supabase";

export const approveApplication = async (application, approverID) => {
  console.log(application, approverID);
  // -----------------------------------------
  // Validate application
  // -----------------------------------------
  if (!application) {
    throw new Error(
      "Unable to approve application: No application was provided."
    );
  }
  if (!approverID) {
    throw new Error(
      "Unable to approve application: No approver ID was provided."
    );
  }

  try {
    const approvers = application.approver_id_status;

    if (!Array.isArray(approvers) || approvers.length === 0) {
      throw new Error("No approvers were found.");
    }

    // -----------------------------------------
    // 1. Update current approver to approved
    // -----------------------------------------
    const updatedApprovers = approvers.map((approver) =>
      String(approver.id) === String(approverID)
        ? { ...approver, status: "approved" }
        : approver
    );

    // -----------------------------------------
    // 2. Check if anyone rejected
    // -----------------------------------------
    const hasRejected = updatedApprovers.some(
      (approver) =>
        approver.status?.trim().toLowerCase() === "rejected"
    );

    // -----------------------------------------
    // 3. Check if everyone approved
    // -----------------------------------------
    const allApproved = updatedApprovers.every(
      (approver) =>
        approver.status?.trim().toLowerCase() === "approved"
    );

    // -----------------------------------------
    // 4. Determine application status
    // -----------------------------------------
    let applicationStatus = "pending";
    if (hasRejected) {
      applicationStatus = "rejected";
    } else if (allApproved) {
      applicationStatus = "approved";
    }

    // -----------------------------------------
    // 5. Get employee leave balance
    // -----------------------------------------
    const leaveBalance = application.leaveBalance?.leave_balance;

    // -----------------------------------------
    // 6. Calculate new balance
    // -----------------------------------------
    const currentBalance = Number(leaveBalance || 0);
    const requestedDays = Number(application.days_requested || 0);
    
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
    const newBalance = currentBalance - requestedDays;


    if (applicationStatus === "pending") {
      // -----------------------------------------
      // Update approver status to approved
      // -----------------------------------------
      try {
        const { data: updateApproversStatus, error } = await supabase
          .from("leave_applications")
          .update({
            approver_id_status: updatedApprovers,
          })
          .eq("id", application.id)
          .select()
          .single();

        if (error) {
          console.error("Error updating approver status:", error);

          throw new Error(
            `Unable to update approver status: ${error.message}`
          );
        }

        if (!updateApproversStatus) {
          throw new Error(
            "Unable to update approver status: No application was found."
          );
        }

        return {
          success: true,
          message: "Application Approved Successfully.",
          response: updateApproversStatus,
        };
      } catch (error) {
        console.error("Failed to update approver status:", error);
        throw new Error(
          error instanceof Error
            ? error.message
            : "An unexpected error occurred while updating the approver status."
        );
      }
    }

    if (applicationStatus === "approved") {
      // -----------------------------------------
      // Update employee leave balance
      // -----------------------------------------
      if (!application.leaveBalance?.id) {
        throw new Error(
          "Unable to update leave balance: No leave balance ID was provided."
        );
      }
      const { data: updatedBalance, error: updateBalanceError } =
        await supabase
          .from("employee_leave_balances")
          .update({
            leave_balance: newBalance,
            updated_at: new Date().toISOString(),
          })
          .eq("id", application.leaveBalance.id)
          .select("*")
          .single();

      if (updateBalanceError) {
        console.error(
          "Failed to update employee leave balance:",
          updateBalanceError
        );

        throw new Error(
          `Failed to update employee leave balance: ${
            updateBalanceError.message ||
            "Unknown database error."
          }`
        );
      }

      if (!updatedBalance) {
        throw new Error(
          "Leave balance update failed: No updated balance was returned."
        );
      }
      // -----------------------------------------
      // Update approver status to approved and status to approved
      // -----------------------------------------
      if (!application?.id) {
        throw new Error(
          "Unable to update approver status: No ID was provided."
        );
      }
      const { data: updateApproversStatus, error } = await supabase
        .from("leave_applications")
        .update({
          approver_id_status: updatedApprovers,
          status: "approved",
          approved_at: new Date().toISOString()
        })
        .eq("id", application.id)
        .select()
        .single();

      if (error) {
        console.error("Error updating approver status:", error);

        throw new Error(
          `Unable to update approver status: ${error.message}`
        );
      }

      if (!updateApproversStatus) {
        throw new Error(
          "Unable to update approver status: No application was found."
        );
      }
      // -----------------------------------------
      // 6. Return updated records
      // -----------------------------------------
      return {
        success: true,
        message: "Application Approved Successfully.",
        response: {
          updatedBalance: updatedBalance,
          updateApproversStatus: updateApproversStatus
        }
      };
    }
  
  } catch (error) {
    console.error(
      "Approval failed:",
      error
    );

    throw new Error(
      error?.message ||
        "An unexpected error occurred while approving the leave application."
    );
  }
};

export const rejectApplication = async (application, reason, approverID) => {
  // Validate application ID
  if (!application) {
    throw new Error(
      "Unable to reject application: No application ID was provided."
    );
  }
  // Validate approver ID
  if (!application) {
    throw new Error(
      "Unable to reject application: No approver ID was provided."
    );
  }
  // Validate rejection reason
  if (!reason || !reason.trim()) {
    throw new Error(
      "Please provide a reason for rejecting this leave application."
    );
  }
  try {
    const updatedApproverIdStatus =
      application.approver_id_status.map((approver) =>
        Number(approver.id) === Number(approverID)
          ? {
              ...approver,
              status: "rejected",
            }
          : approver
    );
    const { data, error } = await supabase
      .from("leave_applications")
      .update({
        approver_id_status: updatedApproverIdStatus,
        status: "rejected",
        rejection_reason: reason.trim(),
        rejected_at: new Date().toISOString(),
      })
      .eq("id", application.id)
      .select()
      .single();

    // Supabase error
    if (error) {
      console.error(
        "Supabase reject application error:",
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
        "No leave application was updated."
      );

      throw new Error(
        "The leave application could not be found or was not updated."
      );
    }
    return {
      success: true,
      message: "Application Rejected Successfully.",
      response: data,
    };

  } catch (error) {
    console.error(
      "Failed to reject leave application:",
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

    return {
      success: true,
      message: "Memo Marked Successfully.",
      response: data,
    };

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

export const cancelApplication = async (applicationId) => {
  if (!applicationId) {
    console.error(
      "Cancel Application Error: No application ID provided."
    );
    throw new Error("Application ID is required.");
  }
  const { data, error } = await supabase
    .from("leave_applications")
    .update({
      status: "cancelled",
      cancelled_at: new Date().toISOString(),
    })
    .eq("id", applicationId)
    .select()
    .single();

  if (error) {
    console.error(
      "Cancel Application Error:",
      error
    );

    if (error.code === "42501") {
      throw new Error(
        "You do not have permission to cancel this application."
      );
    }

    throw error;
  }

  if (!data) {
    throw new Error(
      "Leave application was not found."
    );
  }
  return {
    success: true,
    message: "Application Cancelled Successfully.",
    response: data,
  };
};