// app/seller/products/[slug]/edit/page.tsx
import ProductForm from "@/components/productForm";
import api from "@/lib/api";

const getProduct = async (slug: string) => {
  try {
    const res = await api.get(`/catalog/products/${slug}/`);
    return res.data;
  } catch (error) {
    if (error.response?.status === 404) {
      return null;
    }
    throw error; // re-throw other errors
  }
};
const EditProductPage = async ({ params }) => {
  const product = await getProduct(params.slug);

  if (!product) {
    return <div>Product not found.</div>; // or redirect, or throw 404
  }

  return (
    <div>
      <h1>Edit Product: {product.title}</h1>
    </div>
  );
};

export default EditProductPage;
