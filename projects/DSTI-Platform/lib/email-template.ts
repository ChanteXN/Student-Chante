export function getMagicLinkEmailHtml(url: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sign in to DSTI R&D Platform</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: linear-gradient(135deg, #EFF6FF 0%, #FFFFFF 50%, #F3E8FF 100%); min-height: 100vh;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="min-height: 100vh;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; background: white; border-radius: 24px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04); overflow: hidden;">
          
          <!-- Header with Gradient -->
          <tr>
            <td style="background: linear-gradient(135deg, #2563EB 0%, #7C3AED 100%); padding: 40px 40px 50px; text-align: center; position: relative;">
              <div style="background: rgba(255, 255, 255, 0.1); width: 200px; height: 200px; border-radius: 50%; position: absolute; top: -100px; right: -100px; backdrop-filter: blur(10px);"></div>
              <div style="background: rgba(255, 255, 255, 0.1); width: 150px; height: 150px; border-radius: 50%; position: absolute; bottom: -75px; left: -75px; backdrop-filter: blur(10px);"></div>
              
              <!-- Logo -->
              <div style="position: relative; z-index: 1;">
                <div style="width: 80px; height: 80px; background: rgba(255, 255, 255, 0.2); backdrop-filter: blur(10px); border: 3px solid rgba(255, 255, 255, 0.3); border-radius: 20px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 20px; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/>
                    <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/>
                    <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/>
                    <path d="M10 6h4"/>
                    <path d="M10 10h4"/>
                    <path d="M10 14h4"/>
                    <path d="M10 18h4"/>
                  </svg>
                </div>
                <h1 style="margin: 0; color: white; font-size: 28px; font-weight: 700; text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
                  DSTI R&D Platform
                </h1>
                <p style="margin: 8px 0 0; color: rgba(255, 255, 255, 0.9); font-size: 14px;">
                  Department of Science, Technology and Innovation
                </p>
              </div>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 50px 40px;">
              <!-- Welcome Badge -->
              <div style="text-align: center; margin-bottom: 30px;">
                <span style="display: inline-flex; align-items: center; gap: 8px; padding: 8px 16px; background: #DBEAFE; color: #1E40AF; border-radius: 20px; font-size: 13px; font-weight: 600;">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                  </svg>
                  Secure Magic Link
                </span>
              </div>

              <h2 style="margin: 0 0 16px; color: #111827; font-size: 24px; font-weight: 700; text-align: center;">
                Sign in to Your Account
              </h2>
              
              <p style="margin: 0 0 32px; color: #6B7280; font-size: 16px; line-height: 1.6; text-align: center;">
                Click the button below to securely sign in to the DSTI R&D Platform. This link will expire in <strong style="color: #111827;">24 hours</strong>.
              </p>

              <!-- CTA Button -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td align="center" style="padding: 0 0 32px;">
                    <a href="${url}" style="display: inline-block; padding: 16px 48px; background: linear-gradient(135deg, #2563EB 0%, #7C3AED 100%); color: white; text-decoration: none; border-radius: 12px; font-size: 16px; font-weight: 600; box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.3), 0 4px 6px -2px rgba(37, 99, 235, 0.2); transition: all 0.3s ease;">
                      Sign In to Platform
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Alternative Link -->
              <div style="background: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 12px; padding: 20px; margin-bottom: 32px;">
                <p style="margin: 0 0 12px; color: #6B7280; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                  Or copy this link:
                </p>
                <p style="margin: 0; color: #2563EB; font-size: 14px; word-break: break-all; font-family: 'Courier New', monospace; background: white; padding: 12px; border-radius: 8px; border: 1px solid #DBEAFE;">
                  ${url}
                </p>
              </div>

              <!-- Security Notice -->
              <div style="background: linear-gradient(135deg, #DBEAFE 0%, #E0E7FF 100%); border-left: 4px solid #2563EB; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
                <div style="display: flex; align-items: flex-start; gap: 12px;">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563EB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0; margin-top: 2px;">
                    <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  <div>
                    <p style="margin: 0 0 4px; color: #1E40AF; font-size: 14px; font-weight: 600;">
                      Security Note
                    </p>
                    <p style="margin: 0; color: #3B82F6; font-size: 13px; line-height: 1.5;">
                      This link can only be used once and will expire after 24 hours. Never share this link with anyone.
                    </p>
                  </div>
                </div>
              </div>

              <!-- Help Text -->
              <p style="margin: 0; color: #9CA3AF; font-size: 13px; text-align: center; line-height: 1.5;">
                If you didn't request this email, you can safely ignore it. No account will be created without clicking the link above.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background: #F9FAFB; padding: 30px 40px; border-top: 1px solid #E5E7EB;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td style="text-align: center; padding-bottom: 16px;">
                    <p style="margin: 0 0 4px; color: #111827; font-size: 14px; font-weight: 600;">
                      Need Help?
                    </p>
                    <p style="margin: 0; color: #6B7280; font-size: 13px;">
                      Contact us at 
                      <a href="mailto:support@dsti.gov.za" style="color: #2563EB; text-decoration: none; font-weight: 600;">
                        support@dsti.gov.za
                      </a>
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="text-align: center; padding-top: 16px; border-top: 1px solid #E5E7EB;">
                    <p style="margin: 0 0 8px; color: #9CA3AF; font-size: 12px;">
                      © 2026 Department of Science, Technology and Innovation
                    </p>
                    <p style="margin: 0; color: #9CA3AF; font-size: 12px;">
                      All rights reserved. This is an automated message.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

export function getMagicLinkEmailText(url: string): string {
  return `
Sign in to DSTI R&D Platform

Click the link below to securely sign in to your account:

${url}

This link will expire in 24 hours and can only be used once.

If you didn't request this email, you can safely ignore it.

---

Need help? Contact us at support@dsti.gov.za

© 2026 Department of Science, Technology and Innovation
All rights reserved.
  `.trim();
}
