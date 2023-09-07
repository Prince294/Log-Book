import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from './components/Screens/HomeScreen';
import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import SuccessScreen from './components/Screens/SuccessScreen';
import { StatusBar } from 'react-native';
import * as Updates from 'expo-updates';
import { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();
export default function App() {

  useEffect(() => {
    onFetchUpdateAsync()
  }, [])


  async function onFetchUpdateAsync() {
    try {
      const update = await Updates.checkForUpdateAsync();

      if (update.isAvailable) {
        await Updates.fetchUpdateAsync();
        await Updates.reloadAsync();
      }
    } catch (error) {
    }
  }

  return (
    <NavigationContainer>
      <StatusBar
        animated={true}
        backgroundColor="black"
        barStyle={'light-content'}
      />

      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Success"
          component={SuccessScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>

    </NavigationContainer>
  );
}
