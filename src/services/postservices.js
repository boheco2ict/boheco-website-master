import { supabase } from "../supabase";
import { getLedger } from "./getservices"; 

export const createMemo = async (memoName, memoDescription, memoUrl, individualTarget, batchEmployeeIds, recipientType, memoCreatorID) => {
  const memoNameTrim = memoName.trim();
  const memoURLTrim = memoUrl.trim();
  const memoDescriptionTrim = memoDescription.trim();

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
        description: memoDescriptionTrim,
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
      description: memoDescriptionTrim,
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

export const createLeaveApplication = async (applicationPayload) => {
  if (!applicationPayload) {
    throw new Error("Leave application payload is required.");
  }
  const { data, error } = await supabase
    .from("leave_applications")
    .insert(applicationPayload)
    .select()
    .single();
  if (error) {
    console.error("❌ Create Leave Application Error:", error);
    if (error.code === "42501") {
      console.error(
        "🔒 RLS Policy Error: You do not have permission to create a leave application."
      );
      throw new Error(
        "You do not have permission to create a leave application."
      );
    }
    throw error;
  }
  if (!data) {
    throw new Error("Leave application was not created.");
  }
  return {
    success: true,
    message: "Leave Application Filed Successfully.",
    data: data
  };
};

export const createOfficeOrder = async (officeOrderName, officeOrderDescription, officeOrderUrl, individualTarget, batchEmployeeIds, recipientType, officeOrderCreatorID) => {
  const officeOrderNameTrim = officeOrderName.trim();
  const officeOrderURLTrim = officeOrderUrl.trim();
  const officeOrderDerscriptionTrim = officeOrderDescription.trim();

  let officeOrderRows = [];

  // ==============================
  // INDIVIDUAL
  // ==============================
  if (recipientType === "individual") {
    if (!individualTarget?.trim()) {
      throw new Error("Please select an employee.");
    }

    officeOrderRows = [
      {
        title: officeOrderNameTrim,
        url: officeOrderURLTrim,
        employee_id: individualTarget,
        posted_by: officeOrderCreatorID,
        description: officeOrderDerscriptionTrim,
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

    officeOrderRows = batchEmployeeIds.map((employeeId) => ({
      title: officeOrderNameTrim,
      url: officeOrderURLTrim,
      employee_id: employeeId,
      posted_by: officeOrderCreatorID,
      description: officeOrderDerscriptionTrim,
      is_read: false,
    }));
  }

  // ==============================
  // VALIDATE
  // ==============================
  if (officeOrderRows.length === 0) {
    throw new Error("No office order recipients found.");
  }

  // ==============================
  // INSERT
  // ==============================
  const { error } = await supabase
    .from("office_order")
    .insert(officeOrderRows);

  if (error) {
    console.error("Create Office Order Error:", error);
    throw error;
  }

  return true;
};

export const createPowerRateYear = async (year, pdfUrl) => {
  const defaultRates = {
    commercial: {
      "1": null,
      "2": null,
      "3": null,
      "4": null,
      "5": null,
      "6": null,
      "7": null,
      "8": null,
      "9": null,
      "10": null,
      "11": null,
      "12": null,
    },

    industrial: {
      "1": null,
      "2": null,
      "3": null,
      "4": null,
      "5": null,
      "6": null,
      "7": null,
      "8": null,
      "9": null,
      "10": null,
      "11": null,
      "12": null,
    },

    residential: {
      "1": null,
      "2": null,
      "3": null,
      "4": null,
      "5": null,
      "6": null,
      "7": null,
      "8": null,
      "9": null,
      "10": null,
      "11": null,
      "12": null,
    },
  };
  try {
    // -----------------------------
    // Validate year
    // -----------------------------
    if (!year) {
      return {
        success: false,
        message: "Year is required.",
        data: null,
      };
    }

    const numericYear = Number(year);

    if (Number.isNaN(numericYear)) {
      return {
        success: false,
        message: "Year must be a valid number.",
        data: null,
      };
    }

    if (numericYear < 2000 || numericYear > 2100) {
      return {
        success: false,
        message: "Please enter a valid year between 2000 and 2100.",
        data: null,
      };
    }

    // -----------------------------
    // Validate PDF URL
    // -----------------------------
    let formattedPdfUrl = null;

    if (pdfUrl && pdfUrl.trim() !== "") {
      try {
        const url = new URL(pdfUrl.trim());

        if (!["http:", "https:"].includes(url.protocol)) {
          return {
            success: false,
            message: "PDF URL must use HTTP or HTTPS.",
            data: null,
          };
        }

        formattedPdfUrl = pdfUrl.trim();
      } catch {
        return {
          success: false,
          message: "Please enter a valid PDF URL.",
          data: null,
        };
      }
    }

    // -----------------------------
    // Check if year already exists
    // -----------------------------
    const { data: existingYear, error: checkError } =
      await supabase
        .from("power_rate_years")
        .select("id, year")
        .eq("year", numericYear)
        .maybeSingle();

    if (checkError) {
      console.error(
        "Error checking existing power rate year:",
        checkError
      );

      return {
        success: false,
        message: "Unable to verify if the year already exists.",
        data: null,
      };
    }

    if (existingYear) {
      return {
        success: false,
        message: `Power rate year ${numericYear} already exists.`,
        data: existingYear,
      };
    }

    // -----------------------------
    // Insert new year
    // -----------------------------
    const { data, error } = await supabase
      .from("power_rate_years")
      .insert({
        year: numericYear,
        pdf_url: formattedPdfUrl,
        rates: defaultRates,
      })
      .select()
      .single();

    if (error) {
      console.error(
        "Error creating power rate year:",
        error
      );

      return {
        success: false,
        message: "Unable to create the power rate year.",
        data: null,
        error: error,
      };
    }

    // -----------------------------
    // Success
    // -----------------------------
    return {
      success: true,
      message: `Power rate year ${numericYear} created successfully.`,
      data: data,
    };

  } catch (error) {
    console.error(
      "Unexpected error creating power rate year:",
      error
    );

    return {
      success: false,
      message:
        "An unexpected error occurred while creating the power rate year.",
      data: null,
      error,
    };
  }
};

export const createPowerAdvisory = async (imageUrl, order) => {
  try {
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
      .insert({
        image_url: imageUrl,
        display_order: Number(order),
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error(
      "Error creating power rate advisory:",
      error
    );

    throw error;
  }
};

export const createGenerationCharge = async (imageUrl, order) => {
  try {
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
      .insert({
        image_url: imageUrl,
        display_order: Number(order),
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error(
      "Error creating generation charge:",
      error
    );

    throw error;
  }
};

export const createLeaveApproverDepartment = async (
  department,
  approvers
) => {
  const { data, error } = await supabase
    .from("can_approve_leave")
    .insert([
      {
        department,
        employee_id_email: approvers || null,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Error creating leave approver department:", error);
    throw error;
  }

  return data;
};

export const createEmployee = async (data) => {
  try {
    const { data: newEmployee, error } = await supabase
      .from("employees")
      .insert([data])
      .select()
      .single();

    if (error) {
      console.error("Create Employee Error:", error);

      // Duplicate record
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
        message: "Add Employee Failed.",
        response: error,
      };
    }

    return {
      success: true,
      message: "Add Employee Successfully.",
      response: newEmployee,
    };

  } catch (error) {
    console.error("Create Employee Exception:", error);

    return {
      success: false,
      message: "Add Employee Failed.",
      response: error,
    };
  }
};

export const createConsumer = async (data) => {
  if (!data.user_id) {
    return {
      success: false,
      message: "User ID is Missing.",
      response: null
    }
  }
  const date = `${data.month}/01/${data.year}`;

  try {
    const response = await getLedger(data?.account_number, date, data?.amount);
    if (!response) {
      return {
        success: false,
        message: "No Record Found, Please Try Again.",
        response: response,
      };
    } else {
      const resData = response?.data[0];
      if (!resData) {
        return {
          success: false,
          message: "No Record Found, Please Try Again.",
          response: response,
        };
      }

      const { data: newConsumer, error } = await supabase
      .from("consumers")
      .insert({
        user_id: data?.user_id,
        account_number: data?.account_number,
        net_amount: data?.amount,
        service_period_end: date,
        
      })
      .select()
      .single();

      if (error) {
        console.error("Create Consumer Error:", error);

        // Duplicate record
        if (error.code === "23505") {
          if (error.message.includes("user_id")) {
            return {
              success: false,
              message: "This user is already assigned to an consumer.",
              response: error,
            };
          }

          return {
            success: false,
            message: "Duplicate Consumer information.",
            response: error,
          };
        }

        return {
          success: false,
          message: "Add Consumer Failed.",
          response: error,
        };
      }

      return {
        success: true,
        message: "Verified Successfully.",
        response: newConsumer,
      };
    }
  } catch (error) {
    console.error("Create Consumer Exception:", error);

    return {
      success: false,
      message: "Add Consumer Failed.",
      response: error,
    };
  }
};