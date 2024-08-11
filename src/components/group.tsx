import { Button, ButtonText } from "@gluestack-ui/themed";
import { ComponentProps } from "react";

type GroupParams = ComponentProps<typeof Button> & {
  title: string;
  isActive?: boolean;
};

export function Group({ title, isActive = true, ...rest }: GroupParams) {
  return (
    <Button
      minWidth={24}
      h="$10"
      bg="$gray600"
      rounded="$md"
      justifyContent="center"
      alignItems="center"
      borderColor={isActive ? "$green500" : "$gray600"}
      borderWidth={1}
      {...rest}
    >
      <ButtonText
        color={isActive ? "$green500" : "$gray200"}
        textTransform="uppercase"
        fontSize="$xs"
        fontFamily="$heading"
      >
        {title}
      </ButtonText>
    </Button>
  );
}
