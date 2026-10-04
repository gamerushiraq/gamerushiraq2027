# GameRush Iraq Android

Native Expo/React Native Android app for GameRush Iraq.

## Connected services
- Same Supabase project used by the website
- Game catalog loaded from `game_catalog`
- Main website and order tracking open from the app
- WhatsApp support opens the GameRush support number

## Android package
`com.gamerushiraq.app`

## Build an installable APK
The `preview` EAS profile is configured with `android.buildType: apk`.

Local:
```bash
npm install
npx eas login
npx eas build --platform android --profile preview
```

GitHub Actions:
1. Add an Expo access token as repository secret `EXPO_TOKEN`.
2. Open Actions -> GameRush Android APK -> Run workflow.
3. EAS will create the Android APK and expose the build artifact/link.

For Google Play, use the production profile to create an Android App Bundle (AAB).
