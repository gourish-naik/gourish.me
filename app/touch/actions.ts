'use server'

export type ContactResult = { success: true } | { success: false; error: string }

function emailTemplate(name: string, email: string, message: string): string {
  const escaped = message.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>')
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Message received</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="padding-bottom:24px;text-align:center;">
              <span style="font-size:13px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:#71717a;">
                gourish.me
              </span>
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td style="background:#ffffff;border-radius:12px;padding:36px 40px;box-shadow:0 1px 3px rgba(0,0,0,0.07);">

              <!-- Greeting -->
              <p style="margin:0 0 6px;font-size:22px;font-weight:700;color:#18181b;">
                Hey ${name} 👋
              </p>
              <p style="margin:0 0 28px;font-size:15px;color:#52525b;line-height:1.6;">
                Got your message — I&rsquo;ll get back to you shortly. Here&rsquo;s a copy of what you sent:
              </p>

              <!-- Message block -->
              <div style="background:#f9f9fb;border-left:3px solid #a1a1aa;border-radius:4px;padding:16px 20px;margin-bottom:28px;">
                <p style="margin:0;font-size:14px;color:#3f3f46;line-height:1.7;">${escaped}</p>
              </div>

              <!-- Divider -->
              <hr style="border:none;border-top:1px solid #e4e4e7;margin:0 0 28px;" />

              <!-- Links row -->
              <p style="margin:0 0 16px;font-size:13px;font-weight:500;color:#71717a;text-transform:uppercase;letter-spacing:0.08em;">
                While you wait
              </p>
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding-right:12px;">
                    <a href="https://igourish.in" style="display:inline-block;background:#18181b;color:#ffffff;text-decoration:none;font-size:13px;font-weight:500;padding:10px 20px;border-radius:6px;">
                      Portfolio →
                    </a>
                  </td>
                  <td>
                    <a href="https://igourish.in/blogs" style="display:inline-block;background:#f4f4f5;color:#18181b;text-decoration:none;font-size:13px;font-weight:500;padding:10px 20px;border-radius:6px;border:1px solid #e4e4e7;">
                      Blog →
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding-top:20px;text-align:center;">
              <p style="margin:0;font-size:12px;color:#a1a1aa;">
                This email was sent because you filled in the contact form at
                <a href="https://gourish.me/touch" style="color:#a1a1aa;">gourish.me/touch</a>.
                <br />Reply directly to this email to reach Gourishankar.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

export async function sendContactEmail(
  _prev: ContactResult | null,
  formData: FormData
): Promise<ContactResult> {
  const name = formData.get('name')?.toString().trim()
  const email = formData.get('email')?.toString().trim()
  const message = formData.get('message')?.toString().trim()

  if (!name || !email || !message) {
    return { success: false, error: 'All fields are required.' }
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return { success: false, error: 'Please enter a valid email address.' }
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.FROM_EMAIL,
        to: [email],
        reply_to: 'm.gourishankarnaik@gmail.com',
        subject: `Got your message, ${name} 👋`,
        html: emailTemplate(name, email, message),
      }),
    })

    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      console.error('Resend error:', body)
      return { success: false, error: 'Failed to send message. Please try again.' }
    }

    return { success: true }
  } catch (err) {
    console.error('Contact form error:', err)
    return { success: false, error: 'Something went wrong. Please email me directly.' }
  }
}
