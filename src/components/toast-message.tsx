import {
  ToastDescription,
  ToastTitle,
  Toast,
  Pressable,
  Icon,
  VStack,
  HStack,
} from "@gluestack-ui/themed";
import { X } from "lucide-react-native";

type ToastMessageParams = {
  id: string;
  title: string;
  description?: string;
  action?: "error" | "success";
  onClose: () => void;
};

export function ToastMessage({
  id,
  title,
  description,
  action = "success",
  onClose,
}: ToastMessageParams) {
  return (
    <Toast
      nativeID={`toast-${id}`}
      action={action}
      bgColor={action === "success" ? "$green500" : "$red500"}
    >
      <VStack space="xs" w="$full">
        <HStack>
          <ToastTitle
            color="$white"
            fontFamily="$heading"
            flex={1}
            flexShrink={1}
            numberOfLines={1}
          >
            {title}
          </ToastTitle>
          <Pressable alignSelf="flex-end" onPress={onClose}>
            <Icon as={X} color="$coolGray50" size="md" />
          </Pressable>
        </HStack>

        {description && (
          <ToastDescription color="$white" fontFamily="$body">
            {description}
          </ToastDescription>
        )}
      </VStack>
    </Toast>
  );
}
