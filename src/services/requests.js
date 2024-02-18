// import { useMutation } from "@apollo/client";
// import { CREATE_PRODUCT } from "./mutations";

import { useMutation } from "@apollo/client";
import { CREATE_PRODUCT } from "./mutations";

export const addPosts = async (file) => {
  try {
    console.log(file);
    const response = await fetch(
      "https://oafr1w3y52.execute-api.ap-southeast-2.amazonaws.com/default/btss-getPresignedUrl",
      {
        method: "PUT",
        headers: {
          "Content-Type": "image/jpeg",
          // Accept: "*/*",
          // "Accept-Encoding": "gzip, deflate, br",
          // Connection: "keep-alive",
        },
        body: file,
      }
    );

    // if (!response.ok) {
    //   throw new Error(`HTTP error! status: ${response}`);
    // }
    const data = await response.json();
    console.log(data.fileName);
    // return `https://btss-uploads.s3.ap-southeast-2.amazonaws.com/${data.fileName}`; // Return the filename
    return `https://d38ozmgi8b70tu.cloudfront.net/${data.fileName}`;
  } catch (err) {
    console.error("Error adding post:", err);
  }
};

export const useAddProduct = () => {
  const [createProduct, { data, loading, error }] = useMutation(CREATE_PRODUCT);

  const handleAddProduct = async (productData) => {
    try {
      await createProduct({
        variables: {
          input: productData,
        },
      });

      return data;
    } catch (err) {
      console.error("Error adding post:", err);
    }
  };

  return { handleAddProduct, loading, error };
};
