import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { Resend } from "npm:resend@4.0.0";

const resendApiKey = Deno.env.get("RESEND_API_KEY");
const toAddress = Deno.env.get("CONSULTATION_REQUEST_TO") ?? "cleanaudits@nick-efe-oni.dev";
const fromAddress = Deno.env.get("CONSULTATION_REQUEST_FROM") ?? "CleanAudits <demo@yourdomain.com>";

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!resendApiKey || !toAddress) {
    return new Response(JSON.stringify({ error: "Email service not configured" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  let body: {
    name?: string;
    email?: string;
    company?: string;
    role?: string;
    goals?: string;
  };

  try {
    body = await req.json();
  } catch (_err) {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { name, email, company, role, goals } = body;
  const formattedGoals = goals ? goals.replace(/\n/g, "<br>") : "—";

  if (!name || !email || !company || !role || !goals) {
    return new Response(JSON.stringify({ error: "Name, email, company, role, and goals are required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const resend = new Resend(resendApiKey);

  try {
    await resend.emails.send({
      from: fromAddress,
      to: [toAddress],
      reply_to: email,
      subject: "Attention Request for a Consultation",
      html: `
        <div style="margin:0;padding:0;background:#F7F8FA;">
          <table align="center" width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width:720px;margin:0 auto;padding:32px 18px;font-family:'Helvetica Neue',Arial,sans-serif;">
            <tr>
              <td>
                <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#FFFFFF;border:1px solid #E0E3E7;border-radius:16px;overflow:hidden;box-shadow:0 12px 28px rgba(12,17,22,0.08);">
                  <tr>
                    <td style="padding:20px 22px;border-bottom:1px solid #E0E3E7;background:linear-gradient(135deg,#FFFFFF 0%,#F3F5F8 50%,#FFFFFF 100%);">
                      <p style="margin:0;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#546E7A;">Consultation Intake</p>
                      <p style="margin:6px 0 0;font-size:22px;font-weight:700;letter-spacing:0.3px;color:#000000;">
                        <span style="color:#C8A951;font-weight:900;">Clean</span><span style="color:#1C2A3A;font-weight:900;">Audits</span> Request
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:22px 24px;color:#1B1B1B;">
                      <p style="margin:0 0 14px;font-size:15px;letter-spacing:0.1px;color:#1B1B1B;">
                        <span>A new live Q&A consultation was requested through the </span>
                        <span style="color:#C8A951;font-weight:900;">Clean</span><span style="color:#1C2A3A;font-weight:900;">Audits</span>
                        <span> site.</span>
                      </p>
                      <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:separate;border-spacing:0 12px;font-size:14px;">
                        <tr>
                          <td style="width:120px;color:#546E7A;font-weight:700;letter-spacing:0.2px;">Name</td>
                          <td style="color:#1B1B1B;font-size:15px;">${name}</td>
                        </tr>
                        <tr>
                          <td style="width:120px;color:#546E7A;font-weight:700;letter-spacing:0.2px;">Email</td>
                          <td style="color:#1B1B1B;font-size:15px;">${email.toLowerCase()}</td>
                        </tr>
                        <tr>
                          <td style="width:120px;color:#546E7A;font-weight:700;letter-spacing:0.2px;">Company</td>
                          <td style="color:#1B1B1B;font-size:15px;">${company.charAt(0).toUpperCase()}${company.substring(1).toLowerCase()}</td>
                        </tr>
                        <tr>
                          <td style="width:120px;color:#546E7A;font-weight:700;letter-spacing:0.2px;">Role</td>
                          <td style="color:#1B1B1B;font-size:15px;">${role.charAt(0).toUpperCase()}${role.substring(1).toLowerCase()}</td>
                        </tr>
                        <tr>
                          <td style="vertical-align:top;color:#546E7A;font-weight:700;letter-spacing:0.2px;">Goals</td>
                          <td style="color:#1B1B1B;font-size:15px;line-height:1.6;">${formattedGoals}</td>
                        </tr>
                      </table>
                      <p style="margin:16px 0 0;font-size:12px;color:#546E7A;text-transform:uppercase;letter-spacing:1.1px;">Sent automatically from CleanAudits</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </div>
      `,
    });

    await resend.emails.send({
      from: fromAddress,
      to: [email],
      subject: "We received your consultation request",
      html: `
        <div style="margin:0;padding:0;background:#F7F8FA;">
          <table align="center" width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width:720px;margin:0 auto;padding:32px 18px;font-family:'Helvetica Neue',Arial,sans-serif;">
            <tr>
              <td>
                <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#FFFFFF;border:1px solid #E0E3E7;border-radius:16px;overflow:hidden;box-shadow:0 12px 28px rgba(12,17,22,0.08);">
                  <tr>
                    <td style="padding:20px 22px;border-bottom:1px solid #E0E3E7;background:linear-gradient(135deg,#FFFFFF 0%,#F3F5F8 50%,#FFFFFF 100%);">
                      <p style="margin:0;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#546E7A;">We received your request</p>
                      <p style="margin:6px 0 0;font-size:22px;font-weight:700;letter-spacing:0.3px;color:#000000;">
                        <span style="color:#C8A951;font-weight:900;">Clean</span><span style="color:#1C2A3A;font-weight:900;">Audits</span>
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:22px 24px;color:#1B1B1B;">
                      <p style="margin:0 0 14px;font-size:16px;">Hi ${name},</p>
                      <p style="margin:0 0 18px;font-size:15px;line-height:1.6;">
                        <span>Thanks for requesting a live Q&A consultation with </span>
                        <span style="color:#C8A951;font-weight:900;">Clean</span><span style="color:#1C2A3A;font-weight:900;">Audits</span>
                        <span>. We’ve received your details and our team will contact you soon to schedule it.</span>
                      </p>
                      <div style="margin:18px 0;padding:16px 18px;background:#F7F8FA;border:1px solid #E0E3E7;border-radius:12px;">
                        <p style="margin:0 0 12px;font-size:15px;font-weight:800;color:#1C2A3A;">Your details</p>
                        <p style="margin:0 0 10px;font-size:13px;color:#546E7A;text-transform:uppercase;letter-spacing:0.6px;">Email<br/><span style="display:block;margin-top:4px;color:#1B1B1B;font-size:15px;">${email.toLowerCase()}</span></p>
                        <p style="margin:0 0 10px;font-size:13px;color:#546E7A;text-transform:uppercase;letter-spacing:0.6px;">Company<br/><span style="display:block;margin-top:4px;color:#1B1B1B;font-size:15px;">${company.charAt(0).toUpperCase()}${company.substring(1).toLowerCase()}</span></p>
                        <p style="margin:0 0 10px;font-size:13px;color:#546E7A;text-transform:uppercase;letter-spacing:0.6px;">Role<br/><span style="display:block;margin-top:4px;color:#1B1B1B;font-size:15px;">${role.charAt(0).toUpperCase()}${role.substring(1).toLowerCase()}</span></p>
                        <p style="margin:0;font-size:13px;color:#546E7A;text-transform:uppercase;letter-spacing:0.6px;">Goals<br/><span style="display:block;margin-top:4px;color:#1B1B1B;font-size:15px;line-height:1.6;">${formattedGoals}</span></p>
                      </div>
                      <p style="margin:12px 0 0;font-size:16px;font-weight:800;color:#1C2A3A;">Talk soon,<br/><span style="color:#C8A951;">The CleanAudits Team</span></p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </div>
      `,
    });

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("send-qna-request error", err);
    return new Response(JSON.stringify({ error: "Failed to send" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
