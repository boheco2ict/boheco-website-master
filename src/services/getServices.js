import { supabase } from "../supabase";

export const getLeaveApplicationById = async (applicationId) => {
  try {
    // -----------------------------------------
    // 1. Validate application ID
    // -----------------------------------------
    if (!applicationId) {
      throw new Error(
        "Unable to fetch application: No application ID was provided."
      );
    }

    // -----------------------------------------
    // 2. Fetch leave application
    // -----------------------------------------
    const { data: application, error } = await supabase
      .from("leave_applications")
      .select("*")
      .eq("id", applicationId)
      .single();

    // -----------------------------------------
    // 3. Handle Supabase error
    // -----------------------------------------
    if (error) {
      console.error(
        "❌ Fetch Application Error:",
        error
      );

      throw new Error(
        error.message ||
          "Failed to fetch leave application."
      );
    }

    // -----------------------------------------
    // 4. Check if application exists
    // -----------------------------------------
    if (!application) {
      console.error(
        "❌ Fetch Application Error: No application found."
      );

      console.error(
        "Application ID:",
        applicationId
      );

      throw new Error(
        "No leave application was found."
      );
    }

    const getNames = await getEmployeeNameByID_1(application.employee_id);
    const balances = await getLeaveBalancesByIDAndLeaveType_1(application.employee_id, application.leave_type);

    return {
      ...application,

      employee:
        getNames || null,

      leaveBalance:
        balances || null,
    };

  } catch (error) {
    console.error(
      "❌ Failed to fetch leave application:",
      error
    );

    throw new Error(
      error instanceof Error
        ? error.message
        : "An unexpected error occurred while fetching the leave application."
    );
  }
};

export const getEmployeeByUserId = async (Id) => {
    if (!Id) {
      console.error(
        "❌ Fetch Employee Error: No User ID provided."
      );
      return [];
    }
  if (!Id) {
    throw new Error("User ID is required.");
  }
  const { data } = await supabase
    .from("employees")
    .select(
      `
      id,
      empnumber,
      firstname,
      middlename,
      lastname,
      department,
      position,
      empstatus,
      address,
      phone1,
      phone2,
      birthdate,
      tin,
      sss,
      pagibig,
      philhealth,
      datehired,
      basicrate,
      riceallowance,
      role,
      user_id,
      employee_leave_balances (
        leave_type,
        leave_balance
      )
      `
    )
    .eq("user_id", Id)
    .single()
    .throwOnError();

  if (!data) {
    throw new Error("Employee data not found.");
  }
  return data;
};

export const getAllEmployees = async () => {
  const { data, error } = await supabase
    .from("employees")
    .select("*")
    .not("user_id", "is", null)
    .order("lastname", { ascending: true })
    .throwOnError();

  if (error) {
    console.error("❌ Fetch Employees Error:", error);
    throw error;
  }

  if (!data) {
    throw new Error("Employee data not found.");
  }

  return data;
};

export const getMyAssignMemo = async (employee_id) => {
  if (!employee_id) {
    console.error(
      "Fetch Memo Error: No employee ID provided."
    );
    return null;
  }

  const { data, error } = await supabase
    .from("memo")
    .select(`
      *,
      postedBy:employees!posted_by (
        id,
        firstname,
        middlename,
        lastname
      )
    `)
    .eq("employee_id", employee_id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Fetch Assign Memo Error:", error);
  }

  if (!data) {
    throw new Error("Assigned memo data not found.");
  }

  return data;
};

export const getDepartmentMeaning = async () => {
  const { data, error } = await supabase
    .from("departments")
    .select("code, name")
    .throwOnError();

  if (error) {
    console.error("❌ Fetch Department Meaning Error:", error);
    throw error;
  }

  if (!data) {
    throw new Error("Department meaning not found.");
  }

  return data;
};

