import React, { useState } from 'react';
import { View, FlatList, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, useAnimatedGestureHandler } from 'react-native-reanimated';
import { PinchGestureHandler, GestureHandlerRootView } from 'react-native-gesture-handler';
import { Image } from 'expo-image';

const { width } = Dimensions.get('window');
const AnimatedImage = Animated.createAnimatedComponent(Image);

// const images = [
//   { uri: 'https://admin.takehome.live/Content/ImageMaster/856441_2.jpg' },
//   { uri: 'https://admin.takehome.live/Content/ImageMaster/250506161756_1.png' },
//   { uri: 'https://admin.takehome.live/Content/ImageMaster/860872_2.png' },
// ];

export default function ProductImagePreview({ images=[] }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const scale = useSharedValue(1);

  const pinchHandler = useAnimatedGestureHandler({
    onActive: (event) => {
      scale.value = event.scale;
    },
    onEnd: () => {
      scale.value = withTiming(1, { duration: 200 });
    },
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  if (!images.length) return;

  return (
    <GestureHandlerRootView style={styles.container}>
      {/* Zoomable Image */}
      <PinchGestureHandler onGestureEvent={pinchHandler}>
        <Animated.View style={styles.imageWrapper}>
          <AnimatedImage source={images[selectedIndex].uri} style={[styles.mainImage, animatedStyle]} contentFit="contain" />
        </Animated.View>
      </PinchGestureHandler>

      {/* Thumbnail Carousel */}
      {images.length > 1 ? <FlatList
        data={images}
        horizontal
        keyExtractor={(_, index) => index.toString()}
        showsHorizontalScrollIndicator={false}
        style={{ marginTop: 15 }}
        contentContainerStyle={{ paddingHorizontal: 10 }}
        renderItem={({ item, index }) => (
          <TouchableOpacity onPress={() => setSelectedIndex(index)}>
            <Image
              source={item.uri}
              contentFit="cover"
              style={[
                styles.thumbnail,
                selectedIndex === index && styles.activeThumbnail,
              ]}
            />
          </TouchableOpacity>
        )}
      /> : null}
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    alignItems: 'center',
    // backgroundColor: '#fff',
  },
  imageWrapper: {
    width: width * 0.9,
    height: width * 0.9,
    borderRadius: 12,
    overflow: 'hidden',
  },
  mainImage: {
    width: '100%',
    height: '100%',
  },
  thumbnail: {
    width: 70,
    height: 70,
    marginRight: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  activeThumbnail: {
    borderColor: '#007bff',
    borderWidth: 2,
  },
});
