import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'react-native';

// Import screens
import SplashScreen from './screens/SplashScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import SignInScreen from './screens/SignInScreen';
import SignUpScreen from './screens/SignUpScreen';
import VerificationScreen from './screens/VerificationScreen';
import BrowseScreen from './screens/BrowseScreen';
import MainScreen from './screens/MainScreen';
import ClubEventsScreen from './screens/ClubEventsScreen';
import ClubDetailScreen from './screens/ClubDetailScreen';
import ProfileEditScreen from './screens/ProfileEditScreen';
import NotificationsScreen from './screens/NotificationsScreen';
import TonightsVibeScreen from './screens/TonightsVibeScreen';

const Stack = createStackNavigator();

function App(): React.JSX.Element {
    return (
        <>
            <StatusBar barStyle="light-content" />
            <NavigationContainer>
                <Stack.Navigator
                    initialRouteName="Welcome"
                    screenOptions={{
                        headerShown: false,
                    }}>
                    <Stack.Screen name="Welcome" component={WelcomeScreen} />
                    <Stack.Screen name="Splash" component={SplashScreen} />
                    <Stack.Screen name="SignIn" component={SignInScreen} />
                    <Stack.Screen name="SignUp" component={SignUpScreen} />
                    <Stack.Screen name="Verification" component={VerificationScreen} />
                    <Stack.Screen name="Browse" component={BrowseScreen} />
                    <Stack.Screen name="Profile" component={MainScreen} />
                    <Stack.Screen
                        name="ClubDetail"
                        component={ClubDetailScreen}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="ClubEvents"
                        component={ClubEventsScreen}
                        options={{ headerShown: true, title: 'Events' }}
                    />
                    <Stack.Screen
                        name="ProfileEdit"
                        component={ProfileEditScreen}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="Notifications"
                        component={NotificationsScreen}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="TonightsVibe"
                        component={TonightsVibeScreen}
                        options={{ headerShown: false }}
                    />
                </Stack.Navigator>
            </NavigationContainer>
        </>
    );
}

export default App;
