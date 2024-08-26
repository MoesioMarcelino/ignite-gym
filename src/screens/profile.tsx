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
import { useAuth } from "@hooks/useAuth";

import userProfileDefault from "@assets/userPhotoDefault.png";
import { AppError } from "@utils/AppError";
import { api } from "../lib";
import { UserDTO } from "@dtos/user.dto";

type DataFormParams = {
  name: string;
  email: string;
  old_password?: string;
  new_password?: string | null;
  new_password_confirmation?: string | null;
};

const formDataSchema = Yup.object({
  name: Yup.string().required("Campo obrigatório."),
  email: Yup.string().required("Campo obrigatório."),
  old_password: Yup.string().min(6, "Mínimo de 6 caracteres"),
  new_password: Yup.string()
    .min(6, "Mínimo de 6 caracteres")
    .nullable()
    .transform((value) => (!!value ? value : null)),
  new_password_confirmation: Yup.string()
    .nullable()
    .transform((value) => (!!value ? value : null))
    .oneOf(
      [Yup.ref("new_password"), null],
      "As senhas digitadas não são iguais"
    )
    .when("new_password", {
      is: (Field: any) => Field,
      then: (schema) =>
        schema
          .nullable()
          .required("Campo obrigatório.")
          .transform((value) => (!!value ? value : null)),
    }),
});

export function Profile() {
  const toast = useToast();
  const { user, updateUser } = useAuth();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<DataFormParams>({
    defaultValues: {
      name: user.name,
      email: user.email,
    },
    resolver: yupResolver(formDataSchema),
  });

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

        const fileExtension = photoSelected.uri.split(".").pop();

        const photoFile = {
          name: `${user.name}.${fileExtension}`.toLowerCase(),
          uri: photoSelected.uri,
          type: `${photoSelected.type}/${fileExtension}`,
        } as any;

        const usePhotoUploadForm = new FormData();
        usePhotoUploadForm.append("avatar", photoFile);

        const { data } = await api.patch<UserDTO>(
          "/users/avatar",
          usePhotoUploadForm,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        const updatedUser = user;
        updatedUser.avatar = data.avatar;

        await updateUser(updatedUser);

        toast.show({
          placement: "top",
          containerStyle: { paddingTop: 32 },

          render: ({ id }) => (
            <ToastMessage
              id={id}
              title="Foto de perfil atualizada com sucesso!"
              action="success"
              onClose={() => toast.close(id)}
            />
          ),
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function handleSubmitProfileData({
    name,
    new_password,
    old_password,
  }: DataFormParams) {
    try {
      await api.put("/users", {
        name,
        password: new_password,
        old_password,
      });

      const updatedUser = user;
      updatedUser.name = name;

      await updateUser(updatedUser);

      toast.show({
        placement: "top",
        containerStyle: { paddingTop: 32 },

        render: ({ id }) => (
          <ToastMessage
            id={id}
            title="Informações atualizadas com sucesso!"
            action="success"
            onClose={() => toast.close(id)}
          />
        ),
      });
    } catch (err) {
      const isAppError = err instanceof AppError;
      const title = isAppError
        ? err.message
        : "Erro ao salvar as informações do perfil. Tente novamente mais tarde";

      toast.show({
        placement: "top",
        containerStyle: { paddingTop: 32 },

        render: ({ id }) => (
          <ToastMessage
            id={id}
            title={title}
            action="error"
            onClose={() => toast.close(id)}
          />
        ),
      });
    }
  }

  return (
    <VStack flex={1}>
      <ScreenHeader title="Perfil" />

      <ScrollView contentContainerStyle={{ paddingBottom: 36 }}>
        <Center mt="$6" px="$10">
          <ProfilePhoto
            source={
              user.avatar
                ? { uri: `${api.defaults.baseURL}/avatar/${user.avatar}` }
                : userProfileDefault
            }
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

            <Button
              title="Atualizar"
              isLoading={isSubmitting}
              onPress={handleSubmit(handleSubmitProfileData)}
            />
          </Center>
        </Center>
      </ScrollView>
    </VStack>
  );
}
