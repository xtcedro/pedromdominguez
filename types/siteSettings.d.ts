// /types/siteSettings.d.ts

export interface SiteSettings {
  hero_headline: string;
  contact_email: string;
  business_phone: string;
  footer_text?: string;
  primary_color?: string;
  secondary_color?: string;
  about_us_text?: string;
  facebook_url?: string;
  instagram_url?: string;
  twitter_url?: string;
  tracking_code?: string;
}

export interface SiteSettingsInput {
  heroHeadline: string;
  contactEmail: string;
  businessPhone: string;
  footerText?: string;
  primaryColor?: string;
  secondaryColor?: string;
  aboutUsText?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  twitterUrl?: string;
  trackingCode?: string;
}