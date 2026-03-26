import React, { useState } from 'react';
import { View, FlatList, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { Image } from 'expo-image';

const { width } = Dimensions.get('window');
const AnimatedImage = Animated.createAnimatedComponent(Image);

export default function ProductImagePreview({ images = [] }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const scale = useSharedValue(1);

  // ✅ New Pinch Gesture
  const pinch = Gesture.Pinch()
    .onUpdate((event) => {
      scale.value = event.scale;
    })
    .onEnd(() => {
      scale.value = withTiming(1, { duration: 200 });
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  if (!images.length) return null;

  return (
    <View style={styles.container}>
      {/* Zoomable Image */}
      <GestureDetector gesture={pinch}>
        <Animated.View style={styles.imageWrapper}>
          <AnimatedImage
            source={images[selectedIndex].uri}
            style={[styles.mainImage, animatedStyle]}
            contentFit="contain"
          />
        </Animated.View>
      </GestureDetector>

      {/* Thumbnail Carousel */}
      {images.length > 1 && (
        <FlatList
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
        />
      )}
    </View>
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
