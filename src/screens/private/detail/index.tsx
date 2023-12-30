import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { db } from "../../../services/firebaseConnection";
import { FaWhatsapp } from "react-icons/fa";
interface ProductProps {
  id: string;
  name: string;
  model: string;
  year: string;
  city: string;
  description: string;
  km: string;
  price: string;
  images: ImageItemProps[];
  uid: string;
  created_at: Date;
  owner: string;
  whatsapp: String;
}
interface ImageItemProps {
  uid: string;
  name: string;
  url: string;
}

const Detail = () => {
  const [product, setProduct] = useState<ProductProps | null>(null);
  const [loadImages, setLoadImages] = useState<string[]>([]);
  const { id } = useParams();

  function handleIamgeLoad(id: string) {
    setLoadImages((imageLeaded) => [...imageLeaded, id]);
  }

  useEffect(() => {
    async function loadProduct() {
      if (!id) {
        return;
      }
      const docRef = doc(db, "products", id);
      getDoc(docRef).then((snapshot) => {
        setProduct({
          id: snapshot.id,
          name: snapshot.data()?.name,
          model: snapshot.data()?.model,
          year: snapshot.data()?.year,
          city: snapshot.data()?.city,
          description: snapshot.data()?.description,
          km: snapshot.data()?.km,
          price: snapshot.data()?.price,
          uid: snapshot.data()?.uid,
          created_at: snapshot.data()?.created_at,
          owner: snapshot.data()?.owner,
          whatsapp: snapshot.data()?.whatsapp,
          images: snapshot.data()?.images,
        });
      });
    }
    loadProduct();
  }, [id]);

  return (
    <>
      <h1>slider</h1>

      {product && (
        <main className=" w-full bg-white rounded-lg p-6 my-4">
          <div className="flex flex-col sm:flex-row mb4 items-center justify-between">
            <h1 className="font-bold text-3xl text-black">{product?.name}</h1>
            <h1 className="font-bold text-3xl text-black">
              R${product?.price}
            </h1>
          </div>
          <p>{product.model}</p>
          <div className="flex w-full gap-6 my4">
            <div className="flex flex-col gap-4">
              <div>
                <p>Cidade</p>
                <strong>{product?.city}</strong>
              </div>
              <div>
                <p>Ano</p>
                <strong>{product?.year}</strong>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <p>KM</p>
                <strong>{product?.km}</strong>
              </div>
            </div>
          </div>

          <strong>Descrição</strong>
          <p className="mb-4">{product?.description}</p>

          <strong>Telefone / Whatsapp</strong>
          <p>{product?.whatsapp}</p>

          <a className="cursor-pointer bg-green-500 w-full text-white flex items-center justify-center gap-2 my-6 h-11 text-xl rounded-lg font-medium">
            Conversar com o vendedor <FaWhatsapp size={26} color="#FFF" />
          </a>
        </main>
      )}
    </>
  );
};

export default Detail;
