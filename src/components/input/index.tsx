import { UseFormRegister, RegisterOptions } from "react-hook-form";

interface InputProps {
  type: string;
  placeholder: string;
  name: string;
  register: UseFormRegister<any>;
  error?: string;
  rules?: RegisterOptions;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value?: any;
}

const Input = ({
  type,
  placeholder,
  name,
  register,
  rules,
  error,
  value,
  onChange,
}: InputProps) => {
  return (
    <div>
      <input
        className="w-full border-2 rounded-md h-11 px-2"
        placeholder={placeholder}
        type={type}
        {...register(name, rules)}
        id={name}
        onChange={onChange}
        value={value}
      />
      {error && <p className="my-1 text-red-500">{error}</p>}
    </div>
  );
};

export default Input;
