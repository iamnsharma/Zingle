export type ReportReason =
  | 'fake'
  | 'harassment'
  | 'spam'
  | 'inappropriate'
  | 'other';

export const REPORT_REASONS: Array<{
  id: ReportReason;
  label: string;
  icon: string;
}> = [
  { id: 'fake', label: 'Fake profile', icon: 'account-off-outline' },
  { id: 'harassment', label: 'Harassment', icon: 'alert-outline' },
  { id: 'spam', label: 'Spam', icon: 'message-alert-outline' },
  { id: 'inappropriate', label: 'Inappropriate content', icon: 'eye-off-outline' },
  { id: 'other', label: 'Other', icon: 'dots-horizontal' },
];

export const HELP_FAQS = [
  {
    question: 'How do likes and matches work?',
    answer:
      'Swipe right to like, left to pass. If they like you back, it’s a match and you can chat.',
  },
  {
    question: 'How do I report or block someone?',
    answer:
      'Open their profile or chat, tap the menu, then choose Report or Block.',
  },
  {
    question: 'How do I delete my account?',
    answer: 'Go to Profile → Settings → Delete account. This cannot be undone.',
  },
];

export const LEGAL_DOCUMENTS = {
  terms: {
    title: 'Terms of Service',
    body: 'By using Zingle you agree to use the app respectfully, be 18 or older, and not harass other members. We may suspend accounts that break these rules.',
  },
  privacy: {
    title: 'Privacy Policy',
    body: 'Zingle collects the profile details you provide (name, age, photos, bio, city) to help you meet people nearby. You can delete your account at any time from Settings.',
  },
  guidelines: {
    title: 'Community Guidelines',
    body: 'Be yourself, be kind, and keep it legal. No fake profiles, hate, spam, or explicit content. Report anything that makes you uncomfortable.',
  },
} as const;

export type LegalDocumentId = keyof typeof LEGAL_DOCUMENTS;
