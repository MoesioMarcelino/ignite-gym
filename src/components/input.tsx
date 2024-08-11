import { Input as GlueStackInput, InputField } from "@gluestack-ui/themed";
import { ComponentProps } from "react";

type InputParams = ComponentProps<typeof InputField>;

export function Input({ editable = true, ...rest }: InputParams) {
  return (
    <GlueStackInput
      h="$14"
      borderWidth="$0"
      borderRadius="$md"
      $focus={{
        borderWidth: 1,
        borderColor: "$green500",
      }}
      opacity={editable ? 1 : 0.5}
    >
      <InputField
        px="$4"
        bg="$gray700"
        color="$white"
        fontFamily="$body"
        placeholderTextColor="$gray300"
        editable={editable}
        {...rest}
      />
    </GlueStackInput>
  );
}
