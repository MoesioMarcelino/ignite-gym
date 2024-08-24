import { ComponentProps } from "react";
import {
  Control,
  Controller,
  ControllerProps,
  FieldValues,
  Path,
  RegisterOptions,
} from "react-hook-form";
import {
  FormControl,
  FormControlError,
  FormControlErrorText,
  Input as GlueStackInput,
  InputField,
  Text,
} from "@gluestack-ui/themed";

type InputParams<T extends FieldValues = {}> = ComponentProps<
  typeof InputField
> & {
  control: Control<T>;
  name: Path<T>;
  error?: string;
  rules?:
    | Omit<
        RegisterOptions<T, Path<T>>,
        "disabled" | "valueAsNumber" | "valueAsDate" | "setValueAs"
      >
    | undefined;
  isInvalid?: boolean;
};

export function Input<T extends FieldValues>({
  editable = true,
  control,
  name,
  error,
  rules,
  isInvalid = false,
  ...rest
}: InputParams<T>) {
  const invalid = !!error || isInvalid;

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { onChange, value } }) => (
        <FormControl isInvalid={invalid} w="$full">
          <GlueStackInput
            isInvalid={invalid}
            h="$14"
            borderWidth="$0"
            borderRadius="$md"
            $focus={{
              borderWidth: 1,
              borderColor: invalid ? "$red500" : "$green500",
            }}
            $invalid={{
              borderWidth: 1,
              borderColor: "$red500",
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
              onChangeText={onChange}
              value={value}
              {...rest}
            />
          </GlueStackInput>

          <FormControlError mb="$4">
            <FormControlErrorText color="$red500">{error}</FormControlErrorText>
          </FormControlError>
        </FormControl>
      )}
    />
  );
}
