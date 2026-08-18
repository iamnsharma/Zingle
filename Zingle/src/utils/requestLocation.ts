import { PermissionsAndroid, Platform } from 'react-native';

/** Returns true if the user allowed approximate location. City list is the fallback. */
export async function requestApproximateLocation(): Promise<boolean> {
  if (Platform.OS !== 'android') {
    return true;
  }

  const result = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
    {
      title: 'Allow location',
      message: 'Zingle uses your city to show people nearby.',
      buttonPositive: 'Allow',
      buttonNegative: 'Not now',
    },
  );

  return result === PermissionsAndroid.RESULTS.GRANTED;
}
