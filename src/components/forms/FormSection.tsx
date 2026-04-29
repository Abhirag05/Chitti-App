import React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';
import AppCard from '@components/ui/AppCard';
import AppText from '@components/ui/AppText';
import theme from '@theme';

type Props = ViewProps & {
  title: string;
  description?: string;
};

const FormSection: React.FC<Props> = ({ title, description, children, style, ...rest }) => {
  return (
    <AppCard style={[styles.card, style]} {...rest}>
      <View style={styles.header}>
        <AppText variant="h3" style={styles.title}>
          {title}
        </AppText>
        {description ? (
          <AppText variant="small" style={styles.description}>
            {description}
          </AppText>
        ) : null}
      </View>
      {children}
    </AppCard>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: theme.spacing.md,
  },
  header: {
    marginBottom: theme.spacing.md,
  },
  title: {
    marginBottom: theme.spacing.xxs,
  },
  description: {
    color: theme.colors.muted,
    lineHeight: 18,
  },
});

export default FormSection;
