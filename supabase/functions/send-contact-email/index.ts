import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ContactEmailRequest {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, phone, message }: ContactEmailRequest = await req.json();

    console.log('Sending contact form notification email...');

    // Send notification email using Resend API
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: "Contact Form <onboarding@resend.dev>",
        to: ["bbtsurf@gmail.com"],
        subject: `New Contact Form Submission from ${name}`,
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
                <tr>
                  <td align="center">
                    <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
                      <!-- Header -->
                      <tr>
                        <td style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 40px 30px 40px; text-align: center;">
                          <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">
                            New Contact Inquiry
                          </h1>
                          <p style="margin: 10px 0 0 0; color: rgba(255, 255, 255, 0.9); font-size: 14px;">
                            Someone reached out through your website
                          </p>
                        </td>
                      </tr>
                      
                      <!-- Content -->
                      <tr>
                        <td style="padding: 40px;">
                          <!-- Contact Info Card -->
                          <div style="background-color: #f9fafb; border-left: 4px solid #10b981; padding: 24px; margin-bottom: 24px; border-radius: 8px;">
                            <h2 style="margin: 0 0 20px 0; color: #1f2937; font-size: 18px; font-weight: 600;">
                              Contact Information
                            </h2>
                            
                            <table width="100%" cellpadding="0" cellspacing="0">
                              <tr>
                                <td style="padding: 8px 0;">
                                  <span style="display: inline-block; width: 80px; color: #6b7280; font-size: 14px; font-weight: 500;">Name:</span>
                                  <span style="color: #1f2937; font-size: 14px; font-weight: 600;">${name}</span>
                                </td>
                              </tr>
                              <tr>
                                <td style="padding: 8px 0;">
                                  <span style="display: inline-block; width: 80px; color: #6b7280; font-size: 14px; font-weight: 500;">Email:</span>
                                  <a href="mailto:${email}" style="color: #10b981; font-size: 14px; font-weight: 600; text-decoration: none;">${email}</a>
                                </td>
                              </tr>
                              ${phone ? `
                              <tr>
                                <td style="padding: 8px 0;">
                                  <span style="display: inline-block; width: 80px; color: #6b7280; font-size: 14px; font-weight: 500;">Phone:</span>
                                  <a href="tel:${phone}" style="color: #10b981; font-size: 14px; font-weight: 600; text-decoration: none;">${phone}</a>
                                </td>
                              </tr>
                              ` : ''}
                            </table>
                          </div>
                          
                          <!-- Message Card -->
                          <div style="background-color: #ffffff; border: 1px solid #e5e7eb; padding: 24px; border-radius: 8px;">
                            <h2 style="margin: 0 0 16px 0; color: #1f2937; font-size: 18px; font-weight: 600;">
                              Message
                            </h2>
                            <div style="color: #374151; font-size: 15px; line-height: 1.6;">
                              ${message.replace(/\n/g, '<br>')}
                            </div>
                          </div>
                          
                          <!-- Quick Action Button -->
                          <div style="margin-top: 32px; text-align: center;">
                            <a href="mailto:${email}?subject=Re: Contact Form Inquiry" style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 14px; box-shadow: 0 2px 4px rgba(16, 185, 129, 0.3);">
                              Reply to ${name}
                            </a>
                          </div>
                        </td>
                      </tr>
                      
                      <!-- Footer -->
                      <tr>
                        <td style="background-color: #f9fafb; padding: 24px 40px; border-top: 1px solid #e5e7eb; text-align: center;">
                          <p style="margin: 0; color: #6b7280; font-size: 12px; line-height: 1.5;">
                            This message was sent via your website contact form<br>
                            <span style="color: #9ca3af;">${new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}</span>
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </body>
          </html>
        `,
      }),
    });

    const data = await emailResponse.json();

    if (!emailResponse.ok) {
      console.error('Resend API error:', data);
      throw new Error(data.message || 'Failed to send email');
    }

    console.log("Email sent successfully:", data);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-contact-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
