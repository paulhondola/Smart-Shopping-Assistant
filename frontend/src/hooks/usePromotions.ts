import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { promotionsApi } from "@/api/client/PromotionsApiClient";
import { queryKeys } from "@/lib/queryKeys";

export function usePromotions() {
  return useQuery({
    queryKey: queryKeys.promotions,
    queryFn: promotionsApi.getAll,
  });
}

export function useDeletePromotion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => promotionsApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.promotions }),
  });
}
