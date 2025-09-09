// app/seller/products/add/page.tsx
import ProductForm from "@/components/productForm";

const AddProductPage = () => {
  return (
    <div className="max-w-3xl mx-auto py-12">
      <h1 className="text-3xl font-bold mb-6">Add New Product</h1>
      <ProductForm />
    </div>
  );
};

export default AddProductPage;
