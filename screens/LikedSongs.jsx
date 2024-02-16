import { LinearGradient } from "expo-linear-gradient";
import React, { useState, useEffect, useContext, useRef } from "react";
import { StyleSheet, View, Text, ScrollView, Pressable, TextInput, FlatList, Image, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ModalContent, BottomModal } from "react-native-modals";
import { Audio } from "expo-av";
import { debounce } from "lodash";

import SongItem from "../components/SongItem";
import { Player } from "../Player";

import { Ionicons, AntDesign, Entypo, Feather, FontAwesome } from '@expo/vector-icons';

const styles = StyleSheet.create({
  progressBar: {
    height: "100%",
    backgroundColor: "white",
  }
})

export default function LikedSongs() {

  const navigation = useNavigation();

  const { currentTrack, setCurrentTrack } = useContext(Player);

  const value = useRef(0);

  const [input, setInput] = useState("");
  const [savedTracks, setSavedTracks] = useState([]);
  const [searchedTracks, setSearchedTracks] = useState([])
  const [currentSound, setCurrentSound] = useState(null);
  const [progress, setProgress] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);


  async function getSavedTracks() {
    const accessToken = await AsyncStorage.getItem("token");
    const response = await fetch("https://api.spotify.com/v1/me/tracks?offset=0&limit=50",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        params: {
          limit: 50,
        }
      }
    )

    if (!response.ok) {
      throw new Error("failed to fetch the tracks")
    }
    const data = await response.json();
    setSavedTracks(data.items);
  }

  useEffect(() => {
    getSavedTracks()
  }, [])

  const playTrack = async () => {
    if (savedTracks.length > 0) {
      setCurrentTrack(savedTracks[0])
    }
    await play(savedTracks[0])
  }
  console.log(savedTracks);
  const play = async (nextTrack) => {
    console.log(nextTrack);
    const previewUrl = nextTrack?.track?.preview_url;
    try {
      if (currentSound) {
        await currentSound.stopAsync();
      }

      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        shouldDuckAndroid: false
      })
      const { sound, status } = await Audio.Sound.createAsync({
        uri: previewUrl
      },
        {
          shouldPlay: true, isLooping: false
        },
        onPlaybackStatusUpdate,
      )
      onPlaybackStatusUpdate(status)
      setCurrentSound(sound)
      setIsPlaying(status.isLoaded)
      await sound.playAsync()

    } catch (error) {
      console.log(error.message);
    }
  }
  const onPlaybackStatusUpdate = async (status) => {
    console.log(status);
    if (status.isLoaded && status.isPlaying) {
      const progress = status.positionMillis / status.durationMillis;

      console.log("progress", progress);

      setProgress(progress)
      setCurrentTime(status.positionMillis);
      setTotalDuration(status.durationMillis);
    }

    if (status.didJustFinish === true) {
      setCurrentSound(null);
      playNextTrack();
    }
  }

  const circleSize = 12
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    return `${minutes} : ${seconds < 10 ? "0" : ""} ${seconds}`
  }

  const handlePlayPause = async () => {
    if (currentSound) {
      if (isPlaying) {
        await currentSound.pauseAsync();
      } else {
        await currentSound.playAsync();
      }
      setIsPlaying(!isPlaying);
    }
  }

  const playNextTrack = async () => {
    if (currentSound) {
      await currentSound.stopAsync();
      setCurrentSound(null);
    }
    value.current += 1;
    if (value.current < savedTracks.length) {
      const nextTrack = savedTracks[value.current];
      setCurrentTrack(nextTrack)

      await play(nextTrack);
    } else {
      console.log("end of playlist");
    }
  }

  const playPreviousTrack = async () => {
    if (currentSound) {
      await currentSound.stopAsync();
      setCurrentSound(null);
    }
    value.current -= 1;
    if (value.current < savedTracks.length) {
      const nextTrack = savedTracks[value.current];
      setCurrentTrack(nextTrack)

      await play(nextTrack);
    } else {
      console.log("end of playlist");
    }
  }

  const debouncedSearch = debounce(handleSearch, 800)
  function handleSearch(text) {
    const filteredTracks = savedTracks.filter((item) =>
      item.track.name.toLowerCase().includes(text.toLowerCase())
    )
    setSearchedTracks(filteredTracks);
  }

  const handleInputChange = (text) => {
    setInput(text);
    debouncedSearch(text)
  }

  useEffect(() => {
    if (savedTracks.length > 0) {
      handleSearch(input)
    }
  }, [savedTracks])

  return (
    <>
      <LinearGradient colors={["#735290", "black"]} style={{ flex: 1 }}>
        <ScrollView style={{ flex: 1, marginTop: 40 }}>
          <Pressable
            onPress={() => navigation.goBack()}
            style={{
              marginHorizontal: 10,
              marginVertical: 15
            }}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </Pressable>

          <Pressable
            style={{
              marginHorizontal: 10,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: 9
            }}>
            <Pressable
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                backgroundColor: "#42275a",
                padding: 9,
                flex: 1,
                borderRadius: 3,
                height: 38
              }}>
              <AntDesign name="search1"
                size={20} color="white" />
              <TextInput
                value={input}
                onChangeText={(text) => handleInputChange(text)}
                placeholder="Find in Liked songs"
                placeholderTextColor={"white"}
                style={{ fontWeight: "500", color: "white" }}
              />
            </Pressable>
            <Pressable
              style={{
                marginHorizontal: 10,
                backgroundColor: "#42275a",
                padding: 10,
                borderRadius: 3,
                height: 38
              }}>
              <Text style={{ color: "white" }}>Sort</Text>
            </Pressable>
          </Pressable>
          <View style={{ height: 50 }} />

          <View style={{ marginHorizontal: 40 }}>
            <Text style={{ fontSize: 18, fontWeight: "bold", color: "white" }}>Liked songs</Text>
          </View>

          <Pressable
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-end",
              marginHorizontal: 10
            }}>

            <View style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 10
            }}>
              <Pressable
                onPress={playTrack}
                style={{
                  marginHorizontal: 12,
                  marginTop: 15,
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                <Entypo name="controller-play" size={30} color="black" />
              </Pressable>

            </View>
          </Pressable>

          {searchedTracks.length === 0 ? (
            <ActivityIndicator size="large" color="gray" />
          ) : (
            <FlatList
              showsVerticalScrollIndicator={false}
              data={searchedTracks}
              renderItem={({ item }) => (
                <SongItem
                  item={item}
                  onPress={play}
                  isPlaying={item === currentTrack}
                />
              )}
            />
          )}

        </ScrollView>
      </LinearGradient>

      {currentTrack && (
        <Pressable
          onPress={() => setModalVisible(!modalVisible)}
          style={{
            backgroundColor: "#DDA0DD",
            width: "90%",
            padding: 10,
            marginLeft: "auto",
            marginRight: "auto",
            marginBottom: 15,
            position: "absolute",
            borderRadius: 6,
            left: 20,
            bottom: 10,
            justifyContent: "space-between",
            flexDirection: "row",
            alignItems: "center",
            gap: 10
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 10
            }}>
            <Image
              style={{ width: 40, height: 40 }}
              source={{ uri: currentTrack?.track?.album?.images[0].url }} />

            <Text numberOfLines={1} style={{
              fontSize: 13,
              width: 220,
              color: "white",
              fontWeight: "bold"
            }}>
              {currentTrack?.track?.name}  • {" "}
              {currentTrack?.track?.artists[0].name}
            </Text>
          </View>

          <View style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 8
          }}>
            <AntDesign name="heart" size={20} color="#FF114D" />
            <Pressable onPress={handlePlayPause}>
              {isPlaying ? (
                <AntDesign name="pause" size={24} color="black" />
              ) : (
                <Entypo name="controller-play" size={24} color="black" />
              )}
            </Pressable>
          </View>
        </Pressable>
      )}

      <BottomModal visible={modalVisible}
        onHarwereBackPress={() => setModalVisible(false)}
        swipeDirection={["up", "down"]}
        swipeThreshold={200}>

        <ModalContent
          style={{
            height: "100%",
            width: "100%",
            backgroundColor: "#DDA0DD"
          }}>

          <View style={{ height: "100%", width: "100%", marginTop: 40 }}>
            <Pressable
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between"
              }}>
              <AntDesign onPress={() => setModalVisible(!modalVisible)}
                name="down" size={24} color="black" />

              <Text
                style={{
                  fontSize: 13,
                  fontWeight: "bold"
                }}>{currentTrack?.track?.name}</Text>

            </Pressable>

            <View style={{ height: 70 }} />

            <View style={{
              padding: 10
            }}>

              <Image style={{ width: "100%", height: 330, borderRadius: 4 }}
                source={{ uri: currentTrack?.track?.album?.images[0].url }} />

              <View style={{
                marginTop: 20,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between"
              }}>
                <View>
                  <Text style={{ fontSize: 18, fontWeight: "bold" }}>{currentTrack?.track?.name}</Text>
                  <Text style={{ color: "#333", marginTop: 4 }}>{currentTrack?.track?.artists[0].name}</Text>
                </View>

                <AntDesign name="heart" size={24} color="#FF114D" />
              </View>

              <View style={{
                marginTop: 10
              }}>
                <View style={{
                  width: "100%",
                  marginTop: 10,
                  height: 3,
                  backgroundColor: "grey",
                  borderRadius: 5
                }}>
                  <View
                    style={[styles.progressBar,
                    { width: `${progress * 100}%` }]} />
                  <View style={[
                    {
                      position: "absolute",
                      top: -5,
                      width: circleSize,
                      height: circleSize,
                      borderRadius: circleSize / 2,
                      backgroundColor: "white"
                    },
                    {
                      left: `${progress * 100}%`,
                      marginLeft: - circleSize / 2
                    }
                  ]} />
                </View>

                <View
                  style={{
                    marginTop: 12,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between"
                  }}>
                  <Text style={{ fontSize: 15 }}>
                    {formatTime(currentTime)}
                  </Text>
                  <Text style={{ fontSize: 15 }}>
                    {formatTime(totalDuration)}
                  </Text>
                </View>
              </View>
              <View style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: 17
              }}>
                <Pressable>
                  <FontAwesome name="random" size={30} color="black" />
                </Pressable>

                <Pressable onPress={playPreviousTrack}>
                  <Ionicons name="play-skip-back-sharp" size={30} color="black" />
                </Pressable>

                <Pressable onPress={handlePlayPause}>
                  {isPlaying ? (
                    <AntDesign name="pause" size={50} color="black" />
                  ) : (
                    <Entypo name="controller-play" size={50} color="black" />
                  )}
                </Pressable>

                <Pressable onPress={playNextTrack}>
                  <Ionicons name="play-skip-forward" size={30} color="black" />
                </Pressable>

                <Pressable>
                  <Feather name="repeat" size={30} color="black" />
                </Pressable>

              </View>
            </View>
          </View>
        </ModalContent>
      </BottomModal >
    </>
  )
}