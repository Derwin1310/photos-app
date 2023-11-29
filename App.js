import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { SafeAreaView, StyleSheet, StatusBar } from 'react-native';
import { Home, PhotosList } from './src/views';
import { NavigationContainer } from '@react-navigation/native';
import { TabNavigator } from "./src/routes/TabNavigator";
import { AppContext } from "./src/context/store";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const Stack = createNativeStackNavigator();

export default function App() {
  const { Navigator, Screen } = Stack

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppContext>
        <SafeAreaView style={styles.safeAreaView}>
        <StatusBar hidden={false} backgroundColor="#000" translucent={true} />
          <NavigationContainer>
            <Navigator
              initialRouteName="Home"
              screenOptions={{ headerShown: false }}
            >
              <Screen name="Home" component={Home} />
              <Screen name="PhotosList" component={PhotosList} />
              <Screen name="TabNavigator" component={TabNavigator} />
            </Navigator>
          </NavigationContainer>
        </SafeAreaView>
      </AppContext>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  safeAreaView: {
		flex: 1,
		marginTop: StatusBar.currentHeight,
	}
});
