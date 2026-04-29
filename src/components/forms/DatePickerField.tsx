import React, { useMemo, useState } from 'react';
import { Modal, Platform, Pressable, StyleSheet, View } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import AppText from '@components/ui/AppText';
import theme from '@theme';

type Props = {
  label?: string;
  value: Date;
  onChange: (value: Date) => void;
  minimumDate?: Date;
  maximumDate?: Date;
  error?: string;
};

const formatDate = (date: Date): string =>
  new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);

const DatePickerField: React.FC<Props> = ({
  label,
  value,
  onChange,
  minimumDate,
  maximumDate,
  error,
}) => {
  const [visible, setVisible] = useState(false);
  const [draftDate, setDraftDate] = useState(value);

  const displayValue = useMemo(() => formatDate(value), [value]);

  const openPicker = () => {
    if (Platform.OS === 'android') {
      setVisible(true);
    } else {
      setDraftDate(value);
      setVisible(true);
    }
  };

  const closePicker = () => setVisible(false);

  const handleChange = (event: DateTimePickerEvent, nextDate?: Date) => {
    if (Platform.OS === 'android') {
      setVisible(false);
      if (event.type === 'set' && nextDate) {
        onChange(nextDate);
      }
    } else {
      if (nextDate) {
        setDraftDate(nextDate);
      }
    }
  };

  const handleConfirm = () => {
    onChange(draftDate);
    closePicker();
  };

  return (
    <View style={styles.container}>
      {label ? (
        <AppText variant="small" style={styles.label}>
          {label}
        </AppText>
      ) : null}

      <Pressable style={styles.field} onPress={openPicker} accessibilityRole="button">
        <AppText style={styles.value}>{displayValue}</AppText>
      </Pressable>

      {error ? <AppText variant="small" style={styles.error}>{error}</AppText> : null}

      {Platform.OS === 'ios' ? (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={closePicker}>
          <Pressable style={styles.modalBackdrop} onPress={closePicker}>
            <Pressable style={styles.modalCard} onPress={() => undefined}>
              <AppText variant="h3" style={styles.modalTitle}>
                Select Date
              </AppText>
              <DateTimePicker
                value={draftDate}
                mode="date"
                display="spinner"
                minimumDate={minimumDate}
                maximumDate={maximumDate}
                onChange={handleChange}
              />
              <Pressable style={styles.confirmButton} onPress={handleConfirm}>
                <AppText style={styles.confirmText}>Done</AppText>
              </Pressable>
            </Pressable>
          </Pressable>
        </Modal>
      ) : (
        visible && (
          <DateTimePicker
            value={value}
            mode="date"
            display="default"
            minimumDate={minimumDate}
            maximumDate={maximumDate}
            onChange={handleChange}
          />
        )
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.sm,
  },
  label: {
    marginBottom: theme.spacing.xxs,
  },
  field: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: theme.radius.sm,
    paddingHorizontal: theme.spacing.sm,
    justifyContent: 'center',
    backgroundColor: theme.colors.surface,
  },
  value: {
    color: theme.colors.text,
  },
  error: {
    marginTop: theme.spacing.xxs,
    color: theme.colors.danger,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    justifyContent: 'center',
    padding: theme.spacing.md,
  },
  modalCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
  },
  modalTitle: {
    marginBottom: theme.spacing.sm,
  },
  confirmButton: {
    marginTop: theme.spacing.sm,
    backgroundColor: theme.colors.accent,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.md,
    alignItems: 'center',
  },
  confirmText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default DatePickerField;
