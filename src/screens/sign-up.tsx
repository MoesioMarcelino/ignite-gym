import {
  Center,
  Image,
  VStack,
  Text,
  Heading,
  ScrollView,
  useToast,
} from "@gluestack-ui/themed";
import backgroundImg from "@assets/background.png";
import Logo from "@assets/logo.svg";
import { Input } from "@components/input";
import { Button } from "@components/button";
import { useNavigation } from "@react-navigation/native";
import { PublicRoutesNavigation } from "@routes/public.routes";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { api } from "../lib";
import { ToastMessage } from "@components/toast-message";
import { AppError } from "@utils/AppError";
import { useAuth } from "@hooks/useAuth";

type FormDataParams = {
  name: string;
  email: string;
  password: string;
  password_confirm: string;
};

const formDataSchema = Yup.object({
  name: Yup.string().required("Campo obrigatório."),
  email: Yup.string().required("Campo obrigatório.").email("E-mail inválido"),
  password: Yup.string()
    .required("Campo obrigatório.")
    .min(6, "Mínimo de 6 caracteres"),
  password_confirm: Yup.string()
    .required("Campo obrigatório.")
    .min(6, "Mínimo de 6 caracteres")
    .oneOf([Yup.ref("password"), ""], "As senhas digitadas não são iguais"),
});

export function SignUp() {
  const toast = useToast();
  const { signIn } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormDataParams>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      password_confirm: "",
    },
    resolver: yupResolver(formDataSchema),
  });
  const navigator = useNavigation<PublicRoutesNavigation>();

  function handleGoBack() {
    navigator.navigate("sign-in");
  }

  async function onSubmitForm({ name, email, password }: FormDataParams) {
    try {
      const { data } = await api.post("/users", { name, email, password });
      signIn({ email, password });
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : "Não foi possível criar o usuário, tente novamente mais tarde.";

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
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
    >
      <VStack flex={1}>
        <Image
          source={backgroundImg}
          alt="Pessoas treinando"
          w="$full"
          h={624}
          defaultSource={backgroundImg}
          position="absolute"
        />

        <VStack flex={1} px="$10" pb="$16">
          <Center my="$24">
            <Logo />

            <Text color="$gray100" fontSize="$sm">
              Treine sua mente e seu corpo.
            </Text>
          </Center>

          <Center gap="$2">
            <Heading color="$gray100">Crie sua conta</Heading>
            <Input<FormDataParams>
              control={control}
              name="name"
              placeholder="Nome"
              error={errors.name?.message}
            />
            <Input<FormDataParams>
              control={control}
              name="email"
              placeholder="E-mail"
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email?.message}
            />
            <Input<FormDataParams>
              control={control}
              name="password"
              placeholder="Senha"
              secureTextEntry
              error={errors.password?.message}
            />
            <Input<FormDataParams>
              control={control}
              name="password_confirm"
              placeholder="Confirme a senha"
              secureTextEntry
              onSubmitEditing={handleSubmit(onSubmitForm)}
              returnKeyType="send"
              error={errors.password_confirm?.message}
            />
            <Button
              title="Criar e acessar"
              onPress={handleSubmit(onSubmitForm)}
              isLoading={isSubmitting}
            />
          </Center>

          <Button
            title="Voltar para o login"
            variant="outline"
            mt="$12"
            onPress={handleGoBack}
          />
        </VStack>
      </VStack>
    </ScrollView>
  );
}
