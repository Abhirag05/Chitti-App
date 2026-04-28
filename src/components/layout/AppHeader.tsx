import React from 'react';
import { View, StyleSheet, TouchableOpacity, ViewStyle, StyleProp } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppText from '@components/ui/AppText';
import theme from '@theme';

type ActionButton = {
  /** MaterialIcons icon name */
  icon: React.ComponentProps<typeof MaterialIcons>['name'];
  /** Callback when pressed */
  onPress: () => void;
  /** Optional accessibility label */
  accessibilityLabel?: string;
};

type Props = {
  /** Screen title displayed in the header */
  title: string;
  /** Callback for the menu toggle button */
  onMenuPress?: () => void;
  /** Optional action buttons on the right side */
  actions?: ActionButton[];
  /** Whether to show the menu toggle button */
  showMenuToggle?: boolean;
  /** Optional custom style */
  style?: StyleProp<ViewStyle>;
};

/**
 * AppHeader - Reusable page header with menu toggle and optional action buttons
 */
const AppHeader: React.FC<Props> = ({
  title,
  onMenuPress,
  actions = [],
  showMenuToggle = true,
  style,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + theme.spacing.xs }, style]}>
      <View style={styles.content}>
        {/* Left: Menu Toggle */}
        {showMenuToggle && onMenuPress ? (
          <TouchableOpacity
            style={styles.iconButton}
            onPress={onMenuPress}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessibilityLabel="Open navigation menu"
            accessibilityRole="button"
          >
            <MaterialIcons name="menu" size={24} color={theme.colors.text} />
          </TouchableOpacity>
        ) : (
          <View style={styles.iconButton} />
        )}

        {/* Center: Title */}
        <AppText variant="h3" style={styles.title} numberOfLines={1}>
          {title}
        </AppText>

        {/* Right: Actions */}
        <View style={styles.actions}>
          {actions.map((action, index) => (
            <TouchableOpacity
              key={index}
              style={styles.actionButton}
              onPress={action.onPress}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              accessibilityLabel={action.accessibilityLabel}
              accessibilityRole="button"
            >
              <MaterialIcons name={action.icon} size={22} color={theme.colors.text} />
            </TouchableOpacity>
          ))}
          {actions.length === 0 && <View style={styles.iconButton} />}
        </View>
      </View>

      {/* Bottom border */}
      <View style={styles.border} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.headerBackground,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
    minHeight: 48,
  },
  iconButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    flex: 1,
    textAlign: 'center',
    color: theme.colors.text,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: theme.spacing.xxs,
  },
  border: {
    height: 1,
    backgroundColor: theme.colors.headerBorder,
  },
});

export default AppHeader;
