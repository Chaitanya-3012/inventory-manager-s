import dummyData from "./dummy-data.json";

export function populateProductReferences(product: any) {
  if (!product) return product;

  const supplier = dummyData.suppliers.find(
    (s) => s._id === product.supplierId,
  );
  const creator = dummyData.users.find((u) => u._id === product.createdBy);

  return {
    ...product,
    supplierId: supplier || { _id: product.supplierId, name: "Unknown" },
    createdBy: creator || { _id: product.createdBy, name: "Unknown" },
  };
}

export function populateProductsReferences(products: any[]) {
  return products.map(populateProductReferences);
}