export const getLeaveApproverByDepartment = async (department) => {
  if (!department) {
    console.error(
      "Fetch Approver Error: No department provided."
    );
    return null;
  }

  const { data, error } = await supabase
    .from("can_approve_leave")
    .select("employee_id_email")
    .eq("department", department)
    .single();

  // Check the query error FIRST
  if (error) {
    console.error("Fetch Department Error:", error);
  }

  if (!data) {
    throw new Error("Department data not found.");
  }

  const employeeIdEmail = data.employee_id_email;

  const approverIDs = employeeIdEmail.map(
    (employee) => Number(employee.id)
  );
  const approverEmails = employeeIdEmail.map(
    (employee) => employee.email
  );

  const approverNames = await getLeaveApproverByDepartment_Name(approverIDs);

  // console.log("IDs:", approverIDs);
  // console.log("Names:", approverNames);
  // console.log("Emails:", approverEmails);

  return {
    approverIDs, approverNames, approverEmails,
  };
};

const getLeaveApproverByDepartment_Name = async (IDs) => {
  if (!IDs || IDs.length === 0) {
    console.error(
      "Fetch Approver Names Error: No IDs provided."
    );
    return [];
  }

  const { data, error } = await supabase
    .from("employees")
    .select("firstname, middlename, lastname")
    .in("id", IDs);

  if (error) {
    console.error("Fetch Names Error:", error);
  }

  if (!data) {
    throw new Error("Name data not found.");
  }

  const formattedNames = data.map((employee) => {
    const middleInitial = employee.middlename
      ? `${employee.middlename.charAt(0)}.`
      : "";

    return `${employee.firstname} ${middleInitial} ${employee.lastname}`
      .replace(/\s+/g, " ")
      .trim();
  });

  return formattedNames;
};

export const getMyHistoryApplicationByID = async (ID) => {
    if (!ID) {
    console.error(
      "Fetch Error: No data provided."
    );
    return null;
  }
  const { data, error } = await supabase
    .from("leave_applications")
    .select("*")
    .eq("employee_id", ID)
    .in("status", ["approved", "rejected", "cancelled"])
    .order("created_at", { ascending: false });

  // Check the query error FIRST
  if (error) {
    console.error("Fetch Error:", error);
  }

  if (!data) {
    throw new Error("data not found.");
  }
  return data;
}

export const getMyPendingApplicationByID = async (ID) => {
 if (!ID) {
    console.error("Fetch Error: No employee ID provided.");
    return [];
  }
  const { data, error } = await supabase
    .from("leave_applications")
    .select("*")
    .eq("employee_id", ID)
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  // Check the query error FIRST
  if (error) {
    console.error("Fetch Error:", error);
  }

  if (!data) {
    throw new Error("data not found.");
  }
  return data;
}

export const getAllPendingApplications = async () => {
  try {
    // -----------------------------------------
    // 1. Get pending leave applications
    // -----------------------------------------
    const { data, error } = await supabase
      .from("leave_applications")
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(
        "Fetch Pending Applications Error:",
        error
      );

      throw new Error(
        error.message ||
          "Failed to fetch pending leave applications."
      );
    }

    // -----------------------------------------
    // 2. No pending applications
    // -----------------------------------------
    if (!data || data.length === 0) {
      console.log("No pending leave applications found.");
      return [];
    }

    // -----------------------------------------
    // 3. Get unique employee IDs
    // -----------------------------------------
    const employeeIds = [
      ...new Set(
        data
          .map((app) => app.employee_id)
          .filter(Boolean)
      ),
    ];

    if (employeeIds.length === 0) {
      throw new Error(
        "No valid employee IDs were found."
      );
    }

    // -----------------------------------------
    // 4. Get employee names
    // -----------------------------------------
    const getNames =
      await getEmployeeNameByID(employeeIds);

    if (!Array.isArray(getNames)) {
      throw new Error(
        "Failed to retrieve employee information."
      );
    }

    const employeeMap = Object.fromEntries(
      getNames.map((emp) => [emp.id, emp])
    );

    // -----------------------------------------
    // 5. Get employee leave balances
    // -----------------------------------------
    const balances =
      await getLeaveBalancesByID(employeeIds);

    if (!Array.isArray(balances)) {
      throw new Error(
        "Failed to retrieve employee leave balances."
      );
    }

    const balanceMap = Object.fromEntries(
      balances.map((balance) => [
        `${balance.employee_id}-${String(
          balance.leave_type
        )
          .trim()
          .toUpperCase()}`,
        balance,
      ])
    );

    // -----------------------------------------
    // 6. Merge application + employee + balance
    // -----------------------------------------
    const mergedData = data.map((app) => {
      const balanceKey = `${app.employee_id}-${String(
        app.leave_type
      )
        .trim()
        .toUpperCase()}`;

      return {
        ...app,

        employee:
          employeeMap[app.employee_id] || null,

        leaveBalance:
          balanceMap[balanceKey] || null,
      };
    });
    return mergedData;
  } catch (error) {
    console.error(
      "Failed to fetch pending leave applications:",
      error
    );

    throw new Error(
      error instanceof Error
        ? error.message
        : "An unexpected error occurred while fetching pending leave applications."
    );
  }
};

