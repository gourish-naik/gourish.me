'use client'

import { useActionState, useEffect, useRef, useState } from 'react'
import { sendContactEmail, ContactResult } from '@/app/touch/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function ContactForm() {
  const [state, action, pending] = useActionState<ContactResult | null, FormData>(
    sendContactEmail,
    null
  )
  const formRef = useRef<HTMLFormElement>(null)
  const [showBanner, setShowBanner] = useState(false)
  const [fading, setFading] = useState(false)

  useEffect(() => {
    if (!state?.success) return
    formRef.current?.reset()
    setShowBanner(true)
    setFading(false)
    const t1 = setTimeout(() => setFading(true), 3800)
    const t2 = setTimeout(() => setShowBanner(false), 5000)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [state])

  return (
    <div className='space-y-3'>
      {/* Success banner — fades after 5s, form stays and resets */}
      {showBanner && (
        <div
          style={{ opacity: fading ? 0 : 1, transition: 'opacity 1.2s ease' }}
          className='rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-3'
        >
          <p className='text-sm font-medium text-green-600 dark:text-green-400'>
            Message sent — I&apos;ll get back to you soon.
          </p>
          <p className='mt-1 text-xs text-muted-foreground/70'>
            jk — if that email address has a typo, this confirmation isn&apos;t reaching you 👀 double-check it.
          </p>
        </div>
      )}

      <form ref={formRef} action={action} className='space-y-3'>
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
    </div>
  )
}
