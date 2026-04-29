import React from 'react';
import { View, StyleSheet, Linking } from 'react-native';
import AppText from '@components/ui/AppText';
import AppButton from '@components/ui/AppButton';
import ScreenContainer from '@components/ui/ScreenContainer';
import theme from '@theme';

const ConfigErrorScreen: React.FC = () => {
  return (
    <ScreenContainer style={styles.container}>
      <View style={styles.content}>
        <AppText variant="h1" style={styles.title}>
          Configuration Missing
        </AppText>
        <AppText variant="body" style={styles.subtitle}>
          The app is missing required environment variables (Firebase Keys). 
          This usually happens if Expo Secrets are not configured in the dashboard.
        </AppText>
        
        <View style={styles.instructionBox}>
          <AppText style={styles.instructionTitle}>How to fix:</AppText>
          <AppText style={styles.instructionStep}>1. Go to Expo Dashboard → Settings → Secrets</AppText>
          <AppText style={styles.instructionStep}>2. Add EXPO_PUBLIC_FIREBASE_API_KEY and others</AppText>
          <AppText style={styles.instructionStep}>3. Trigger a new build</AppText>
        </View>

        <AppButton 
          title="Open Expo Dashboard" 
          onPress={() => Linking.openURL('https://expo.dev')}
          style={styles.button}
        />
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  content: {
    padding: theme.spacing.xl,
    alignItems: 'center',
  },
  title: {
    marginBottom: theme.spacing.md,
    color: theme.colors.danger,
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
    color: theme.colors.muted,
  },
  instructionBox: {
    width: '100%',
    padding: theme.spacing.md,
    backgroundColor: '#f1f5f9',
    borderRadius: theme.radius.md,
    marginBottom: theme.spacing.xl,
  },
  instructionTitle: {
    fontWeight: 'bold',
    marginBottom: theme.spacing.sm,
  },
  instructionStep: {
    fontSize: 14,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  button: {
    width: '100%',
  },
});

export default ConfigErrorScreen;
