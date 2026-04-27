/* eslint-disable @typescript-eslint/no-explicit-any */
declare module 'expo-constants' {
  const Constants: any;
  export default Constants;
}

declare module 'react/jsx-runtime' {
  export function jsx(...args: any[]): any;
  export function jsxs(...args: any[]): any;
  export function jsxDEV(...args: any[]): any;
}

declare module '@theme' {
  import theme from '../theme';
  export default theme;
}

declare module '@navigation' {
  const nav: any;
  export default nav;
}
