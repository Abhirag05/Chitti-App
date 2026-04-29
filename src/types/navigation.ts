import { DrawerNavigationProp } from '@react-navigation/drawer';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';

/**
 * Auth stack parameter list
 */
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

/**
 * App drawer parameter list
 */
export type AppDrawerParamList = {
  Dashboard: undefined;
  Borrowers: undefined;
  DueToday: undefined;
  Overdue: undefined;
  Upcoming: undefined;
  AddBorrower: undefined;
  Settings: undefined;
};

/**
 * Borrowers nested stack parameter list (for future use)
 */
export type BorrowersStackParamList = {
  BorrowersList: undefined;
  BorrowerDetails: { borrowerId: string };
  LoanDetails: { loanId: string; borrowerId: string };
  EditBorrower: { borrowerId: string };
  EditLoan: { loanId: string; borrowerId: string };
};

/**
 * Root navigator parameter list
 */
export type RootStackParamList = {
  Auth: undefined;
  App: undefined;
};

/**
 * Auth screen navigation props
 */
export type AuthScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList>;

/**
 * App drawer navigation prop
 */
export type AppDrawerNavigationProp = DrawerNavigationProp<AppDrawerParamList>;

/**
 * Borrowers stack navigation prop (for future use)
 */
export type BorrowersStackNavigationProp = NativeStackNavigationProp<BorrowersStackParamList>;

/**
 * Route prop helpers
 */
export type AppDrawerRouteProp<T extends keyof AppDrawerParamList> = RouteProp<AppDrawerParamList, T>;
export type BorrowersStackRouteProp<T extends keyof BorrowersStackParamList> = RouteProp<BorrowersStackParamList, T>;
