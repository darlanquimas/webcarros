import { zodResolver } from "@hookform/resolvers/zod";
import React, { ChangeEvent, useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { FiTrash, FiUpload } from "react-icons/fi";
import { z } from "zod";
import Input from "../../../../components/input";
import { AuthContext } from "../../../../contexts/AuthContext";
import { v4 as uuidv4 } from "uuid";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { addDoc, collection } from "firebase/firestore";
import { storage, db } from "../../../../services/firebaseConnection";

const schema = z.object({
  name: z.string().min(3, "O campo nome é obrigatório"),
  model: z.string().min(3, "O campo modelo é obrigatório"),
  year: z.string().min(3, "O campo ano é obrigatório"),
  km: z.string().min(3, "O km é obrigatório"),
  price: z.string().min(3, "O preço é obrigatório"),
  city: z.string().min(3, "A cidade é obrigatória"),
  whatsapp: z
    .string()
    .min(11, "O telefone é obrigatório")
    .refine(
      (value) => {
        const numericValue = value.replace(/\D/g, ""); // Remove caracteres não numéricos
        return /^(\d{11}|\d{12})$/.test(numericValue);
      },
      {
        message: "Número de telefone inválido",
      }
    ),
  description: z.string().min(1, "A descrição é obrigatória"),
});

type FormData = z.infer<typeof schema>;

interface ImageItemProps {
  uid: string;
  name: string;
  previewUrl: string;
  url: string;
}
const CreateNew = () => {
  const { user } = useContext(AuthContext);

  const [productImages, setProductImages] = useState<ImageItemProps[]>([]);
  const [model, setModel] = useState<any>(null);
  const [showImageError, setShowImageError] = useState<any>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  function onSubmit(data: FormData) {
    console.log(productImages.length);
    if (productImages.length === 0) {
      setShowImageError(true);
      return;
    }

    const productListImages = productImages.map((product) => {
      return {
        uid: product.uid,
        name: product.name,
        url: product.url,
      };
    });

    addDoc(collection(db, "products"), {
      name: data.name,
      model: data.model,
      whatsapp: data.whatsapp,
      city: data.city,
      year: data.year,
      km: data.km,
      price: data.price,
      description: data.description,
      created_at: new Date(),
      owner: user?.name,
      uid: user?.uid,
      images: productListImages,
    })
      .then(() => {
        reset();
        setProductImages([]);
        setModel(null);
        console.log("cadastrado com sucesso");
      })
      .catch((error) => console.log(error));
    console.log(data);
  }

  async function handleFile(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.files && event.target.files[0]) {
      const image = event.target.files[0];
      if (image.type === "image/jpeg" || image.type === "image/png") {
        await handleUpload(image);
      } else {
        alert("Envie uma imagem jpeg ou png");
        return;
      }
    }
  }

  async function handleUpload(image: File) {
    if (!user?.uid) {
      return;
    }
    setShowImageError(false);

    const currentUid = user?.uid;
    const uidImage = uuidv4();

    const uploadRef = ref(storage, `images/${currentUid}/${uidImage}`);

    await uploadBytes(uploadRef, image).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((downloadUrl) => {
        const imageItem = {
          name: uidImage,
          uid: currentUid,
          previewUrl: URL.createObjectURL(image),
          url: downloadUrl,
        };

        setProductImages((images) => [...images, imageItem]);
      });
    });
  }

  async function handleDeleteImage(item: ImageItemProps) {
    console.log(item);
    const imagePath = `images/${item.uid}/${item.name}`;

    const imageRef = ref(storage, imagePath);

    try {
      await deleteObject(imageRef);
      setProductImages(
        productImages.filter((product) => product.url !== item.url)
      );
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <>
      <div className="w-full bg-white p-3 rounded-lg flex flex-col sm:flex-row items-center gap-2">
        <button className="border-2 w-48 rounded-lg flex items-center justify-center cursor-pointer border-gray-600 h-48 md:w-20 md:h-20 ">
          <div className="absolute cursor-pointer">
            <FiUpload size={30} color="#000" />
          </div>
          <div className="cursor-pointer">
            <input
              type="file"
              accept="image/*"
              className="opacity-0 cursor-pointer  h-full"
              onChange={handleFile}
            />
          </div>
        </button>
        {showImageError && (
          <p className="mb-1 text-red-500">
            É necessário enviar ao menos uma imagem
          </p>
        )}
        {productImages.map((item) => (
          <div
            key={item.name}
            className="w-full h-32 flex items-center justify-center relative"
          >
            <button
              className="absolute rounded-lg border p-2 drop-shadow-md bg-gray-800 opacity-50"
              onClick={() => handleDeleteImage(item)}
            >
              <FiTrash size={28} color="#fff" />
            </button>
            <img
              src={item.previewUrl}
              alt={item.name}
              className="rounded-lg w-full h-32 object-cover"
            />
          </div>
        ))}
      </div>

      <div className="w-full bg-white p-3 rounded-lg flex flex-col sm:flex-row items-center gap-2 mt-2">
        <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <p className="mb-1 font-medium">Nome do carro</p>
            <Input
              type="text"
              name="name"
              error={errors.name?.message}
              register={register}
              placeholder="Ex: Onix 1.0..."
            />
          </div>
          <div className="mb-3">
            <p className="mb-1  font-medium">Modelo do carro</p>
            <Input
              type="text"
              name="model"
              error={errors.model?.message}
              register={register}
              placeholder="Ex: Onix 1.0 flex plus manual"
              onChange={(event) => setModel(event.target?.value.toUpperCase())}
              value={model}
            />
          </div>

          <div className="flex w-full mb-3 flex-row items-center gap-4">
            <div className="w-full">
              <p className="mb-1  font-medium">Ano</p>
              <Input
                type="text"
                name="year"
                error={errors.year?.message}
                register={register}
                placeholder="Ex: 2016/2016"
              />
            </div>

            <div className="w-full">
              <p className="mb-1  font-medium">KMs Rodados</p>
              <Input
                type="text"
                name="km"
                error={errors.km?.message}
                register={register}
                placeholder="Ex: 23.0150"
              />
            </div>
          </div>
          <div className="flex w-full mb-3 flex-row items-center gap-4">
            <div className="w-full">
              <p className="mb-1 font-medium">Telefone:</p>
              <Input
                type="text"
                name="whatsapp"
                error={errors.whatsapp?.message}
                register={register}
                placeholder="Ex: 022 98899-9669"
              />
            </div>

            <div className="w-full">
              <p className="mb-1  font-medium">Cidade</p>
              <Input
                type="text"
                name="city"
                error={errors.city?.message}
                register={register}
                placeholder="Ex: Nova Friburgo - RJ"
              />
            </div>
          </div>
          <div className="mb-3">
            <p className="mb-1  font-medium">Preço R$</p>
            <Input
              type="text"
              name="price"
              error={errors.price?.message}
              register={register}
              placeholder="Ex: R$18.922,54"
            />
          </div>
          <div className="mb-3">
            <p className="mb-1  font-medium">Descrição</p>
            <textarea
              className="border-2 w-full rounded-md h24 px-2"
              {...register("description")}
              name="description"
              id="description"
            />
            {errors.description && (
              <p className="mb-1 text-red-500">{errors.description?.message}</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full rounded-md bg-zinc-900 text-white font-medium h-10"
          >
            Cadastrar
          </button>
        </form>
      </div>
    </>
  );
};

export default CreateNew;
