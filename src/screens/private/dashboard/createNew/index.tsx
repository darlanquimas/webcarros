import React from "react";
import { FiUpload } from "react-icons/fi";

const CreateNew = () => {
  return (
    <>
      <div className="w-full bg-white p-3 rounded-lg flex flex-col sm:flex-row items-center gap-2">
        <button className="border-2 w-12 rounded-lg flex items-center justify-center cursor-pointer border-gray-600 h-15 md:w-20 md:h-20 ">
          <div className="absolute cursor-pointer">
            <FiUpload size={30} color="#000" />
          </div>
          <div className="cursor-pointer">
            <input
              type="file"
              accept="image/*"
              className="opacity-0 cursor-pointer  h-full"
            />
          </div>
        </button>
      </div>
      <div>
        <h1 className="w-full bg-white p-3 rounded-lg flex flex-col sm:flex-row items-center gap-2 mt-2">
          teste
        </h1>
      </div>
    </>
  );
};

export default CreateNew;
