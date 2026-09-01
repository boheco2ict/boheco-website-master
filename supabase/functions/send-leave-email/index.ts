import nodemailer from "npm:nodemailer@7.0.5";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  // -----------------------------------------
  // Handle CORS preflight
  // -----------------------------------------
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders,
    });
  }

  try {
    // -----------------------------------------
    // Environment variables
    // -----------------------------------------
    const smtpUser = Deno.env.get("SMTP_USER");
    const smtpPassword = Deno.env.get("SMTP_PASSWORD");

    if (!smtpUser || !smtpPassword) {
      throw new Error(
        "SMTP_USER or SMTP_PASSWORD is not configured"
      );
    }

    // -----------------------------------------
    // Nodemailer transporter
    // -----------------------------------------
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: smtpUser,
        pass: smtpPassword,
      },
    });

    // -----------------------------------------
    // Get data from request
    // -----------------------------------------
    const { myDepartment, application, origin, approverEmail, myName } = await req.json();
    
    if (!myDepartment) {
      return new Response(
        JSON.stringify({
          error: "myDepartment is required",
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

    if (!application) {
      return new Response(
        JSON.stringify({
          error: "application is required",
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

    if (!approverEmail || (Array.isArray(approverEmail) && approverEmail.length === 0)) {
      return new Response(
        JSON.stringify({
          error: "At least one approver email is required",
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

    if (!myName) {
      return new Response(
        JSON.stringify({
          error: "myName is required",
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

    if (!origin) {
      return new Response(
        JSON.stringify({
          error: "origin is required",
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
    const emailRecipients = Array.isArray(approverEmail) ? approverEmail : [approverEmail];

    // -----------------------------------------
    // Review URL
    // -----------------------------------------
    const domain = origin || "http://localhost:3000";
    const reviewUrl = `${domain}/review-application/${application.id}`;

    // -----------------------------------------
    // Email HTML
    // -----------------------------------------

    const formatDate = (date) => {
    if (!date) return "N/A";
      const [year, month, day] = date.split("-");
      const formattedDate = new Date(
        Number(year),
        Number(month) - 1,
        Number(day)
      );

      return formattedDate.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    };

    const emailHtml = `
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
                    ${myName}
                  </td>
                </tr>

                <tr>
                  <td
                    style="
                      padding: 8px 0;
                      font-weight: bold;
                    "
                  >
                    Employee ID
                  </td>

                  <td style="padding: 8px 0;">
                    ${application.employee_id ?? "N/A"}
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
                    ${myDepartment ?? "N/A"}
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
                    ${formatDate(application.start_date)}
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
                    ${formatDate(application.end_date)}
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
    `;

    // -----------------------------------------
    // Send email through Nodemailer
    // -----------------------------------------
    const emailResult = await transporter.sendMail({
      from: `"BOHECO II Leave System" <${smtpUser}>`,
      to: emailRecipients,
      subject: `New Leave Application - ${myName}`,
      html: emailHtml,
    });
    console.log("Email Sent Successfully: ", emailResult.messageId);

    // -----------------------------------------
    // Success
    // -----------------------------------------
    return new Response(
      JSON.stringify({
        success: true,
        message:
          "Leave notification email sent successfully",
        recipient: emailRecipients,
        messageId: emailResult.messageId,
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