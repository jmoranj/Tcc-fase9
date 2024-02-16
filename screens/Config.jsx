import axios from "axios";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image, View, Text, Pressable, ScrollView, Linking } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";

import { Ionicons, MaterialIcons } from '@expo/vector-icons';


export default function Config() {

  const [userProfile, setUserProfile] = useState()

  const navigation = useNavigation()

  const getProfile = async () => {
    const accessToken = await AsyncStorage.getItem("token")
    try {
      const response = await axios("https://api.spotify.com/v1/me", {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      setUserProfile(response.data)
    } catch (error) {
      console.error(error.message);
    }
  }

  const handlePress = () => {
    Linking.openURL("https://github.com/jmoranj/Tcc-fase9").catch((err) =>
      console.log(err))
  }

  useEffect(() => {
    getProfile()
  }, [])
  console.log(userProfile)


  return (
    <LinearGradient colors={["#040306", "#131624"]} style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1, marginTop: 50 }}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={{
            marginHorizontal: 10,
            marginVertical: 10
          }}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </Pressable>
        <View style={{
          padding: 10,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between"
        }}>
          <View style={{
            flexDirection: "row",
            alignItems: "center"
          }}>
            <Image style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              marginLeft: 10,
              resizeMode: "cover"
            }}
              source={{ uri: userProfile?.images[0]?.url }}
            />

            <View>
              <Text style={{
                marginLeft: 10,
                fontSize: 18,
                fontWeight: "bold",
                color: "white"
              }}>{userProfile?.display_name}
              </Text>
              <Text style={{
                marginLeft: 10,
                fontSize: 16,
                fontWeight: "bold",
                color: "grey"
              }}>{userProfile?.email}
              </Text>
            </View>
          </View>
        </View>

        <View style={{ marginHorizontal: 20, marginTop: 30, gap: 10 }}>

          <Pressable onPress={handlePress}
            style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <Text style={{
              marginLeft: 10,
              fontSize: 18,
              fontWeight: "bold",
              color: "white"
            }}>Github</Text>

            <MaterialIcons name="keyboard-arrow-right" size={24} color="white" />
          </Pressable>
        </View>

      </ScrollView >
    </LinearGradient>

  )
}