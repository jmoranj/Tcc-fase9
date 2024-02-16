import { StyleSheet, View, ScrollView, Image, Text, Pressable } from "react-native";
import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ModalContent, BottomModal } from "react-native-modals";
import { LinearGradient } from "expo-linear-gradient";
import { Audio } from "expo-av";

import { Player } from "../Player";

import { Ionicons, AntDesign, Entypo, Feather, FontAwesome } from '@expo/vector-icons';

const styles = StyleSheet.create({
  progressBar: {
    height: "100%",
    backgroundColor: "white",
  },
  songContainer: {
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  songInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  textContainer: {
    flex: 1,
  },
  title: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  playingTitle: {
    color: "#735290",
    fontWeight: "bold",
    fontSize: 16,
  },
  artist: {
    marginTop: 4,
    color: "#989898",
  }
})

export default function SongInfo({ route: navigationRoute }) {

  const navigation = useNavigation();
  const route = useRoute(navigationRoute);

  const { item } = navigationRoute.params;

  const value = useRef(0);

  const { currentTrack, setCurrentTrack } = useContext(Player);

  const [tracks, setTracks] = useState([]);
  const [currentSound, setCurrentSound] = useState(null);
  const [progress, setProgress] = useState(null);
  const [currentPlayingIndex, setCurrentPlayingIndex] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const albumUrl = navigationRoute?.params?.item?.track?.album?.uri;
  const albumId = albumUrl ? albumUrl.split(":")[2] : null;

  useEffect(() => {
    async function fetchSongs() {
      const accessToken = await AsyncStorage.getItem("token")
      try {
        const response = await fetch(`https://api.spotify.com/v1/albums/${albumId}/tracks`, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        })

        if (!response) {
          throw new Error("falha no fetch dos albums")
        }

        const data = await response.json();
        const tracks = data.items;
        setTracks(tracks);

      } catch (error) {
        console.log(error.message);
      }
    }
    fetchSongs();
  }, [])
  console.log(tracks);

  const playTrack = async () => {
    if (tracks.length > 0) {
      setCurrentTrack(tracks[0])
    }
    await play(tracks[0])
  }
  console.log(tracks);

  const play = async (nextTrack, index) => {
    const previewUrl = nextTrack?.preview_url;
    try {

      if (currentSound) {
        await currentSound.stopAsync();
      }

      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        shouldDuckAndroid: false
      })

      const { sound, status } = await Audio.Sound.createAsync(
        { uri: previewUrl },
        { shouldPlay: true, isLooping: false },
        onPlaybackStatusUpdate,
      )
      setCurrentPlayingIndex(index);
      setCurrentTrack(nextTrack);
      onPlaybackStatusUpdate(status);
      setCurrentSound(sound);
      setIsPlaying(status.isLoaded);

      await sound.playAsync();

    } catch (error) {
      console.log(error.message);
    }
  }

  const onPlaybackStatusUpdate = async (status) => {
    console.log(status);
    if (status.isLoaded && status.isPlaying) {
      const progress = status.positionMillis / status.durationMillis;

      setProgress(progress)
      setCurrentTime(status.positionMillis);
      setTotalDuration(status.durationMillis);
    }

    if (status.didJustFinish) {
      setCurrentSound(null);
      playNextTrack();
    }
  }

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
    if (value.current < tracks.length - 1) {
      value.current += 1;
      const nextTrack = tracks[value.current];
      setCurrentTrack(nextTrack)

      await play(nextTrack, value.current);
    } else {
      console.log("end of playlist");
    }
  }

  const playPreviousTrack = async () => {
    if (currentSound) {
      await currentSound.stopAsync();
      setCurrentSound(null);
    }
    if (value.current > 0) {
      value.current -= 1;
      const nextTrack = tracks[value.current];
      setCurrentTrack(nextTrack)

      await play(nextTrack, value.current);
    } else {
      console.log("end of playlist");
    }
  }

  return (
    <>
      <LinearGradient colors={["#2D3047", "black"]} style={{ flex: 1 }}>
        <ScrollView style={{ marginTop: 50 }}>

          <View style={{ flexDirection: "row", padding: 12 }}>
            <Ionicons
              onPress={() => navigation.goBack()}
              name="arrow-back" size={24} color="white" />
          </View>

          <View style={{ flex: 1, alignItems: "center" }}>
            <Image style={{ width: 200, height: 200 }}
              source={{ uri: item?.track?.album?.images[0].url }} />
          </View>

          <Text style={{ color: "white", marginHorizontal: 12, marginTop: 10, fontSize: 22, fontWeight: "bold", textAlign: "center" }}>
            {item?.track?.album?.name}</Text>

          <Pressable
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
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
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                <Entypo name="controller-play" size={30} color="white" />
              </Pressable>

            </View>
          </Pressable>

          <View style={{ marginTop: 10, marginHorizontal: 12 }}>
            {tracks.map((track, index) => (
              <Pressable isPlaying={item === currentTrack}
                key={index}
                onPress={() => play(track, index)}
                style={styles.songContainer}>
                <View style={styles.songInfoContainer}>
                  <View style={styles.textContainer}>
                    <Text numberOfLines={1} style={currentPlayingIndex === index ? styles.playingTitle : styles.title}>
                      {track?.name}
                    </Text>
                    {track?.artists?.map((artist, artistIndex) => (
                      <Text style={{ fontSize: 16, fontWeight: "500", color: "gray" }}>{artist?.name}</Text>
                    ))}
                  </View>
                </View>
              </Pressable>
            ))}
          </View>

        </ScrollView>
      </LinearGradient>

      {currentTrack && (
        <Pressable onPress={() => setModalVisible(!modalVisible)}
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
          }}>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 10
            }}>
            <Image style={{ width: 40, height: 40 }}
              source={{ uri: item?.track?.album?.images[0].url }}
            />

            <Text numberOfLines={1} style={{
              fontSize: 13,
              width: 220,
              color: "white",
              fontWeight: "bold"
            }}>
              {currentTrack?.name}  • {" "}
              {currentTrack?.artists[0].name}
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
                  fontSize: 16,
                  fontWeight: "bold"
                }}>{currentTrack?.name}</Text>

              <Entypo name="dots-three-vertical" size={24} color="black" />
            </Pressable>

            <View style={{ height: 70 }} />

            <View style={{
              padding: 10
            }}>

              <Image style={{ width: "100%", height: 330, borderRadius: 4 }}
                source={{ uri: item?.track?.album?.images[0].url }} />

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
                      width: 12,
                      height: 12,
                      borderRadius: 6,
                      backgroundColor: "white"
                    },
                    {
                      left: `${progress * 100}%`,
                      marginLeft: - 6
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