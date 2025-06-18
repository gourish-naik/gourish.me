import { getRequestConfig } from 'next-intl/server'
import { cookies } from 'next/headers'

export default getRequestConfig(async () => {
  const cookieLocale = (await cookies()).get('INEXT_LOCALE')?.value || 'en'
  const locale = cookieLocale;

  console.log(locale,"locale")
  return {
    locale,
    messages: (await import(`../locales/${locale}.json`)).default
  }
})
