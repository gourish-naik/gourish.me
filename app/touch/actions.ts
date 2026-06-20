'use server'

export type ContactResult = { success: true } | { success: false; error: string }

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
        to: [process.env.BCC_EMAIL],
        reply_to: email,
        subject: `Portfolio enquiry from ${name}`,
        html: `
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <hr />
          <p>${message.replace(/\n/g, '<br />')}</p>
        `,
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
