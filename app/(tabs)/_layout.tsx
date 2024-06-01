  import { Tabs } from 'expo-router';
  import React from 'react';

  import { TabBarIcon } from '@/components/navigation/TabBarIcon';
  import { Colors } from '@/constants/Colors';
  import { useColorScheme } from '@/hooks/useColorScheme';

  export default function TabLayout() {
    const colorScheme = useColorScheme();

    return (
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          headerShown: false,
        }}>
        <Tabs.Screen
          name="clans"
          options={{
            headerShown: false,
            title: 'Clans',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'people' : 'people-outline'} color='goldenrod' />
            ),
          }}
        />
        <Tabs.Screen
          name="index"
          options={{
            headerShown: false,
            title: 'Collect',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'game-controller' : 'game-controller-outline'} color='goldenrod' />
            ),
          }}
        />
        <Tabs.Screen
          name="leaderboard"
          options={{
            headerShown: false,
            title: 'Leaderboard',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'trophy' : 'trophy-outline'} color='goldenrod' />
            ),
          }}
        />
      </Tabs>
    );
  }
