import { useMemo } from "react";
import { api } from "~/trpc/react";

export function useCreateMantaince() {
  const workersUsersQuery = api.user.listOperationalUsers.useQuery();
  const sinksQuery = api.sink.list.useQuery();

  const workersOptions = useMemo(() => {
    const workers = workersUsersQuery.data?.map((item) => ({
      label: item.name,
      value: item.id,
    }));
    return workers ?? [];
  }, [workersUsersQuery.data]);

  const sinksOptions = useMemo(() => {
    const sinks = sinksQuery.data?.table.map((item) => ({
      label: item.name,
      value: item.id,
    }));

    return sinks ?? [];
  }, [sinksQuery.data]);

  return {
    workersOptions,
    sinksOptions,
  };
}
