
import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, SafeAreaView, Pressable, Linking } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from 'axios';
import { encode as base64Encode } from 'base-64';

import { FontAwesome5, MaterialIcons, AntDesign, Entypo } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";

const styles = StyleSheet.create({});

export default function Login() {
  const navigation = useNavigation();
  const [authorizationUrl, setAuthorizationUrl] = useState("");

  const redirectToSpotify = () => {
    console.log("Redirecting to Spotify...");
    const clientId = "fd6ed771787344d48b80f5697c1dbca8";
    const clientSecret = "00beb82a16da49288562b3e386e075f7";
    const redirectUri = "exp://192.168.0.100:8081";
    const scope = [
      'user-read-email',
      'user-library-read',
      'user-read-recently-played',
      'user-top-read',
      'playlist-read-private',
      'playlist-read-collaborative',
      'playlist-modify-public'
    ];

    const authorizationUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope.join(' '))}&response_type=code`;

    Linking.openURL(authorizationUrl);
  };

  const handleRedirect = (event) => {
    console.log("Handling redirect...");
    const url = event.url;
    const codeMatch = url.match(/\?code=(.+)$/);

    if (codeMatch) {
      const code = codeMatch[1];
      console.log("Received code:", code);
      exchangeCodeForToken(code);
    }
  };

  const exchangeCodeForToken = async (code) => {
    console.log("Exchanging code for token...");
    const clientId = "fd6ed771787344d48b80f5697c1dbca8";
    const clientSecret = "00beb82a16da49288562b3e386e075f7";
    const redirectUri = "exp://192.168.0.100:8081";
    const tokenUrl = 'https://accounts.spotify.com/api/token';

    const credentials = `${clientId}:${clientSecret}`;
    const base64Credentials = base64Encode(credentials);

    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${base64Credentials}`,
    };

    const params = {
      code,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    };

    try {
      const response = await axios.post(
        tokenUrl,
        null,
        {
          params,
          headers,
        }
      );

      const { access_token, expires_in } = response.data;
      console.log("Received access token:", access_token);

      AsyncStorage.setItem("token", access_token);
      const expirationDate = Date.now() + expires_in * 1000;
      AsyncStorage.setItem("expirationDate", expirationDate.toString());

      navigation.navigate("Main");
    } catch (error) {
      console.error("Erro durante a troca de código por token:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    console.log("Adding event listener for redirect...");
    Linking.addEventListener('url', handleRedirect);
    return () => {
      console.log("Removing event listener for redirect...");
      Linking.removeEventListener('url', handleRedirect);
    };
  }, []);

  return (
    <LinearGradient colors={["#040306", "#131624"]} style={{ flex: 1 }}>
      <SafeAreaView>
        <View style={{ height: 80 }} />
        <FontAwesome5 style={{ textAlign: "center" }}
          name="carrot"
          size={80}
          color="white" />
        <Text style={{
          color: "white",
          textAlign: "center",
          fontSize: 35,
          fontWeight: "bold",
          margin: 40
        }}
        >
          Milhões de emoções no Carroty!
        </Text>

        <View style={{ height: 80 }} />
        <Pressable

          onPress={redirectToSpotify}

          style={{
            backgroundColor: "#FF004D",
            padding: 10,
            marginLeft: "auto",
            marginRight: "auto",
            width: 300,
            borderRadius: 25,
            alignItens: "center",
            justifyContent: "center",
            marginVertical: 10
          }}
        >
          <Text style={{
            textAlign: "center"
          }}
          >
            Entre com seu Spotify
          </Text>

        </Pressable>

        <Pressable
          style={{
            backgroundColor: "#131624",
            padding: 10,
            marginLeft: "auto",
            marginRight: "auto",
            width: 300,
            borderRadius: 25,
            alignItens: "center",
            justifyContent: "center",
            flexDirection: "row",
            alignItems: "center",
            marginVertical: 10,
            borderColor: "#C0C0C0",
            borderWidth: 0.8
          }}
        >
          <MaterialIcons name="phone-android" size={24} color="white" />
          <Text style={{
            textAlign: "center",
            color: "white",
            fontWeight: "500",
            flex: 1
          }}> Continue com seu número </Text>
        </Pressable>

        <Pressable
          style={{
            backgroundColor: "#131624",
            padding: 10,
            marginLeft: "auto",
            marginRight: "auto",
            width: 300,
            borderRadius: 25,
            alignItens: "center",
            justifyContent: "center",
            flexDirection: "row",
            alignItems: "center",
            marginVertical: 10,
            borderColor: "#C0C0C0",
            borderWidth: 0.8
          }}
        >
          <AntDesign name="google" size={24} color="white" />
          <Text style={{
            textAlign: "center",
            color: "white",
            fontWeight: "500",
            flex: 1
          }}> Continue com Google </Text>
        </Pressable>

        <Pressable
          style={{
            backgroundColor: "#131624",
            padding: 10,
            marginLeft: "auto",
            marginRight: "auto",
            width: 300,
            borderRadius: 25,
            alignItens: "center",
            justifyContent: "center",
            flexDirection: "row",
            alignItems: "center",
            marginVertical: 10,
            borderColor: "#C0C0C0",
            borderWidth: 0.8
          }}
        >
          <Entypo name="facebook" size={24} color="white" />
          <Text style={{
            textAlign: "center",
            color: "white",
            fontWeight: "500",
            flex: 1
          }}> Continue com Facebook </Text>
        </Pressable>

      </SafeAreaView>
    </LinearGradient>
  )
}