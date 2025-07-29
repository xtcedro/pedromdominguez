// /types/dashboard.d.ts

export interface DashboardLink {
  label: string;
  link: string;
}

export interface DashboardOverview {
  welcomeMessage: string;
  contentSections: DashboardLink[];
  systemTools: DashboardLink[];
  userManagement: DashboardLink[];
  aboutSection: DashboardLink[];
  communityLinks: DashboardLink[];
}