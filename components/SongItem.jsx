import React, { useContext } from "react";
import { StyleSheet, Text, View, Image, Pressable } from "react-native";

import { Player } from "../Player";

import { AntDesign, Entypo } from '@expo/vector-icons';

export default function SongItem({ item, onPress, isPlaying }) {
  const { currentTrack, setCurrentTrack } = useContext(Player)

  const handlePress = () => {
    setCurrentTrack(item);
    onPress(item)
  }

  return (
    <Pressable
      onPress={handlePress}
      style={{
        flexDirection: "row",
        alignItems: "center",
        padding: 10,

      }}>
      <Image
        style={{
          width: 50,
          height: 50,
          marginRight: 10
        }}
        source={{ uri: item?.track?.album.images[0].url }} />

      <View
        style={{
          flex: 1
        }}
      >
        <Text
          numberOfLines={1}
          style={
            isPlaying ? {
              color: "#735290", fontWeight: "bold", fontSize: 14
            } : { color: "white", fontWeight: "bold", fontSize: 14 }
          }
        >
          {item?.track?.name}</Text>
        <Text
          style={{
            marginTop: 4,
            color: "#989898",

          }}
        >{item?.track?.artists[0].name}</Text>
      </View>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 7,
          marginHorizontal: 10
        }}
      >
        <AntDesign name="heart" size={24} color="#FF114D" />
        <Entypo name="dots-three-vertical" size={24} color="black" />
      </View>
    </Pressable>
  )
}