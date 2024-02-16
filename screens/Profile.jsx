import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import { Text, View, ScrollView, Image, Pressable } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

export default function Profile() {

  const navigation = useNavigation();

  const [userProfile, setUserProfile] = useState(null)
  const [playlists, setPlaylists] = useState([])
  const [tracks, setTracks] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = await AsyncStorage.getItem("token");
        const response = await axios.get("https://api.spotify.com/v1/me", {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        setUserProfile(response.data);

        const playlistsResponse = await axios.get("https://api.spotify.com/v1/me/playlists", {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        setPlaylists(playlistsResponse.data.items);

      } catch (error) {
        console.error("Erro ao obter perfil e playlists:", error.message);
      }
    };

    fetchData();
  }, []);
  console.log(playlists);

  return (

    <LinearGradient colors={["#040306", "#131624"]} style={{ flex: 1 }}>
      <ScrollView style={{ marginTop: 60 }}>
        <View style={{ padding: 12 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
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
              <Text style={{ color: "white", fontSize: 18, fontWeight: "bold" }}>{userProfile?.display_name}</Text>
              <Text style={{ color: "gray", fontSize: 16, fontWeight: "bold" }}>{userProfile?.email}</Text>
            </View>
          </View>

        </View>
        <Text style={{ color: "white", fontSize: 20, fontWeight: "500", marginHorizontal: 12 }}> Suas Playlists </Text>

        <View style={{ padding: 15 }}>
          {playlists.map((item, index) => (
            <Pressable
              key={item.id}
              onPress={() => {
                navigation.navigate("Playlists", {
                  item: item
                })
              }}
              style={{ flexDirection: "row", alignItems: "center", gap: 8, marginVertical: 10 }}>
              <Image source={{ uri: item?.images[0]?.url || "https://images.pexels.com/photos/3944091/pexels-photo-3944091.jpeg?auto=compress&cs=tinyrgb&w=800" }}
                style={{ width: 50, height: 50, borderRadius: 4 }} />
              <View>
                <Text style={{ color: "white" }}>{item?.name}</Text>
                <Text style={{ color: "gray", marginTop: 7 }}>0 followers</Text>
              </View>
            </Pressable>
          ))}
        </View>

      </ScrollView>
    </LinearGradient>

  )
}

