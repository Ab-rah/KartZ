// app/seller/products/[slug]/edit/page.tsx
import ProductForm from "@/components/productForm";
import api from "@/lib/api";
import { notFound } from "next/navigation";

const getProduct = async (slug: string) => {
  try {
    const res = await api.get(`/catalog/products/${slug}/`);
    return res.data;
  } catch (error) {
    if (error.response?.status === 404) {
      return null;
    }
    throw error;
  }
};

type EditProductPageProps = {
  params: Promise<{ slug: string }>;
};

const EditProductPage = async ({ params }: EditProductPageProps) => {
  const { slug } = await params; // Await here!

  const product = await getProduct(slug);

  if (!product) {
    notFound(); // triggers 404 page
  }

  return (
    <div>
      <h1>Edit Product: {product.title}</h1>
      <ProductForm initialData={product} />
    </div>
  );
};

export default EditProductPage;
