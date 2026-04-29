import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { DrawerActions } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import ScreenContainer from '@components/ui/ScreenContainer';
import AppHeader from '@components/layout/AppHeader';
import AppInput from '@components/ui/AppInput';
import AppLoader from '@components/ui/AppLoader';
import EmptyState from '@components/ui/EmptyState';
import { BorrowerCard } from '@components/borrowers';
import { useAuth } from '@context/AuthContext';
import borrowerService from '@services/borrowerService';
import { BorrowersStackParamList } from '@src/types/navigation';
import { BorrowerSummary } from '@src/models';
import theme from '@theme';

type Props = NativeStackScreenProps<BorrowersStackParamList, 'BorrowersList'>;

const BorrowersScreen: React.FC<Props> = ({ navigation }) => {
  const { user } = useAuth();
  const [borrowers, setBorrowers] = useState<BorrowerSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');

  const loadBorrowers = async () => {
    if (!user?.uid) {
      setBorrowers([]);
      setLoading(false);
      return;
    }

    try {
      const items = await borrowerService.getBorrowersByUserWithSummary(user.uid);
      setBorrowers(items);
    } catch (error) {
      console.error('Failed to load borrowers:', error);
      setBorrowers([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    void loadBorrowers();
  }, [user?.uid]);

  const filteredBorrowers = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) {
      return borrowers;
    }

    return borrowers.filter((borrower) => {
      return (
        borrower.fullName.toLowerCase().includes(term) ||
        borrower.phoneNumber.toLowerCase().includes(term)
      );
    });
  }, [borrowers, search]);

  if (loading) {
    return <AppLoader />;
  }

  return (
    <View style={styles.flex}>
      <AppHeader
        title="Borrowers"
        onMenuPress={() => navigation.getParent()?.dispatch(DrawerActions.openDrawer())}
        actions={[
          {
            icon: 'person-add',
            onPress: () => navigation.getParent()?.getParent()?.navigate('AddBorrower' as never),
            accessibilityLabel: 'Add new borrower',
          },
        ]}
      />

      <ScreenContainer style={styles.container}>
        <AppInput
          placeholder="Search by name or phone"
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />

        {filteredBorrowers.length === 0 ? (
          <EmptyState
            title={search ? 'No matching borrowers' : 'No borrowers yet'}
            subtitle={search ? 'Try a different name or phone number.' : 'Start by creating a borrower and loan.'}
          />
        ) : (
          <FlatList
            data={filteredBorrowers}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <BorrowerCard
                borrower={item}
                onPress={() => navigation.navigate('BorrowerDetails', { borrowerId: item.id })}
              />
            )}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => {
                  setRefreshing(true);
                  void loadBorrowers();
                }}
              />
            }
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}
      </ScreenContainer>
    </View>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    flex: 1,
    paddingTop: theme.spacing.md,
  },
  searchInput: {
    marginBottom: theme.spacing.md,
  },
  listContent: {
    paddingBottom: theme.spacing.xl,
  },
});

export default BorrowersScreen;
