export const APP_CONFIG = {
  name: 'CarHelper.ai',
  description: 'AI-Powered Automotive Diagnostics',
  url: process.env.NEXT_PUBLIC_APP_URL || 'https://carhelper.ai',
  supportEmail: 'support@carhelper.ai',
  version: '1.0.0',
} as const;

export const FEATURES = {
  FREE_DIAGNOSES_PER_DAY: 2,
  MAX_CONVERSATION_HISTORY: 10,
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
} as const;

export const SKILL_LEVELS = {
  beginner: {
    label: 'Beginner',
    description: 'I prefer simple explanations and basic checks'
  },
  diy: {
    label: 'DIY Enthusiast', 
    description: 'I have basic tools and like doing my own repairs'
  },
  pro: {
    label: 'Professional/Advanced',
    description: 'I want technical details and professional-level guidance'
  }
} as const;