const getEmployeeNameByID = async (ID) => {
   if (!ID) {
    console.error("Fetch Error: No employee ID provided.");
    return [];
  }
  const { data, error } = await supabase
    .from("employees")
    .select("id, firstname, middlename, lastname")
    .in("id", ID);
    if (error) {
      console.error("Fetch Names Error:", error);
    }
    return data || [];
};

const getLeaveBalancesByID = async (ID) => {
  if (!ID) {
    console.error("Fetch Error: No employee ID provided.");
    return [];
  }
  const { data, error } = await supabase
    .from("employee_leave_balances")
    .select("id, employee_id, leave_type, leave_balance")
    .in("employee_id", ID);
  if (error) {
    console.error("Fetch Balances Error:", error);
    throw error;
  }
  return data || [];
};

const getEmployeeNameByID_1 = async (ID) => {
  try {
    if (!ID) {
      throw new Error(
        "Unable to fetch employee: No employee ID was provided."
      );
    }

    const { data, error } = await supabase
      .from("employees")
      .select("id, firstname, middlename, lastname")
      .eq("id", ID)
      .single();

    if (error) {
      console.error("Fetch Names Error:", error);

      throw new Error(
        error.message ||
          "Failed to fetch employee information."
      );
    }

    if (!data) {
      throw new Error(
        `No employee found with ID: ${ID}`
      );
    }

    return data;
  } catch (error) {
    console.error(
      "❌ Failed to fetch employee:",
      error
    );

    throw new Error(
      error instanceof Error
        ? error.message
        : "An unexpected error occurred while fetching employee information."
    );
  }
};

const getLeaveBalancesByIDAndLeaveType_1 = async (
  ID,
  LeaveType
) => {
  try {
    if (!ID) {
      throw new Error(
        "Unable to fetch leave balance: No employee ID was provided."
      );
    }

    if (!LeaveType) {
      throw new Error(
        "Unable to fetch leave balance: No leave type was provided."
      );
    }

    const { data, error } = await supabase
      .from("employee_leave_balances")
      .select(
        "id, employee_id, leave_type, leave_balance"
      )
      .eq("employee_id", ID)
      .eq("leave_type", LeaveType)
      .single();

    if (error) {
      console.error(
        "Fetch Balance Error:",
        error
      );

      throw new Error(
        error.message ||
          "Failed to fetch employee leave balance."
      );
    }

    if (!data) {
      throw new Error(
        `No ${LeaveType} balance found for employee ID: ${ID}`
      );
    }

    return data;
  } catch (error) {
    console.error(
      "❌ Failed to fetch leave balance:",
      error
    );

    throw new Error(
      error instanceof Error
        ? error.message
        : "An unexpected error occurred while fetching leave balance."
    );
  }
};