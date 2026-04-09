/**
 * Payment details for the registry page (Venmo and Cash App). Zelle uses the QR code on the Registry page only.
 */
export const registryPayments = {
  venmo: {
    profileUrl: 'https://venmo.com/u/kassi-avery',
    /** Shown on the button */
    handle: '@Kassi-Avery',
  },
  cashApp: {
    profileUrl: 'https://cash.app/$djfriar',
    cashtag: '$djfriar',
  },
} as const
