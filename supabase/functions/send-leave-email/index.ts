import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders,
    });
  }

  try {
    // -----------------------------------------
    // Environment variables
    // -----------------------------------------
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get(
      "SUPABASE_SERVICE_ROLE_KEY"
    )!;
    const resendApiKey = Deno.env.get("RESEND_API_KEY");

    if (!resendApiKey) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    // -----------------------------------------
    // Create Supabase client
    // -----------------------------------------
    const supabase = createClient(
      supabaseUrl,
      supabaseServiceKey
    );

    // -----------------------------------------
    // Get application ID from request
    // -----------------------------------------
    const { applicationId, origin } = await req.json();

    if (!applicationId) {
      return new Response(
        JSON.stringify({
          error: "applicationId is required",
        }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    // -----------------------------------------
    // Get leave application
    // -----------------------------------------
    const { data: application, error: applicationError } =
      await supabase
        .from("leave_applications")
        .select(
          `
          id,
          employee_id,
          leave_type,
          start_date,
          end_date,
          days_requested,
          reason,
          status,
          created_at
        `
        )
        .eq("id", applicationId)
        .single();

    if (applicationError || !application) {
      console.error(
        "Application error:",
        applicationError
      );

      throw new Error(
        "Leave application not found"
      );
    }

    // -----------------------------------------
    // Get employee
    // -----------------------------------------
    const { data: employee, error: employeeError } =
      await supabase
        .from("employees")
        .select(
          `
          id,
          firstname,
          lastname,
          middlename,
          department,
          empnumber
        `
        )
        .eq("id", application.employee_id)
        .single();

    if (employeeError || !employee) {
      console.error(
        "Employee error:",
        employeeError
      );

      throw new Error(
        "Employee information not found"
      );
    }

    // -----------------------------------------
    // Find approver based on department
    // -----------------------------------------
    const { data: approver, error: approverError } =
      await supabase
        .from("can_approve_leave")
        .select(
          `
          id,
          emp_id,
          dept,
          email
        `
        )
        .eq("dept", employee.department)
        .limit(1)
        .maybeSingle();

    if (approverError) {
      console.error(
        "Approver lookup error:",
        approverError
      );

      throw new Error(
        "Unable to find leave approver"
      );
    }

    if (!approver || !approver.email) {
      throw new Error(
        `No leave approver found for department: ${employee.department}`
      );
    }

    // -----------------------------------------
    // Employee full name
    // -----------------------------------------
    const employeeName = [
      employee.firstname,
      employee.middlename,
      employee.lastname,
    ]
      .filter(Boolean)
      .join(" ");

    // -----------------------------------------
    // Review URL
    // -----------------------------------------
    const domain = origin || "http://localhost:3000";

    const reviewUrl =
      `${domain}/review-application/${application.id}`;

    // -----------------------------------------
    // Send email through Resend
    // -----------------------------------------
    const resendResponse = await fetch(
      "https://api.resend.com/emails",
      {
        method: "POST",

        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          from: "BOHECO II Leave System <onboarding@resend.dev>",

          to: [approver.email],

          subject:
            `New Leave Application - ${employeeName}`,

          html: `
            <!DOCTYPE html>

            <html>
              <body
                style="
                  margin: 0;
                  padding: 0;
                  background: #f1f5f9;
                  font-family: Arial, sans-serif;
                "
              >

                <div
                  style="
                    max-width: 650px;
                    margin: 40px auto;
                    background: #ffffff;
                    border-radius: 12px;
                    overflow: hidden;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.08);
                  "
                >

                  <div
                    style="
                      background: #1e3a8a;
                      padding: 25px;
                      color: white;
                    "
                  >
                    <h2 style="margin: 0;">
                      BOHECO II
                    </h2>

                    <p style="margin: 5px 0 0;">
                      Leave Management System
                    </p>
                  </div>

                  <div style="padding: 30px;">

                    <h2 style="color: #111827;">
                      New Leave Application
                    </h2>

                    <p>
                      A new leave application has been
                      submitted and requires your review.
                    </p>

                    <hr
                      style="
                        border: none;
                        border-top: 1px solid #e5e7eb;
                        margin: 25px 0;
                      "
                    />

                    <h3>
                      Application Details
                    </h3>

                    <table
                      style="
                        width: 100%;
                        border-collapse: collapse;
                      "
                    >

                      <tr>
                        <td
                          style="
                            padding: 8px 0;
                            font-weight: bold;
                          "
                        >
                          Employee
                        </td>

                        <td style="padding: 8px 0;">
                          ${employeeName}
                        </td>
                      </tr>

                      <tr>
                        <td
                          style="
                            padding: 8px 0;
                            font-weight: bold;
                          "
                        >
                          Employee Number
                        </td>

                        <td style="padding: 8px 0;">
                          ${employee.empnumber ?? "N/A"}
                        </td>
                      </tr>

                      <tr>
                        <td
                          style="
                            padding: 8px 0;
                            font-weight: bold;
                          "
                        >
                          Department
                        </td>

                        <td style="padding: 8px 0;">
                          ${employee.department ?? "N/A"}
                        </td>
                      </tr>

                      <tr>
                        <td
                          style="
                            padding: 8px 0;
                            font-weight: bold;
                          "
                        >
                          Leave Type
                        </td>

                        <td style="padding: 8px 0;">
                          ${application.leave_type}
                        </td>
                      </tr>

                      <tr>
                        <td
                          style="
                            padding: 8px 0;
                            font-weight: bold;
                          "
                        >
                          Start Date
                        </td>

                        <td style="padding: 8px 0;">
                          ${application.start_date}
                        </td>
                      </tr>

                      <tr>
                        <td
                          style="
                            padding: 8px 0;
                            font-weight: bold;
                          "
                        >
                          End Date
                        </td>

                        <td style="padding: 8px 0;">
                          ${application.end_date}
                        </td>
                      </tr>

                      <tr>
                        <td
                          style="
                            padding: 8px 0;
                            font-weight: bold;
                          "
                        >
                          Days Requested
                        </td>

                        <td style="padding: 8px 0;">
                          ${application.days_requested}
                        </td>
                      </tr>

                      <tr>
                        <td
                          style="
                            padding: 8px 0;
                            font-weight: bold;
                          "
                        >
                          Reason
                        </td>

                        <td style="padding: 8px 0;">
                          ${application.reason ?? "N/A"}
                        </td>
                      </tr>

                    </table>

                    <div
                      style="
                        text-align: center;
                        margin-top: 30px;
                      "
                    >

                      <a
                        href="${reviewUrl}"
                        style="
                          display: inline-block;
                          padding: 13px 25px;
                          background: #2563eb;
                          color: white;
                          text-decoration: none;
                          border-radius: 7px;
                          font-weight: bold;
                        "
                      >
                        Review Application
                      </a>

                    </div>

                    <p
                      style="
                        margin-top: 30px;
                        color: #64748b;
                        font-size: 13px;
                      "
                    >
                      This is an automated notification
                      from the BOHECO II Leave Management
                      System.
                    </p>

                  </div>

                </div>

              </body>
            </html>
          `,
        }),
      }
    );

    const resendResult =
      await resendResponse.json();

    if (!resendResponse.ok) {
      console.error(
        "Resend error:",
        resendResult
      );

      throw new Error(
        resendResult?.message ||
          "Failed to send email"
      );
    }

    // -----------------------------------------
    // Success
    // -----------------------------------------
    return new Response(
      JSON.stringify({
        success: true,
        message:
          "Leave notification email sent successfully",
        recipient: approver.email,
        resend: resendResult,
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error(
      "Send leave email error:",
      error
    );

    return new Response(
      JSON.stringify({
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unknown error",
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});