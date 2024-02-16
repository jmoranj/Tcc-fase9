import { useNavigation } from "@react-navigation/native";
import React from "react";
import { StyleSheet, Text, View, Pressable, Image } from "react-native";

const styles = StyleSheet.create({
  container: {
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
  },
  image: {
    width: 55,
    height: 55
  },
  textContainer: {
    maxWidth: 120
  },
  text: {
    color: "white",
    fontSize: 13,
    fontWeight: "bold",
    textAlign: 'center',
  },
});

export default function RecentlyPlayedButton({ item }) {
  const navigation = useNavigation();

  return (

    <Pressable
      onPress={() =>
        navigation.navigate("SongInfo", {
          item: item
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
