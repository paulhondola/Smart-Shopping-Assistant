import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productsApi } from "@/api/client/ProductApiClient";
import { queryKeys } from "@/lib/queryKeys";

export function useProduct(id: number) {
  return useQuery({
    queryKey: queryKeys.product(id),
    queryFn: () => productsApi.getById(id),
    enabled: !isNaN(id),
  });
}

export function useProducts() {
  return useQuery({
    queryKey: queryKeys.products,
    queryFn: productsApi.getAll,
  });
}

export function useDeleteProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => productsApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.products }),
  });
}
