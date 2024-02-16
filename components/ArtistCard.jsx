import { StyleSheet, Text, View, Image, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import React from "react";

const styles = StyleSheet.create({})

export default function ArtistCard({ item }) {

  const navigation = useNavigation()

  return (

    <Pressable onPress={() => navigation.navigate("Artist", { artistId: item.id, artistImage: item.images[0].url })}>
      <View style={{
        margin: 10
      }}>
        <Image style={{
          width: 130,
          height: 130,
          borderRadius: 5
        }}
          source={{ uri: item.images[0].url }} />
        <Text style={{
          fontSize: 13,
          fontWeight: "500",
          color: "white",
          marginTop: 10
        }}>
          {item?.name}</Text>
      </View>
    </Pressable>

  )
}