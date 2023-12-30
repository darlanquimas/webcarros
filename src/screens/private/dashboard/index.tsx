import {
  collection,
  getDocs,
  query,
  where,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { useEffect, useState, useContext } from "react";
import { FiTrash2 } from "react-icons/fi";
import { Link } from "react-router-dom";
import { db, storage } from "../../../services/firebaseConnection";
import { AuthContext } from "../../../contexts/AuthContext";
import { deleteObject, ref } from "firebase/storage";

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

const Dashboard = () => {
  const [products, setProducts] = useState<ProductProps[]>([]);
  const [loadImages, setLoadImages] = useState<string[]>([]);
  const { user } = useContext(AuthContext);

  function handleIamgeLoad(id: string) {
    setLoadImages((imageLeaded) => [...imageLeaded, id]);
  }

  async function handleDeleteProduct(product: ProductProps) {
    const itemProduct = product;

    const docRef = doc(db, "products", product.id);
    await deleteDoc(docRef);

    itemProduct.images.map(async (image) => {
      const imagePath = `images/${image.uid}/${image.name}`;
      const imageRef = ref(storage, imagePath);

      await deleteObject(imageRef);
      setProducts(products.filter((product) => product.id !== itemProduct.id));
    });
  }

  useEffect(() => {
    async function loadProducts() {}
    if (!user?.uid) {
      return;
    }

    const productRef = collection(db, "products");
    const queryRef = query(productRef, where("uid", "==", user.uid));

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
  }, [user]);
  return (
    <>
      <main className="grid grid-cols-1 gap-6 md:grid-cols-2 ls:grid-cols-3">
        {products.map((product) => (
          //  <Link key={product.id} to={`/detail/${product.id}`}>
          <section className="w-full bg-white rounded-lg relative">
            <button
              className="absolute bg-white w-14 h-14 rounded-full flex items-center justify-center right-2 top-2 drop-shadow hover:opacity-80"
              onClick={() => handleDeleteProduct(product)}
            >
              <FiTrash2 size={26} color="#000" />
            </button>
            <img
              className="w-full rounded-lg mb-2 max-h-70"
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
          //      </Link>
        ))}
      </main>
    </>
  );
};

export default Dashboard;
