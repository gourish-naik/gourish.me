export function isRtlLocale(locale: string): boolean {
  // Add more RTL languages if needed (e.g., 'he' for Hebrew, 'fa' for Persian)
  return ['ar'].includes(locale.toLowerCase())
}

export function getLayoutDirection(locale: string): 'ltr' | 'rtl' {
  return isRtlLocale(locale) ? 'rtl' : 'ltr'
}
