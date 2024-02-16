import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import Navigation from "./StackNavigator"
import { PlayerContext } from "./Player";
import { ModalPortal } from "react-native-modals";

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: "#fff",
    flex: 1,
    justifyContent: "center"
  },
})

export default function App() {
  return (
    <>
      <PlayerContext>
        <Navigation />
        <ModalPortal />
      </PlayerContext>
    </>
  )
}
