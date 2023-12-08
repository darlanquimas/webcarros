import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../../services/firebaseConnection";
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
const Home = () => {
  const [products, setProducts] = useState<ProductProps[]>([]);

  useEffect(() => {
    async function loadProducts() {}
    const productRef = collection(db, "products");
    const queryRef = query(productRef, orderBy("created_at", "desc"));

    getDocs(queryRef).then((snapshot) => {
      let listProducts = [] as ProductProps[];

      snapshot.forEach((doc) => {
        listProducts.push({
          id: doc.id,
          name: doc.data().name,
          price: doc.data().price,
          city: doc.data().city,
          km: doc.data().km,
          year: doc.data().year,
          model: doc.data().model,
          images: doc.data().images,
          uid: doc.data().uid,
        });
      });

      setProducts(listProducts);
    });

    loadProducts();
  }, []);

  return (
    <>
      <section className="bg-white p-4 rounded-lg w-full max-w-3xl mx-auto flex justify-center items-center gap-2">
        <input
          className="w-full border-2 rounded-lg h9 px-3 outline-none"
          type="txt"
          placeholder="Digite o nome do carro"
        />

        <button className="bg-red-500 h-9 px-8 rounded-lg text-white font-medium text-lg">
          Buscar
        </button>
      </section>

      <h1 className="font-bold text-center mt-6 text-2xl mb-4">
        Carros Novos e Usados em todo o Brasil
      </h1>

      <main className=" grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <Link key={product.id} to={`/detail/${product.id}`}>
            <section className="w-full bg-white rounded-lg">
              <img
                className="w-full rounded-lg mb-2 max-h-72 hover:scale-105 transition-all"
                src={product.images[0].url}
                alt="Carro"
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
    </>
  );
};

export default Home;
