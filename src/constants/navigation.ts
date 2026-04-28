import { MaterialIcons } from '@expo/vector-icons';
import { ComponentProps } from 'react';

/**
 * Icon name type from MaterialIcons
 */
type MaterialIconName = ComponentProps<typeof MaterialIcons>['name'];

/**
 * Route names for the app drawer navigation
 */
export const AppRoutes = {
  Dashboard: 'Dashboard',
  Borrowers: 'Borrowers',
  DueToday: 'DueToday',
  Overdue: 'Overdue',
  Upcoming: 'Upcoming',
  AddBorrower: 'AddBorrower',
  Settings: 'Settings',
} as const;

/**
 * Route names for auth stack
 */
export const AuthRoutes = {
  Login: 'Login',
  Register: 'Register',
  ForgotPassword: 'ForgotPassword',
} as const;

/**
 * Route names for nested stacks (future borrower/loan details)
 */
export const NestedRoutes = {
  BorrowerDetails: 'BorrowerDetails',
  LoanDetails: 'LoanDetails',
} as const;

export type AppRouteName = (typeof AppRoutes)[keyof typeof AppRoutes];
export type AuthRouteName = (typeof AuthRoutes)[keyof typeof AuthRoutes];

/**
 * Navigation menu item configuration
 */
export interface NavigationMenuItem {
  /** Route name used in navigation */
  route: AppRouteName;
  /** Display label shown in the drawer */
  label: string;
  /** MaterialIcons icon name */
  icon: MaterialIconName;
  /** Whether this item is a primary navigation item */
  isPrimary: boolean;
}

/**
 * Primary navigation menu items displayed in the drawer
 */
export const DRAWER_MENU_ITEMS: NavigationMenuItem[] = [
  {
    route: AppRoutes.Dashboard,
    label: 'Dashboard',
    icon: 'dashboard',
    isPrimary: true,
  },
  {
    route: AppRoutes.Borrowers,
    label: 'Borrowers',
    icon: 'people',
    isPrimary: true,
  },
  {
    route: AppRoutes.DueToday,
    label: 'Due Today',
    icon: 'today',
    isPrimary: true,
  },
  {
    route: AppRoutes.Overdue,
    label: 'Overdue',
    icon: 'warning',
    isPrimary: true,
  },
  {
    route: AppRoutes.Upcoming,
    label: 'Upcoming',
    icon: 'event',
    isPrimary: true,
  },
  {
    route: AppRoutes.AddBorrower,
    label: 'Add Borrower',
    icon: 'person-add',
    isPrimary: true,
  },
  {
    route: AppRoutes.Settings,
    label: 'Settings',
    icon: 'settings',
    isPrimary: false,
  },
];

/**
 * Get menu item by route name
 */
export const getMenuItemByRoute = (route: AppRouteName): NavigationMenuItem | undefined => {
  return DRAWER_MENU_ITEMS.find((item) => item.route === route);
};
