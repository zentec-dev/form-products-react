import { useContext, useMemo } from "react";
import { ProductsContext } from "../store/context/productsContext.jsx";
import { useFilters } from "./use-filters.js";
import {
  ProductCablesProps,
  ProductLightBulbsProps,
  ProductPropsMain,
} from "@/models/product.js";

interface UseProductsProps {
  currentPage?: string;
}

interface NewProductTest extends ProductPropsMain {
  power?: string;
  caliber?: string;
}

interface GetAllProductsToFilterProps {
  allProducts: [ProductCablesProps | ProductLightBulbsProps];
  filter: string;
}

function getAllProductsToFilter({
  allProducts,
  filter,
}: GetAllProductsToFilterProps):
  | ProductCablesProps[]
  | ProductLightBulbsProps[] {
  const [products]: any = allProducts.filter(
    (products) => Object.keys(products)[0] === filter
  );
  return products[filter];
}

export const useProducts = (props: UseProductsProps) => {
  const context = useContext(ProductsContext);
  const { products, addAllProducts, addProduct }: any = context;
  const { allProducts } = products;
  const currentPage = props?.currentPage;
  const { filters } = useFilters();
  const { stringToSearch } = filters;

  if (context === undefined) {
    throw new Error("useProducts must be used within a ProductsProvider");
  }

  const sorted = useMemo(() => {
    if (currentPage === undefined) return products;
    if (stringToSearch === "") return products;

    const allProductsClone = structuredClone(allProducts);

    const lightBulbs = getAllProductsToFilter({
      allProducts: allProductsClone,
      filter: "lightBulbs",
    });
    const cables = getAllProductsToFilter({
      allProducts: allProductsClone,
      filter: "cables",
    });

    const allProductsArrayToFilter = [...lightBulbs, ...cables];

    const filtered = allProductsArrayToFilter?.filter((obj: NewProductTest) => {
      return (
        obj.name.toLowerCase().search(stringToSearch.toLowerCase()) !== -1 ||
        obj.internalCode.toLowerCase().search(stringToSearch.toLowerCase()) !==
          -1 ||
        (obj?.power &&
          obj?.power?.toLowerCase().search(stringToSearch.toLowerCase()) !==
            -1) ||
        (obj?.caliber &&
          obj?.caliber?.toLowerCase().search(stringToSearch.toLowerCase()) !==
            -1) ||
        obj.description.toLowerCase().search(stringToSearch.toLowerCase()) !==
          -1
      );
    });

    return filtered;
  }, [products, stringToSearch]);

  return {
    products: products,
    addAllProducts,
    addProduct,
    searchProducts: sorted,
  };
};
