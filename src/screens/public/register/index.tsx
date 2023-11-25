import { Link } from "react-router-dom";
import logoimg from "../../../assets/logo.svg";
import Container from "../../../components/container";
import Input from "../../../components/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth } from "../../../services/firebaseConnection";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import { AuthContext } from "../../../contexts/AuthContext";

const schema = z
  .object({
    name: z.string().min(1, "O nome é obrigatório"),
    email: z.string().email("Insira um email válido"),
    password: z.string().min(6, "A senha deve conter no mínimo 6 carecteres"),
    confirm: z.string().min(1, "A confirmação de senha é obrigatória"),
  })
  .refine((data) => data.password === data.confirm, {
    message: "A senha e a confirmação de senha devem ser iguais",
    path: ["confirm"],
  });

type FormData = z.infer<typeof schema>;

const Register = () => {
  const { handleUserInfo } = useContext(AuthContext);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  async function onSubmit(data: FormData) {
    createUserWithEmailAndPassword(auth, data.email, data.password)
      .then(async (user) => {
        await updateProfile(user.user, { displayName: data.name });

        handleUserInfo({
          name: data.name,
          email: data.email,
          uid: user.user.uid,
        });

        console.log("Cadastrado com sucesso");

        navigate("/dashboard", { replace: true });
      })
      .catch((error) => {
        console.log("erro ao cadastrar usuário", error);
      });
  }
  useEffect(() => {
    async function handleLogOut() {
      await signOut(auth);
    }
    handleLogOut();
  }, []);

  return (
    <Container>
      <div className="w-full min-h-screen flex justify-center items-center flex-col gap-4">
        <Link to="/" className="mb-6 max-w-sm w-full">
          <img className="w-full" src={logoimg} alt="logo" />
        </Link>
        <h1>Criar nova conta</h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white max-w-xl w-full rounded-lg p-4"
        >
          <div className="mb-3">
            <Input
              type="name"
              placeholder="Digite seu nome..."
              name="name"
              error={errors.name?.message}
              register={register}
            />
          </div>

          <div className="mb-3">
            <Input
              type="email"
              placeholder="Digite seu email..."
              name="email"
              error={errors.email?.message}
              register={register}
            />
          </div>

          <div className="mb-3">
            <Input
              type="password"
              placeholder="Informe uma senha..."
              name="password"
              error={errors.password?.message}
              register={register}
            />
          </div>
          <div className="mb-3">
            <Input
              type="password"
              placeholder="Informe a confirmação de senha..."
              name="confirm"
              error={errors.confirm?.message}
              register={register}
            />
          </div>
          <button
            type="submit"
            className="bg-zinc-900 w-full rounded-md text-white h-10 font-medium"
          >
            Cadastrar
          </button>
        </form>
        <Link to="/login">Já possui uma conta? Faça login!</Link>
      </div>
    </Container>
  );
};

export default Register;
