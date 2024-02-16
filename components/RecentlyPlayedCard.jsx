import { useNavigation } from "@react-navigation/native";
import React from "react";
import { StyleSheet, Text, View, Pressable, Image } from "react-native";

const styles = StyleSheet.create({
  container: {
    margin: 10,
    alignItems: 'center',
  },
  image: {
    width: 130,
    height: 130,
    borderRadius: 5,
  },
  textContainer: {
    marginTop: 10,
    maxWidth: 130,
  },
  text: {
    fontSize: 13,
    fontWeight: "500",
    color: "white",
    textAlign: 'center',
  },
});

export default function RecentlyPlayedCard({ item }) {
  const navigation = useNavigation();

  return (
    <Pressable
      onPress={() =>
        navigation.navigate("SongInfo", {
          item: item,
        })
      }
      style={styles.container}
    >
      <Image
        style={styles.image}
        source={{ uri: item.track.album.images[0].url }}
      />
      <View style={styles.textContainer}>
        <Text numberOfLines={2} style={styles.text}>
          {item?.track?.name}
        </Text>
      </View>
    </Pressable>
  );
}
