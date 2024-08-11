import { Image } from "@gluestack-ui/themed";
import { ComponentProps } from "react";

type ProfilePhotoParams = ComponentProps<typeof Image>;

export function ProfilePhoto({ ...rest }: ProfilePhotoParams) {
  return (
    <Image
      rounded="$full"
      borderWidth={2}
      borderColor="$gray400"
      bg="$gray500"
      {...rest}
    />
  );
}
