import { Text, View, StyleSheet } from "react-native";
import { Link } from "expo-router";
import { useState } from 'react';

import * as ImagePicker from 'expo-image-picker';

import Button from "@/componets/button";
import ImageViewer from "@/componets/ImageViewer";

const PlaceholderImage = require('@/assets/images/background-image.png');

export default function Index() {

  const [selectedImage, setSelectedImage] = useState <string | undefined> (undefined);
  const [showAddOptions, setShowAddOptions] = useState<boolean>(false);

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      setShowAddOptions(true);
    } else {
      alert('You did not select any image.');
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <ImageViewer 
          imgSource = {PlaceholderImage}
          selectedImage = {selectedImage}
        />
      </View>
      {showAddOptions ? (
        <View />
      ) : (
        <View style  = {styles.footerContainer}>
          <Button 
            theme = "primary"
            label = "Choose a Photo" 
            onPress = { pickImageAsync }
          />
          <Button 
            label = "Use this Photo" 
            onPress={ () => setShowAddOptions(true)}
          />
        </View>
      )}
      
      {/* <Text style ={styles.text}>Home screen</Text>
      <Link href="/about" style ={styles.button}>
        Go to About Scren
      </Link> */}

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
    justifyContent: 'center'

  },

  imageContainer: {
    flex: 1
  },  
  
  text: {
    color: '#fff'
  },

  button: {
    fontSize: 20,
    textDecorationLine: 'underline',
    color: '#fff',
  },

  footerContainer: {
    flex: 1 / 3,
    alignItems: 'center',
  },

});


