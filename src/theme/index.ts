import colors from './colors';
import spacing from './spacing';
import typography from './typography';

export const theme = {
  colors,
  spacing,
  typography,
  radius: {
    sm: 6,
    md: 10,
    lg: 14,
  },
  shadow: {
    sm: { elevation: 1 },
    md: { elevation: 3 },
  },
};

export type Theme = typeof theme;

export default theme;
