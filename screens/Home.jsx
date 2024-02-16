import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState, useEffect } from "react";
import { Text, StyleSheet, View, Image, ScrollView, Pressable, FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { AntDesign, EvilIcons } from '@expo/vector-icons';

import ArtistCard from "../components/ArtistCard";
import RecentlyPlayedCard from "../components/RecentlyPlayedCard";
import RecentlyPlayedButton from "../components/RecentlyPlayedButton";


const styles = StyleSheet.create({
});

export default function Home() {
  const [userProfile, setUserProfile] = useState()
  const [recentlyplayed, setRecentlyPlayed] = useState([])
  const [recentlyplayedScroll, setRecentlyPlayedScroll] = useState([])
  const [topArtists, setTopArtists] = useState([])

  const navigation = useNavigation()

  const greetingMessage = () => {
    const currentTime = new Date().getHours()
    if (currentTime < 12) {
      return "Good Morning"
    } else if (currentTime < 16) {
      return "Good Afternoon"
    } else {
      return "Good Evening"
    }
  }
  const message = greetingMessage()

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

  useEffect(() => {
    getProfile()
  }, [])

  console.log(userProfile)
  const getRecentlyPlayedSongs = async () => {
    const accessToken = await AsyncStorage.getItem("token")
    try {
      const response = await axios({
        method: "GET",
        url: "https://api.spotify.com/v1/me/player/recently-played?limit=4",
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
      })

      const tracks = response.data.items
      setRecentlyPlayed(tracks)

    } catch (error) {
      console.log(error);
    }
  }
  const getRecentlyPlayedSongsScroll = async () => {
    const accessToken = await AsyncStorage.getItem("token")
    try {
      const response = await axios({
        method: "GET",
        url: "https://api.spotify.com/v1/me/player/recently-played?limit=10",
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
      })

      const tracks = response.data.items
      setRecentlyPlayedScroll(tracks)

    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getRecentlyPlayedSongs()
    getRecentlyPlayedSongsScroll()
  }, [])
  const renderItem = ({ item }) => {
    return (
      <Pressable style={{
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        marginHorizontal: 10,
        marginVertical: 8,
        backgroundColor: "#282828",
        borderRadius: 4,
        elevation: 3
      }}>
        <Image style={{
          height: 55,
          width: 55
        }}
          source={{ uri: item.track.album.images[0].url }} />
        <View style={{
          flex: 1,
          marginHorizontal: 8,
          justifyContent: "center"
        }}>
          <Text numberOfLines={2} style={{
            fontSize: 13,
            fontWeight: "bold",
            color: "white"
          }}>{item.track.name}</Text>
        </View>
      </Pressable>
    )
  }
  useEffect(() => {
    const getTopItems = async () => {
      try {
        const accessToken = await AsyncStorage.getItem("token")
        if (!accessToken) {
          console.log("Access token not found");
          return
        }
        const type = "artists"
        const response = await axios.get(`https://api.spotify.com/v1/me/top/${type}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        setTopArtists(response.data.items)

      } catch (error) {
        console.log(error.message);
      }
    }

    getTopItems()
  }, [])
  console.log(recentlyplayed);
  return (
    <LinearGradient colors={["#040306", "#131624"]} style={{ flex: 1 }}>
      <ScrollView style={{ marginTop: 50 }}>
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
            <Text style={{
              marginLeft: 10,
              fontSize: 20,
              fontWeight: "bold",
              color: "white"
            }}>{message}
            </Text>
          </View>

          <Pressable onPress={() => navigation.navigate("Config")}>
            <EvilIcons name="gear" size={26} color="white" />
          </Pressable>

        </View>

        <View style={{
          marginHorizontal: 12,
          marginVertical: 5,
          flexDirection: "row",
          alignItems: "center"
        }}>
          <Pressable style={{
            backgroundColor: "#282828",
            padding: 10,
            borderRadius: 30
          }}>
            <Text style={{
              fontSize: 15,
              color: "white"
            }}> Music </Text>
          </Pressable>

          <Pressable style={{
            backgroundColor: "#282828",
            padding: 10,
            borderRadius: 30
          }}>
            <Text style={{
              fontSize: 15,
              color: "white"
            }}> Podcast & Shows </Text>
          </Pressable>
        </View>

        <View style={{
          height: 10
        }} />

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between"
          }}>
          <Pressable
            onPress={() => navigation.navigate("Liked")}
            style={{
              marginBottom: 10,
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
              flex: 1,
              marginHorizontal: 10,
              marginVertical: 8,
              backgroundColor: "#202020",
              borderRadius: 4,
              elevation: 3
            }}>
            <LinearGradient colors={["#FF004D", "black"]}>
              <Pressable style={{
                width: 55,
                height: 55,
                justifyContent: "center",
                alignItems: "center"
              }}>
                <AntDesign name="heart" size={24} color="black" />
              </Pressable>
            </LinearGradient>

            <Text style={{
              color: "white",
              fontSize: 13,
              fontWeight: "bold"
            }}>Liked songs</Text>
          </Pressable>

          <View style={{
            marginBottom: 10,
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            flex: 1,
            marginHorizontal: 10,
            marginVertical: 8,
            backgroundColor: "#202020",
            borderRadius: 4,
            elevation: 3
          }}>
            <Image style={{
              width: 55,
              height: 55
            }}
              source={{ uri: "https://random.imagecdn.app/500/150" }} />
            <View style={styles.randomArtist} />
            <Text style={{
              color: "white",
              fontSize: 13,
              fontWeight: "bold"
            }} > Cool </Text>
          </View>
        </View>
        <FlatList
          data={recentlyplayed}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: "space-between" }}
          renderItem={({ item, index }) => <RecentlyPlayedButton item={item} key={index} />} />


        <Text style={{
          color: "white",
          fontSize: 19,
          fontWeight: "bold",
          marginHorizontal: 10,
          marginTop: 10
        }}>Your Top Artists</Text>

        <ScrollView horizontal
          showHorizontalScrollIndicator={false}>
          {topArtists.map((item, index) => (
            <ArtistCard istCard item={item} key={index} />
          ))}
        </ScrollView>

        <View style={{ height: 10 }} />
        <Text style={{
          color: "white",
          fontSize: 19,
          fontWeight: "bold",
          marginHorizontal: 10,
          marginTop: 10
        }}>
          Recently Played</Text>

        <FlatList
          data={recentlyplayedScroll}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item, index }) => <RecentlyPlayedCard item={item} key={index} />} />
      </ScrollView>
    </LinearGradient >

  );
}
