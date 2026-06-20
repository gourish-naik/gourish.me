'use client'

import { useActionState } from 'react'
import { sendContactEmail, ContactResult } from '@/app/touch/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function ContactForm() {
  const [state, action, pending] = useActionState<ContactResult | null, FormData>(
    sendContactEmail,
    null
  )

  if (state?.success) {
    return (
      <div className='rounded-lg border border-green-500/30 bg-green-500/10 p-4 text-sm text-green-600 dark:text-green-400'>
        Message sent — I&apos;ll get back to you soon.
      </div>
    )
  }

  return (
    <form action={action} className='space-y-3'>
      <Input
        name='name'
        placeholder='Your name'
        required
        disabled={pending}
        className='bg-background'
      />
      <Input
        name='email'
        type='email'
        placeholder='your@email.com'
        required
        disabled={pending}
        className='bg-background'
      />
      <textarea
        name='message'
        placeholder='What are you working on?'
        required
        disabled={pending}
        rows={4}
        className='w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50'
      />
      {state && !state.success && (
        <p className='text-sm text-red-500'>{state.error}</p>
      )}
      <Button type='submit' disabled={pending} className='w-full'>
        {pending ? 'Sending…' : 'Send message'}
      </Button>
    </form>
  )
}
