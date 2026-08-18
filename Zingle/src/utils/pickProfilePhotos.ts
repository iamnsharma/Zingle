import { Alert } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';

const MAX_PHOTOS = 6;

export async function pickProfilePhotos(
  remainingSlots: number,
): Promise<string[]> {
  const limit = Math.min(Math.max(remainingSlots, 1), MAX_PHOTOS);

  try {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      selectionLimit: limit,
      quality: 0.8,
    });

    if (result.didCancel || result.errorCode) {
      if (result.errorMessage) {
        Alert.alert('Photos', result.errorMessage);
      }
      return [];
    }

    return (result.assets ?? [])
      .map(asset => asset.uri)
      .filter((uri): uri is string => Boolean(uri))
      .slice(0, limit);
  } catch {
    Alert.alert(
      'Photos',
      'Gallery picker needs a native rebuild. Run yarn ios or yarn android once.',
    );
    return [];
  }
}
