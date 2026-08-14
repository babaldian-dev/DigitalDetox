import { NativeModules, Platform } from 'react-native';

const LINKING_ERROR =
  `The package 'app-module' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

const AppModule = NativeModules.AppModule
  ? NativeModules.AppModule
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

export function getInstalledApps(): Promise<any[]> {
  return AppModule.getInstalledApps();
}

export function isAppInstalled(packageName: string): Promise<boolean> {
  return AppModule.isAppInstalled(packageName);
}

export default {
  getInstalledApps,
  isAppInstalled,
};
