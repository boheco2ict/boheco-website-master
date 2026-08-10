import { supabase } from "../supabase";

export const getLeaveApplicationById = async (applicationId) => {
  try {
    if (!applicationId) {
      console.error(
        "❌ Fetch Application Error: No application ID provided."
      );
      return null;
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

export const getEmployeeByUserId = async (userId) => {
    if (!userId) {
      console.error(
        "❌ Fetch Employee Error: No User ID provided."
      );
      return [];
    }
  if (!userId) {
    throw new Error("User ID is required.");
  }
  const { data } = await supabase
    .from("employees")
    .select(`
      id,
      empnumber,
      firstname,
      middlename,
      lastname,
      department,
      role,
      user_id,
      employee_leave_balances (
        leave_type,
        leave_balance
      )
    `)
    .eq("user_id", userId)
    .single()
    .throwOnError();

  if (!data) {
    throw new Error("Employee data not found.");
  }
  return data;
};