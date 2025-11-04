import { NextRequest, NextResponse } from 'next/server';
import { Resend, type CreateEmailOptions } from 'resend';
import validator from 'validator';
import { features, RESUME_URL } from '../../../config/features';
import { ResumeEmail } from '../../../components/emails/resume-email';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const { name, email } = await req.json();

  if (!name || !email) {
    return NextResponse.json({ error: 'Name and email are required.' }, { status: 400 });
  }

  if (!validator.isEmail(email)) {
    return NextResponse.json({ error: 'Invalid email format.' }, { status: 400 });
  }

  try {
    const sendOptions: CreateEmailOptions = {
      from: process.env.FROM_EMAIL!,
      to: email,
      bcc: process.env.BCC_EMAIL,
      subject: 'Here is my resume',
      react: (
        <ResumeEmail
          name={name}
          isAttachment={features.IS_ATTACHMENT_ENABLED}
          resumeUrl={RESUME_URL}
        />
      ),
    };

    if (features.IS_ATTACHMENT_ENABLED) {
      // In a real app, you would fetch the actual resume file here.
      // For now, we will use a placeholder attachment.
      const resumeContent = Buffer.from('This is a placeholder for the resume PDF.');
      sendOptions.attachments = [
        {
          filename: 'resume.pdf',
          content: resumeContent,
        },
      ];
    }

    const { data, error } = await resend.emails.send(sendOptions);

    if (error) {
      console.error('Resend API returned an error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Email sent successfully!', data });

  } catch (error) {
    console.error('Caught an exception in API route:', error);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}
