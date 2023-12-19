import React, { useState } from "react";
import { Link } from "react-router-dom";
interface ProductProps {
  id: string;
  name: string;
  model: string;
  year: string;
  city: string;
  km: string;
  price: string;
  images: ImageItemProps[];
  uid: string;
}
interface ImageItemProps {
  uid: string;
  name: string;
  url: string;
}

const Detail = () => {
  const products: any = [{}, {}];
  const [loadImages, setLoadImages] = useState<string[]>([]);

  function handleIamgeLoad(id: string) {
    setLoadImages((imageLeaded) => [...imageLeaded, id]);
  }

  return (
    <main className=" grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {products.map((product: ProductProps) => (
        <Link key={product.id} to={`/detail/${product.id}`}>
          <section className="w-full bg-white rounded-lg">
            <div
              className="w-full h-72 rounded-lg bg-slate-200"
              style={{
                display: loadImages.includes(product.id) ? "none" : "block",
              }}
            ></div>
            <img
              className="w-full rounded-lg mb-2 max-h-72 hover:scale-105 transition-all"
              src={product.images[0].url}
              alt="Carro"
              onLoad={() => handleIamgeLoad(product.id)}
              style={{
                display: loadImages.includes(product.id) ? "block" : "none",
              }}
            />

            <p className="font-bold mt-1 mb-2 px-2">{`${product.name} ${product.year}`}</p>

            <div className="flex flex-col px-2">
              <span className="text-zinc-700 mb-6">
                Ano {product.year} | {product.km} km
              </span>

              <strong className="text-black font-medium text-xl">
                R$ {product.price}
              </strong>
            </div>

            <div className="w-full h-px bg-slate-200 my-2"></div>

            <div className=" px-2 pb-2">
              <span className="text-zinc-700">{product.city}</span>
            </div>
          </section>
        </Link>
      ))}
    </main>
  );
};

export default Detail;
