import { StatusBar } from "react-native";
import {
  useFonts,
  Roboto_400Regular,
  Roboto_700Bold,
} from "@expo-google-fonts/roboto";
import { GluestackUIProvider } from "@gluestack-ui/themed";
import { config } from "./config/gluestack-ui.config";
import { Loading } from "@components";
import { SignIn } from "@screens/sign-in";

export default function App() {
  const [fontsLoaded] = useFonts({ Roboto_400Regular, Roboto_700Bold });
  return (
    <GluestackUIProvider config={config}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor={config.tokens.colors.gray700}
      />
      {fontsLoaded ? <SignIn /> : <Loading />}
    </GluestackUIProvider>
  );
}
