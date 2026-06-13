import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { categoriesApi } from "@/api/client/CategoryApiClient";
import { queryKeys } from "@/lib/queryKeys";

export function useCategories() {
  return useQuery({
    queryKey: queryKeys.categories,
    queryFn: categoriesApi.getAll,
  });
}

export function useDeleteCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => categoriesApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.categories }),
  });
}
