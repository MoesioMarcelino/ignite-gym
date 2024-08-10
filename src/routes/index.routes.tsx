import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { PublicRoutes } from "./public.routes";
import { config } from "../../config/gluestack-ui.config";
import { Box } from "@gluestack-ui/themed";

export function Routes() {
  const theme = DefaultTheme;
  theme.colors.background = config.tokens.colors.gray700;

  return (
    <Box flex={1} bg="$gray700">
      <NavigationContainer theme={theme}>
        <PublicRoutes />
      </NavigationContainer>
    </Box>
  );
}
