import {
  Button as GlueStackButton,
  ButtonText,
  ButtonSpinner,
} from "@gluestack-ui/themed";
import { ComponentProps } from "react";

type ButtonParams = ComponentProps<typeof GlueStackButton> & {
  title: string;
  variant?: "solid" | "outline";
  isLoading?: boolean;
};

export function Button({
  title,
  variant = "solid",
  isLoading = false,
  ...rest
}: ButtonParams) {
  return (
    <GlueStackButton
      w="$full"
      h="$14"
      bg={variant === "solid" ? "$green700" : "transparent"}
      borderWidth={variant === "solid" ? "$0" : "$1"}
      borderColor="$green500"
      rounded="$sm"
      $active-bg={variant === "solid" ? "$green500" : "$gray500"}
      disabled={isLoading}
      {...rest}
    >
      {isLoading ? (
        <ButtonSpinner />
      ) : (
        <ButtonText
          fontFamily="$heading"
          fontSize="$sm"
          color={variant === "solid" ? "$white" : "$green500"}
        >
          {title}
        </ButtonText>
      )}
    </GlueStackButton>
  );
}
