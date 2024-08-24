import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { PublicRoutes } from "./public.routes";
import { config } from "../../config/gluestack-ui.config";
import { Box } from "@gluestack-ui/themed";
import { useAuth } from "@hooks/useAuth";
import { PrivateRoutes } from "./private.routes";
import { Loading } from "@components/loading";

export function Routes() {
  const { user, isLoadingStorageUserData } = useAuth();

  const theme = DefaultTheme;
  theme.colors.background = config.tokens.colors.gray700;

  if (isLoadingStorageUserData) {
    return <Loading />;
  }

  return (
    <Box flex={1} bg="$gray700">
      <NavigationContainer theme={theme}>
        {user.id ? <PrivateRoutes /> : <PublicRoutes />}
      </NavigationContainer>
    </Box>
  );
}
