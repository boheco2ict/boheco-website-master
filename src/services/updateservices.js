import { supabase } from "../supabase";

export const approveApplication2 = async (application, approverID) => { //Not Used For Backup
  console.log(application);
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

export const approveApplication = async (application, approverID) => {
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
    const { data, error } = await supabase.rpc(
      "approve_leave_application",
      {
        p_application_id: application.id,
        p_approver_id: String(approverID),
      }
    );

    if (error) {
      console.error("Approval failed:", error);

      throw new Error(error.message);
    }

    return {
      success: true,
      message: data?.message || "Application Approved Successfully.",
      response: data,
    };
  } catch (error) {
    console.error("Approval failed:", error);

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

export const markAsReadOfficeOrder = async (officeOrderData) => {
  if (!officeOrderData) {
    throw new Error(
      "Unable to mark as read: No data was provided."
    );
  }
  try {
    const { data, error } = await supabase
      .from("office_order")
      .update({
        is_read: "TRUE",
        read_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", officeOrderData.id)
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
      message: "Office Order Marked Successfully.",
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

export const updatePowerRateYear = async (id, year, pdfUrl, rates) => {

  try {
    const { data, error } = await supabase
      .from("power_rate_years")
      .update({
        year: year,
        pdf_url: pdfUrl || null,
        rates: rates,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error(
        "Error updating power rate year:",
        error
      );

      return {
        success: false,
        message: "Unable to update power rate year.",
        data: null,
        error,
      };
    }

    return {
      success: true,
      message: "Power rates updated successfully.",
      data,
    };
  } catch (error) {
    console.error(
      "Unexpected error updating power rate year:",
      error
    );

    return {
      success: false,
      message:
        "An unexpected error occurred while updating the power rates.",
      data: null,
      error,
    };
  }
};

export const updatePowerAdvisory = async (id, imageUrl, order) => {
  try {
    if (!id) {
      throw new Error("Advisory ID is required.");
    }

    if (!imageUrl) {
      throw new Error("Image URL is required.");
    }

    if (
      !Number.isInteger(Number(order)) ||
      Number(order) < 1
    ) {
      throw new Error(
        "Display order must be a positive whole number."
      );
    }

    const { data, error } = await supabase
      .from("power_rate_advisories")
      .update({
        image_url: imageUrl,
        display_order: Number(order),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error(
      "Error updating power rate advisory:",
      error
    );

    throw error;
  }
};

export const updateGenerationCharge = async (id, imageUrl, order) => {
  try {
    if (!id) {
      throw new Error("ID is required.");
    }

    if (!imageUrl) {
      throw new Error("Image URL is required.");
    }

    if (
      !Number.isInteger(Number(order)) ||
      Number(order) < 1
    ) {
      throw new Error(
        "Display order must be a positive whole number."
      );
    }

    const { data, error } = await supabase
      .from("generation_charge")
      .update({
        image_url: imageUrl,
        display_order: Number(order),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error(
      "Error updating generation charge:",
      error
    );

    throw error;
  }
};

export const updateLeaveApproverDepartment = async (
  id,
  department,
  approvers
) => {
  try {
    // Validate ID
    if (!id) {
      return {
        success: false,
        message: "Department ID is required.",
        response: null,
      };
    }

    // Validate department
    if (!department || !department.trim()) {
      return {
        success: false,
        message: "Department is required.",
        response: null,
      };
    }

    // Validate approvers
    if (!Array.isArray(approvers)) {
      return {
        success: false,
        message: "Approvers must be an array.",
        response: null,
      };
    }

    // Validate each approver
    for (const approver of approvers) {
      if (!approver.id) {
        return {
          success: false,
          message: "An approver is missing an employee ID.",
          response: null,
        };
      }

      if (!approver.email) {
        return {
          success: false,
          message: "An approver is missing an email address.",
          response: null,
        };
      }
    }

    // Update database
    const { data, error } = await supabase
      .from("can_approve_leave")
      .update({
        department: department.trim(),
        employee_id_email: approvers,
      })
      .eq("id", id)
      .select()
      .single();

    // Supabase/database error
    if (error) {
      console.error(
        "Error updating leave approvers:",
        error
      );

      // Duplicate department
      if (error.code === "23505") {
        return {
          success: false,
          message:
            "This department already has a leave approver configuration.",
          response: null,
        };
      }

      return {
        success: false,
        message:
          error.message ||
          "Failed to update leave approvers.",
        response: null,
      };
    }

    // No record found
    if (!data) {
      return {
        success: false,
        message:
          "Leave approver configuration was not found.",
        response: null,
      };
    }

    // Successful update
    return {
      success: true,
      message: "Leave approvers updated successfully.",
      response: data,
    };

  } catch (error) {
    console.error(
      "Unexpected error updating leave approvers:",
      error
    );

    return {
      success: false,
      message:
        error?.message ||
        "An unexpected error occurred while updating leave approvers.",
      response: null,
    };
  }
};

export const updateEmployee = async (id, dataInfo) => {
  try {
    const { data, error } = await supabase
      .from("employees")
      .update(dataInfo)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Update Error:", error);

      // Duplicate value
      if (error.code === "23505") {
        if (error.message.includes("user_id")) {
          return {
            success: false,
            message: "This user is already assigned to an employee.",
            response: error,
          };
        }

        if (error.message.includes("empnumber")) {
          return {
            success: false,
            message: "Employee number already exists.",
            response: error,
          };
        }

        return {
          success: false,
          message: "Duplicate employee information.",
          response: error,
        };
      }

      return {
        success: false,
        message: "Update Failed.",
        response: error,
      };
    }

    return {
      success: true,
      message: "Employee Updated Successfully.",
      response: data,
    };

  } catch (error) {
    console.error("Update Exception:", error);

    return {
      success: false,
      message: "Update Failed.",
      response: error,
    };
  }
};