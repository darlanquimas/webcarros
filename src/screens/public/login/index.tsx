import { Link } from "react-router-dom";
import logoimg from "../../../assets/logo.svg";
import Container from "../../../components/container";
import Input from "../../../components/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  email: z.string().email("Insira um email válido"),
  password: z.string().min(1, "A senha é obrigatória"),
});

type FormData = z.infer<typeof schema>;

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  function onSubmit(data: FormData) {
    console.log(data);
  }

  return (
    <Container>
      <div className="w-full min-h-screen flex justify-center items-center flex-col gap-4">
        <Link to="/" className="mb-6 max-w-sm w-full">
          <img className="w-full" src={logoimg} alt="logo" />
        </Link>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white max-w-xl w-full rounded-lg"
        >
          <div className="mb-3">
            <Input
              type="email"
              placeholder="Digite seu email.."
              name="email"
              error={errors.email?.message}
              register={register}
            />
          </div>

          <div className="mb-3">
            <Input
              type="password"
              placeholder="*********"
              name="password"
              error={errors.password?.message}
              register={register}
            />
          </div>
          <button>Acessar</button>
        </form>
      </div>
    </Container>
  );
};

export default Login;
