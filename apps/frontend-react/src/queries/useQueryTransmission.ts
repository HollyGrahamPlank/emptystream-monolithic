import { DbObject, ITransmission } from "@emptystream/shared";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import TransmissionAPI from "../api/TransmissionAPI";

export interface UseQueryTransmissionProps {
  id: string;
  initialData?: DbObject<ITransmission>;
}

export default function useQueryTransmission({ id, initialData }: UseQueryTransmissionProps) {
  const [refetchInterval, setRefetchInterval] = useState<number | false>(false);

  // Configure the query itself
  const query = useQuery({
    queryKey: ["transmission", "id", id],
    queryFn: () => TransmissionAPI.get(id),
    staleTime: 1000 * 60,
    refetchInterval,
    initialData,
  });

  // If we're still loading the query, EXIT EARLY
  if (!query.data) return undefined;

  // Adjust the refetch interval depending on the split operation status
  switch (query.data.splitOperation.status) {
    /** If this query is not loading, mark that it shouldn't auto refresh */
    case "complete":
    case "failed":
      if (refetchInterval !== false) setRefetchInterval(false);
      break;

    /** If this query is still loading, mark that it should refresh every so often. */
    default:
      if (refetchInterval !== 1000 * 1) setRefetchInterval(1000 * 1);
      break;
  }

  return query.data;
}