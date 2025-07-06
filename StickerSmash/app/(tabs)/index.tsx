import { View, StyleSheet, ImageSourcePropType, Platform } from "react-native";
import { Link } from "expo-router";
import { useState, useRef } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { captureRef } from 'react-native-view-shot';
import domtoimage from 'dom-to-image';

import * as ImagePicker from 'expo-image-picker';
import ImageViewer from "@/componets/ImageViewer";

import * as MediaLibrary from 'expo-media-library';

import Button from "@/componets/button";
import CircleButton from "@/componets/CircleButton";
import IconButton from "@/componets/IconButton";

import EmojiPicker from "@/componets/EmojiPicker";
import EmojiList from "@/componets/EmojiList";
import EmojiSticker from "@/componets/EmojiSticker";
import domToImage from "dom-to-image";



const PlaceholderImage = require('@/assets/images/background-image.png');

export default function Index() {
  const imageRef = useRef<View>(null);
  const [status, requestPermission] = MediaLibrary.usePermissions();

  const [selectedImage, setSelectedImage] = useState <string | undefined> (undefined);
  const [showAddOptions, setShowAddOptions] = useState <boolean>(false);
  const [isModalVisable, setIsModalVisable] = useState <boolean>(false);
  const [pickedEmoji, setPickedEmoji] = useState <ImageSourcePropType | undefined> (undefined)

  if (status === null) {
    requestPermission()
  }

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

  const onReset = () => {
    setShowAddOptions(false);
  }

  const onAddSticker = () => {
    setIsModalVisable(true);
  }

  const onModalClose = () => {
    setIsModalVisable(false);
  }
  
  const onSaveImageAsync = async () => {
    if (Platform.OS !== 'web') {
      try {
        const localURI = await captureRef(imageRef, {
          height: 400,
          quality: 1,
        });

        await MediaLibrary.saveToLibraryAsync(localURI);
        if (localURI) {
          alert('Saved!');
        }
      } catch (e) {
        console.log(e);
      }
    } else {
      try {
        const dataURL = await domtoimage.toJpeg(imageRef.current, {
          quality: .95,
          width: 320,
          height: 440,
        });

        let link = document.createElement('a');
        link.download = 'sticker-smash.jpeg'
        link.href = dataURL;
        link.click();
      } catch (e) {
        console.log(e)
      }
    }
  };

  return (
    <GestureHandlerRootView style = {styles.container}>
      <View style={styles.imageContainer}>
        <View 
          ref = {imageRef}
          collapsable = {false}
        >
          <ImageViewer 
            imgSource = {PlaceholderImage}
            selectedImage = {selectedImage}
          />
          {pickedEmoji && <EmojiSticker 
            imageSize = {40}
            stickerSource={pickedEmoji}
          />} 
        </View>
      </View>
      {showAddOptions ? (
        <View style = {styles.optionsContainer}>
          <View style = {styles.optionsRow}>
            <IconButton 
              icon = "refresh"
              label = "Reset"
              onPress = {onReset}
            />
            <CircleButton onPress = {onAddSticker}/>
            <IconButton 
              icon = "save-alt" 
              label = "Save"
              onPress={onSaveImageAsync}
            />
          </View>
        </View>
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
      <EmojiPicker
        isVisable = {isModalVisable}
        onClose = {onModalClose}
      >
        <EmojiList 
          onSelect = {setPickedEmoji}
          onCloseModal = {onModalClose} 
        />
      </EmojiPicker>
    </GestureHandlerRootView>
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

  footerContainer: {
    flex: 1 / 3,
    alignItems: 'center',
  },

    optionsContainer: {
    position: 'absolute',
    bottom: 80,
  },

  optionsRow: {
    alignItems: 'center',
    flexDirection: 'row',
  },

});


