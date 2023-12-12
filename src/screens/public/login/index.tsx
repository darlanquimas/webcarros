import { Link } from "react-router-dom";
import logoimg from "../../../assets/logo.svg";
import Container from "../../../components/container";
import Input from "../../../components/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../../../services/firebaseConnection";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const schema = z.object({
  email: z
    .string()
    .email("Insira um email válido")
    .nonempty("O campo email é obrigatório"),
  password: z.string().nonempty("O campo senha é obrigatório"),
});

type FormData = z.infer<typeof schema>;

const Login = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  function onSubmit(data: FormData) {
    signInWithEmailAndPassword(auth, data.email, data.password)
      .then((user) => {
        console.log(user);
        navigate("/dashboard", { replace: true });
      })
      .catch((error) => {
        console.log("erro ao logar", error);
      });
    console.log(data);
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
        <h1>Acessar conta</h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white max-w-xl w-full rounded-lg p-4"
        >
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
          <button
            type="submit"
            className="bg-zinc-900 w-full rounded-md text-white h-10 font-medium"
          >
            Acessar
          </button>
        </form>
        <Link to="/register">Ainda não possui uma conta? Crie uma aqui!</Link>
      </div>
    </Container>
  );
};

export default Login;
