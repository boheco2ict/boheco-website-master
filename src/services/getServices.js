import { supabase } from "../supabase";

export const getLeaveApplicationById = async (applicationId) => {
  try {
     if (!applicationId) {
      console.error("Fetch Error: No employee ID provided.");
      return [];
    }

    // Get leave application
    const { data: application } = await supabase
      .from("leave_applications")
      .select("*")
      .eq("id", applicationId)
      .single()
      .throwOnError();

    if (!application) {
      console.error(
        "❌ Fetch Application Error: No application found."
      );
      console.error(
        "Application ID:",
        applicationId
      );
      return null;
    }

    // Get employee
    const { data: employee } = await supabase
      .from("employees")
             .select(
          `
          id,
          empnumber,
          firstname,
          middlename,
          lastname,
          employee_leave_balances (
            leave_type,
            leave_balance
          )
        `
        )
      .eq("id", application.employee_id)
      .single()
      .throwOnError();

    if (!employee) {
      console.error(
        "❌ Fetch Employee Error: No employee found."
      );
      console.error(
        "Employee ID:",
        application.employee_id
      );
      return null;
    }
    const name = `${employee.lastname}, ${employee.firstname} ${
      employee.middlename?.charAt(0).toUpperCase() || ""
    }.`;
    // Merge application + employee
    return {
      ...application,
      name,
      employee
    };

  } catch (error) {
    console.error(
      "❌ Error retrieving application:",
      error
    );
    return null;
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
  const { data, error } = await supabase
    .from("leave_applications")
    .select("*")
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Fetch Pending Applications Error:", error);
    throw error;
  }

  if (!data || data.length === 0) {
    return [];
  }

  // Get unique employee IDs
  const employeeIds = [
    ...new Set(data.map((app) => app.employee_id)),
  ];

  // Get names
  const getNames = await getEmployeeNameByID(employeeIds);
  const employeeMap = Object.fromEntries(
    getNames.map((emp) => [emp.id, emp])
  );

  // Get balances
  const balances = await getLeaveBalancesByID(employeeIds);
  const balanceMap = Object.fromEntries(
    balances.map((balance) => [
      `${balance.employee_id}-${balance.leave_type
        .trim()
        .toUpperCase()}`,
      balance,
    ])
  );

  // Merge names + leave balance
  const mergedData = data.map((app) => {
    const balanceKey =
      `${app.employee_id}-${app.leave_type}`;
    return {
      ...app,
      employee:
        employeeMap[app.employee_id] || null,

      leaveBalance:
        balanceMap[balanceKey] || null,
    };
  });
  return mergedData;
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
}

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