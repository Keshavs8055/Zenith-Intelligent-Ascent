export interface NavItem {
  label: string;
  href: string;
  icon?: string; // lucide-react key name
  requiresAuth?: boolean;
}

export interface QuoteOfTheDay {
  text: string;
  author?: string;
  relatedTaskId?: string;
}
