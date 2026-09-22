import { supabase } from "./supabase";
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
  const { data, error } = await supabase
    .from("memo")
    .insert(memoRows)
    .select();

  if (error) {
    throw error;
  }

  return data;
};//Ok

export const createLeaveApplication = async (applicationPayload) => {
  if (!applicationPayload) {
    throw new Error("Leave Data is Required.");
  }
  const { data, error } = await supabase
    .from("leave_applications")
    .insert(applicationPayload)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
};//Ok

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
    lowvoltage: {
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

    highvoltage: {
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

  // Validate year
  if (!year) {
    throw new Error("No Year Provided.");
  }
  const numericYear = Number(year);
  const pdfURLTrim = pdfUrl ? pdfUrl.trim() : null;
    
  // Check if year already exists
  const { data: existingYear, error: checkError } =
    await supabase
      .from("power_rates")
      .select("id, year")
      .eq("year", numericYear)
      .maybeSingle();

  if (checkError) {
    throw checkError;
  }
  if (existingYear) {
    throw new Error(`Power Rate Year ${numericYear} Already Exists.`);
  }

  // Insert new year
  const { data, error } = await supabase
    .from("power_rates")
    .insert({
      year: numericYear,
      pdf_url: pdfURLTrim,
      rates: defaultRates,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }
  return data;
};//Ok

export const createPowerAdvisory = async (postedbyid, imageUrl, order) => {
  if (!imageUrl) {
    throw new Error("Image URL is Required.");
  }

  if (!postedbyid) {
    throw new Error("Posted by ID is Required.");
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
      posted_by_employee_id: postedbyid,
      image_url: imageUrl,
      display_order: Number(order),
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
};//Ok

export const createGenerationCharge = async (postedbyid, imageUrl, order) => {
  if (!postedbyid) {
    throw new Error("Posted by ID is Required.");
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
    .insert({
      image_url: imageUrl,
      display_order: Number(order),
      posted_by_employee_id: postedbyid
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
};//Ok

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

export const createConsumer = async (id) => {
  if (!id) {
    throw new Error("User ID is Required.");
  }

  const { data, error } = await supabase
    .from("accounts")
    .insert({
      user_id: id,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
};//Ok

export const createConsumerAccountBinding = async (consumerId, accountNumber, month, year, netAmount) => {
  if (!consumerId || !accountNumber || !month || !year || !netAmount) {
    throw new Error("Missing Required Parameters.");
  }
  const servicePeriodEnd = `${month}/01/${year}`;

   // =========================================
    // CHECK IF ACCOUNT NUMBER ALREADY EXISTS
    // INSIDE consumers_boheco_account
    // =========================================
    const { data: existingAccount, error: existingError } =
      await supabase
        .from("consumers_boheco_account")
        .select("*")
        .eq("account_number", accountNumber)
        .limit(1)
        .maybeSingle();

    if (existingError) {
      throw existingError;
    }

    // Account number already exists
    if (existingAccount) {
      throw new Error("This account number is already registered.");
    }

    // =========================================
    // VERIFY ACCOUNT THROUGH LEDGER
    // =========================================
    const getLedgerResponse = await getLedger(accountNumber, servicePeriodEnd, netAmount);

    if (!getLedgerResponse) {
      throw new Error("No Record Found, Please Try Again.");
    }

    const resData = getLedgerResponse?.data?.[0];

    if (!getLedgerResponse) {
      throw new Error("No Record Found, Please Try Again.");
    }

    // =========================================
    // CREATE CONSUMER
    // =========================================
    const AccountName = resData?.ConsumerName || null;

    const { data: addAccountData, error: accountError } = await supabase
      .from("consumers_boheco_account")
      .insert({
        account_id: consumerId,
        account_number: accountNumber,
        service_period_end: servicePeriodEnd,
        net_amount: netAmount,
        account_name: AccountName,
      })
      .select()
      .single();

    if (accountError) {
      throw accountError;
    }

    return addAccountData;
};

export const createPowerInterruption = async (postedbyid, imageUrl, description, type) => {
  const cleanImageUrl = imageUrl?.trim();
  const cleanType = type?.trim();
  const cleanDescription = description?.trim();

  if (!postedbyid) {
    throw new Error("Posted by ID is Required.");
  }

  if (!cleanImageUrl) {
    throw new Error("Image URL is required to create a power interruption.");
  }
  if (!cleanType) {
    throw new Error("Type is required to create a power interruption.");
  }
  if (!cleanDescription) {
    throw new Error("Description is required to create a power interruption.");
  }

  const { data, error } = await supabase
    .from("power_interruption")
    .insert({
      image_url: cleanImageUrl,
      type: cleanType,
      description: cleanDescription,
      posted_by_employee_id: postedbyid
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating power interruption:", error);
    throw error;
  }

  return data;
};//Ok

export const createNotice = async (cleanTitle, cleanFileUrl, uploadedImageUrl, ID) => {
  if (!cleanTitle) {
    throw new Error("Title is required.");
  }
  if (!cleanFileUrl) {
    throw new Error("File URL is required.");
  }
  if (!uploadedImageUrl) {
    throw new Error("Drive URL is required.");
  }
  if (!ID) {
    throw new Error("ID is required.");
  }

  const { data, error } = await supabase
    .from("notice")
    .insert({
      title: cleanTitle,
      file_url: cleanFileUrl,
      image_url: uploadedImageUrl,
      posted_by: ID
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating notice:", error);
    throw error;
  }

  return data;
};