import * as React from 'react';
import {Button, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Tours from './src/screens/Tours';
import Live from './src/screens/Live';
import Create from './src/screens/Create';
import UserType from './src/screens/UserType';

const Stack = createStackNavigator();

const MyStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="UserType" component={UserType} />
      <Stack.Screen
        name="Home"
        component={Tours}
        options={({navigation, route}) => ({
          headerRight: () => (
            <View style={{marginRight: 15}}>
              <Button
                onPress={() => navigation.navigate('Create')}
                title="+"
                color="black"
              />
            </View>
          ),
        })}
      />
      <Stack.Screen name="Live" component={Live} />
      <Stack.Screen name="Create" component={Create} />
    </Stack.Navigator>
  );
};
export default function App() {
  return (
    <NavigationContainer>
      <MyStack />
    </NavigationContainer>
  );
}
