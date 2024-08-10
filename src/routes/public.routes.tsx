import {
  NativeStackNavigationProp,
  createNativeStackNavigator,
} from "@react-navigation/native-stack";
import { SignIn } from "../screens/sign-in";
import { SignUp } from "../screens/sign-up";

type PublicRoutesParams = {
  "sign-in": undefined;
  "sign-up": undefined;
};

export type Routes = NativeStackNavigationProp<PublicRoutesParams>;

const { Navigator, Screen } = createNativeStackNavigator<PublicRoutesParams>();

export function PublicRoutes() {
  return (
    <Navigator screenOptions={{ headerShown: false }}>
      <Screen name="sign-in" component={SignIn} />
      <Screen name="sign-up" component={SignUp} />
    </Navigator>
  );
}
