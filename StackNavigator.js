import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { Entypo } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';

import Home from "./screens/Home";
import Profile from "./screens/Profile";
import Login from "./screens/Login";
import LikedSongs from "./screens/LikedSongs";
import SongInfo from "./screens/SongInfo";
import Config from "./screens/Config";
import ArtistInfo from "./screens/ArtistInfo";
import AlbumInfo from "./screens/AlbumInfo";
import Playlists from "./screens/Playlists";

const Tab = createBottomTabNavigator();

function BottomTabs() {
  return (
    <Tab.Navigator screenOptions={{
      tabBarStyle: {
        backgroundColor: "rgba(0,0,0,0.5)",
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        shadowOpacity: 4,
        shadowRadius: 4,
        elevation: 4,
        shadowOffset: {
          width: 0,
          height: -4
        },
        borderTopWidth: 0

      }
    }}>
      <Tab.Screen
        name="HomeScreen"
        component={Home}
        options={{
          tabBarLabel: "Home",
          headerShown: false,
          tabBarLabelStyle: { color: "white" },
          tabBarIcon: ({ focused }) =>
            focused ? (
              <Entypo name="home" size={24} color="white" />
            ) : (
              <AntDesign name="home" size={24} color="white" />
            )
        }}
      />
      <Tab.Screen
        name="ProfileScreen"
        component={Profile}
        options={{
          tabBarLabel: "Profile",
          headerShown: false,
          tabBarLabelStyle: { color: "white" },
          tabBarIcon: ({ focused }) =>
            focused ? (
              <Ionicons name="person" size={24} color="white" />
            ) : (
              <Ionicons name="person-outline" size={24} color="white" />
            )
        }}
      />
    </Tab.Navigator>
  )
}

const Stack = createNativeStackNavigator();

export default function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="LoginScreen" component={Login} options={{ headerShown: false }} />
        <Stack.Screen name="Main" component={BottomTabs} options={{ headerShown: false }} />
        <Stack.Screen name="Liked" component={LikedSongs} options={{ headerShown: false }} />
        <Stack.Screen name="SongInfo" component={SongInfo} options={{ headerShown: false }} />
        <Stack.Screen name="Config" component={Config} options={{ headerShown: false }} />
        <Stack.Screen name="Artist" component={ArtistInfo} options={{ headerShown: false }} />
        <Stack.Screen name="AlbumInfo" component={AlbumInfo} options={{ headerShown: false }} />
        <Stack.Screen name="Playlists" component={Playlists} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}