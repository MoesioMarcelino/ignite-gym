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
import { useAuth } from "@hooks/useAuth";
import { AppError } from "@utils/AppError";
import { ToastMessage } from "@components/toast-message";

type FormDataParams = {
  email: string;
  password: string;
};

const formDataSchema = Yup.object({
  email: Yup.string().required("Campo obrigatório.").email("E-mail inválido"),
  password: Yup.string()
    .required("Campo obrigatório.")
    .min(6, "Mínimo de 6 caracteres"),
});

export function SignIn() {
  const { signIn } = useAuth();
  const toast = useToast();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormDataParams>({
    mode: "all",
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: yupResolver(formDataSchema),
  });

  const navigator = useNavigation<PublicRoutesNavigation>();

  function handleNewAccount() {
    navigator.navigate("sign-up");
  }

  async function onSubmitForm({ email, password }: FormDataParams) {
    try {
      await signIn({ email, password });
    } catch (err) {
      const isAppError = err instanceof AppError;
      const title = isAppError
        ? err.message
        : "Erro ao entrar. Tente novamente mais tarde";

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
            <Heading color="$gray100">Acesse sua conta</Heading>
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
              onSubmitEditing={handleSubmit(onSubmitForm)}
              returnKeyType="send"
              error={errors.password?.message}
            />

            <Button
              title="Acessar"
              isLoading={isSubmitting}
              onPress={handleSubmit(onSubmitForm)}
            />
          </Center>

          <Center flex={1} justifyContent="flex-end" mt="$4">
            <Text color="$gray100" fontSize="$sm" mb="$3" fontFamily="$body">
              Ainda não tem acesso?
            </Text>

            <Button
              title="Criar conta"
              variant="outline"
              onPress={handleNewAccount}
            />
          </Center>
        </VStack>
      </VStack>
    </ScrollView>
  );
}
