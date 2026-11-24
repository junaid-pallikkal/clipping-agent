/**
 * Type-safe environment variable access with fallbacks for development.
 */

export const env = {
  appName: import.meta.env.VITE_APP_NAME || 'CLIPGENIUS AI',
  appUrl: import.meta.env.VITE_APP_URL || 'http://localhost:5173',
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL || 'https://rwutjjbagtwrazuecosx.supabase.co',
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_JpKXkjgA320O0DHoJ19hFA_62WhOiKC',
  },
  stripe: {
    publishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '',
    prices: {
      creator: import.meta.env.VITE_STRIPE_PRICE_CREATOR || '',
      pro: import.meta.env.VITE_STRIPE_PRICE_PRO || '',
      agency: import.meta.env.VITE_STRIPE_PRICE_AGENCY || '',
    },
  },
} as const;
