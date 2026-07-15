import React, { useState } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Text } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import { useAuthStore } from './src/store/useAuthStore'
import { colors } from './src/theme/colors'

import { SplashScreen }      from './src/screens/SplashScreen'
import { WelcomeScreen }     from './src/screens/WelcomeScreen'
import { RoleSelectScreen }  from './src/screens/RoleSelectScreen'
import { LoginScreen }       from './src/screens/auth/LoginScreen'
import { RegisterScreen }    from './src/screens/auth/RegisterScreen'
import { HomeScreen }        from './src/screens/parent/HomeScreen'
import { ActivitiesScreen }  from './src/screens/parent/ActivitiesScreen'
import { ProgressScreen }    from './src/screens/parent/ProgressScreen'
import { PlanScreen }        from './src/screens/parent/PlanScreen'
import { ReferralsScreen }   from './src/screens/doctor/ReferralsScreen'
import { CasesScreen }       from './src/screens/doctor/CasesScreen'
import StedScreeningScreen   from './src/screens/doctor/StedScreeningScreen'
import StedResultScreen      from './src/screens/doctor/StedResultScreen'

const Stack = createNativeStackNavigator()
const Tab   = createBottomTabNavigator()

function ParentTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.paper2,
          paddingBottom: 8,
          height: 64,
        },
        tabBarActiveTintColor: colors.green600,
        tabBarInactiveTintColor: colors.ink3,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        tabBarIcon: ({ color }) => {
          const icons: Record<string, string> = {
            Home: '🏠', Activities: '🎯', Progress: '📈', Plan: '📋',
          }
          return <Text style={{ fontSize: 20 }}>{icons[route.name]}</Text>
        },
      })}
    >
      <Tab.Screen name="Home"       component={HomeScreen} />
      <Tab.Screen name="Activities" component={ActivitiesScreen} />
      <Tab.Screen name="Progress"   component={ProgressScreen} />
      <Tab.Screen name="Plan"       component={PlanScreen} />
    </Tab.Navigator>
  )
}

function DoctorTabBar() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.paper2,
          paddingBottom: 8,
          height: 64,
        },
        tabBarActiveTintColor: colors.comm,
        tabBarInactiveTintColor: colors.ink3,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        tabBarIcon: ({ color }) => {
          const icons: Record<string, string> = { Referrals: '📋', Cases: '👶', Screen: '🔍' }
          return <Text style={{ fontSize: 20 }}>{icons[route.name]}</Text>
        },
      })}
    >
      <Tab.Screen name="Referrals"     component={ReferralsScreen} />
      <Tab.Screen name="Cases"         component={CasesScreen} />
      <Tab.Screen name="Screen"        component={StedScreeningScreen} options={{ title: 'STED Screen' }} />
    </Tab.Navigator>
  )
}

function DoctorTabs() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DoctorTabBar"   component={DoctorTabBar} />
      <Stack.Screen name="StedScreening"  component={StedScreeningScreen} />
      <Stack.Screen name="StedResult"     component={StedResultScreen} />
    </Stack.Navigator>
  )
}

function AuthStack() {
  const [showSplash, setShowSplash] = useState(true)

  if (showSplash) return <SplashScreen onDone={() => setShowSplash(false)} />

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome"    component={WelcomeScreen} />
      <Stack.Screen name="RoleSelect" component={RoleSelectScreen} />
      <Stack.Screen name="Login"      component={LoginScreen} />
      <Stack.Screen name="Register"   component={RegisterScreen} />
    </Stack.Navigator>
  )
}

export default function App() {
  const user = useAuthStore((s) => s.user)

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        {!user
          ? <AuthStack />
          : user.role === 'PARENT'
            ? <ParentTabs />
            : <DoctorTabs />
        }
      </NavigationContainer>
    </SafeAreaProvider>
  )
}
