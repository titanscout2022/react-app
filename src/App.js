/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import { Alert, Linking } from 'react-native';
import { GoogleSignin } from '@react-native-community/google-signin';
import prompt from 'react-native-prompt-android';
import VersionCheck from 'react-native-version-check';
import TabControl from './MainTab/TabControl';
import toggleDarkMode from './MainTab/Settings/Settings';
import ThemeProvider, { refreshTheme } from './MainTab/ThemeProvider';
const updateAlert = urlToOpen => {
  Alert.alert(
    'Update Available!',
    'The Red Alliance app has an available update. Please update to continue.',
    [
      {
        text: 'Admin Override',
        onPress: () => adminOverride(),
        style: 'cancel',
      },
      {text: 'Update', onPress: () => Linking.openURL(urlToOpen)},
    ],
    {cancelable: false},
  );
};
const adminOverride = () => {
  prompt(
    'Enter admin password',
    'Enter admin password to override update requirement.',
    [
      {
        text: 'Cancel',
        onPress: () => updateAlert(),
        style: 'cancel',
      },
      {
        text: 'Submit',
        onPress: password => {
          if (password !== 'whydontusersupdateapps') {
            Alert.alert(
              'Invalid Password',
              'The admin password was invalid',
              [{text: 'Back', onPress: () => adminOverride()}],
              {cancelable: false},
            );
          }
        },
      },
    ],
    {
      type: 'secure-text',
      cancelable: false,
      defaultValue: '',
    },
  );  
};
VersionCheck.needUpdate().then(async res => {
  try {
    if (res.isNeeded) {
      updateAlert(res.storeUrl);
    }
  } catch (e) {
    console.warn("Could not verify app version")
  }

});
// Other Web Client ID: 291863698243-t3adrufmitbd3ulgejs8pq255jvvuv9u.apps.googleusercontent.com
// Web client ID 291863698243-8u79bk1a6odv021fu0km8htvpu6k2uqo.apps.googleusercontent.com
// ios Client ID: 291863698243-ovppseib28p6usahf60igsp7ia3ovq6l.apps.googleusercontent.com
GoogleSignin.configure({
  scopes: ['https://www.googleapis.com/auth/userinfo.profile'], // what API you want to access on behalf of the user, default is email and profile
  webClientId:
    '291863698243-obu2fpbfpr7ul9db9lm7rmc1e4r3oeag.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
  offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
  hostedDomain: '', // specifies a hosted domain restriction
  loginHint: '@imsa.edu', // [iOS] The user's ID, or email address, to be prefilled in the authentication UI if possible. [See docs here](https://developers.google.com/identity/sign-in/ios/api/interface_g_i_d_sign_in.html#a0a68c7504c31ab0b728432565f6e33fd)
  forceConsentPrompt: false, // [Android] if you want to show the authorization prompt at each login.
  accountName: '', // [Android] specifies an account name on the device that should be used
  iosClientId: '291863698243-3nt50bms4e2vr721vlvgb505aaj5ihhu.apps.googleusercontent.com',
});
refreshTheme()
// This will prompt a user to sign in if they aren't already
export default class App extends React.Component {
  render() {
    return <TabControl />
  }
}
