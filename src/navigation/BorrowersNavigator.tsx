import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BorrowersStackParamList } from '@src/types/navigation';
import BorrowersScreen from '@screens/home/BorrowersScreen';
import BorrowerDetailScreen from '@screens/home/BorrowerDetailScreen';
import LoanDetailScreen from '@screens/home/LoanDetailScreen';

const BorrowersStack = createNativeStackNavigator<BorrowersStackParamList>();

const BorrowersNavigator: React.FC = () => {
  return (
    <BorrowersStack.Navigator id="BorrowersStack" screenOptions={{ headerShown: false }}>
      <BorrowersStack.Screen name="BorrowersList" component={BorrowersScreen} />
      <BorrowersStack.Screen name="BorrowerDetails" component={BorrowerDetailScreen} />
      <BorrowersStack.Screen name="LoanDetails" component={LoanDetailScreen} />
    </BorrowersStack.Navigator>
  );
};

export default BorrowersNavigator;
