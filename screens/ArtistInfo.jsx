import { View, ScrollView, Image, Text, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";

import { Ionicons } from '@expo/vector-icons';

export default function ArtistInfo({ route }) {

  const navigation = useNavigation();

  const { artistId, artistImage } = route.params;

  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    async function fetchSongs() {
      const accessToken = await AsyncStorage.getItem("token")
      try {
        const response = await fetch(`https://api.spotify.com/v1/artists/${artistId}/albums`, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        })

        if (!response) {
          throw new Error("falha no fetch dos albums")
        }

        const data = await response.json();
        const albums = data.items;
        setAlbums(albums);

      } catch (error) {
        console.log(error.message);
      }
    }
    fetchSongs();
  }, [artistId])
  console.log(albums);

  return (
    <LinearGradient colors={["#2D3047", "black"]} style={{ flex: 1 }}>
      <ScrollView style={{ marginTop: 50 }}>

        <View style={{ flexDirection: "row", padding: 12 }}>
          <Ionicons
            onPress={() => navigation.goBack()}
            name="arrow-back" size={24} color="white" />
        </View>

        <View style={{ flex: 1, alignItems: "center" }}>
          {artistImage && (
            <Image style={{ width: 200, height: 200 }}
              source={{ uri: artistImage }} />
          )}

        </View>

        <View style={{
          flexDirection: "column",
          alignItems: "center",
          marginTop: 10,
          gap: 7
        }}>
          <Text style={{ color: "white", fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
            {albums.length > 0 && albums[0].artists.map(artist => artist.name).join(", ")}
          </Text>

          <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>
            Discography
          </Text>
        </View>

        <View>
          <View >
            {albums?.map((album, index) => (

              <Pressable onPress={() => {
                navigation.navigate("AlbumInfo", {
                  item: album
                })
              }}
                style={{ marginVertical: 10, flexDirection: "row", alignItems: "center" }}>

                <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 10, paddingVertical: 5 }}>
                  {album?.images && album.images.length > 0 && (
                    <Image style={{ width: 50, height: 50, marginRight: 10 }} source={{ uri: album.images[0]?.url }} />
                  )}

                  <Text style={{ fontSize: 16, fontWeight: "bold", color: "white", width: 320 }}>
                    {album?.name}
                  </Text>

                </View>
              </Pressable>
            ))}
          </View>
        </View>

      </ScrollView>
    </LinearGradient>
  )
}