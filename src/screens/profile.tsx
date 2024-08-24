import { Button } from "@components/button";
import { Input } from "@components/input";
import { ProfilePhoto } from "@components/profile-photo";
import { ScreenHeader } from "@components/screen-header";
import { Center, Heading, Text, VStack, useToast } from "@gluestack-ui/themed";
import { ScrollView, TouchableOpacity } from "react-native";
import * as imagePicker from "expo-image-picker";
import * as fileSystem from "expo-file-system";
import { useState } from "react";
import { ToastMessage } from "@components/toast-message";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

type DataFormParams = {
  name: string;
  email: string;
  old_password?: string;
  new_password?: string;
  new_password_confirmation?: string;
};

const formDataSchema = Yup.object({
  name: Yup.string().required("Campo obrigatório."),
  email: Yup.string().required("Campo obrigatório."),
  old_password: Yup.string().min(6, "Mínimo de 6 caracteres"),
  new_password: Yup.string().min(6, "Mínimo de 6 caracteres"),
  new_password_confirmation: Yup.string()
    .min(6, "Mínimo de 6 caracteres")
    .oneOf([Yup.ref("old_password"), ""], "As senhas digitadas não são iguais"),
});

export function Profile() {
  const toast = useToast();
  const {
    control,
    formState: { errors, isSubmitting },
  } = useForm<DataFormParams>({
    defaultValues: {
      name: "",
      email: "moesiomarcelino1@gmail.com",
      old_password: "",
      new_password: "",
      new_password_confirmation: "",
    },
    resolver: yupResolver(formDataSchema),
  });

  const [userPhoto, setUserPhoto] = useState(
    "https://github.com/moesiomarcelino.png"
  );

  async function handleUserPhotoSelect() {
    try {
      const { assets, canceled } = await imagePicker.launchImageLibraryAsync({
        mediaTypes: imagePicker.MediaTypeOptions.Images,
        quality: 1,
        aspect: [4, 4],
        allowsEditing: true,
        allowsMultipleSelection: false,
      });

      if (canceled) {
        return;
      }

      const photoSelected = assets[0];

      if (photoSelected) {
        const { size } = (await fileSystem.getInfoAsync(photoSelected.uri)) as {
          size: number;
        };

        const sizeBiggerThan5mb = size / 1024 / 1024 > 5;

        if (size && sizeBiggerThan5mb) {
          return toast.show({
            placement: "top",
            containerStyle: { paddingTop: 32 },
            render: ({ id }) => (
              <ToastMessage
                id={id}
                title="Imagem muito grande"
                description="Essa imagem é muito grande. Escolha uma de até 5mb."
                action="error"
                onClose={() => toast.close(id)}
              />
            ),
          });
        }

        setUserPhoto(photoSelected.uri);
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <VStack flex={1}>
      <ScreenHeader title="Perfil" />

      <ScrollView contentContainerStyle={{ paddingBottom: 36 }}>
        <Center mt="$6" px="$10">
          <ProfilePhoto
            source={{ uri: userPhoto }}
            alt="User image"
            size="xl"
          />

          <TouchableOpacity onPress={handleUserPhotoSelect}>
            <Text
              color="$green500"
              fontFamily="$heading"
              fontSize="$md"
              mt="$2"
              mb="$8"
            >
              Alterar foto
            </Text>
          </TouchableOpacity>

          <Center w="$full" gap="$4">
            <Input<DataFormParams>
              control={control}
              name="name"
              placeholder="Nome"
              bg="$gray600"
              error={errors.name?.message}
            />
            <Input<DataFormParams>
              control={control}
              name="email"
              editable={false}
              bg="$gray600"
              error={errors.email?.message}
            />
          </Center>

          <Heading
            alignSelf="flex-start"
            fontFamily="$heading"
            color="$gray200"
            fontSize="$md"
            mt="$12"
            mb="$2"
          >
            Alterar senha
          </Heading>

          <Center w="$full" gap="$4">
            <Input<DataFormParams>
              control={control}
              name="old_password"
              placeholder="Senha antiga"
              bg="$gray600"
              secureTextEntry
              error={errors.old_password?.message}
            />
            <Input<DataFormParams>
              control={control}
              name="new_password"
              placeholder="Nova senha"
              bg="$gray600"
              secureTextEntry
              error={errors.new_password?.message}
            />
            <Input<DataFormParams>
              control={control}
              name="new_password_confirmation"
              error={errors.new_password_confirmation?.message}
              placeholder="Confirme a nova senha"
              bg="$gray600"
              secureTextEntry
            />

            <Button title="Atualizar" />
          </Center>
        </Center>
      </ScrollView>
    </VStack>
  );
}
