import {
    MutationKey,
    useQuery,
    useMutation,
    UseQueryResult,
    useQueryClient,
    UseMutateFunction,
    notifyManager,
} from "react-query";
import type { Updater } from "react-query/types/core/utils";

export type UpdateFn<T> = (updater: Updater<T | undefined, T>) => unknown;

type UseLocalState = <T>(
    key: MutationKey,
    get: () => Promise<T>,
    sync: (data: T) => Promise<T>
) => {
    state: UseQueryResult<T, any>;
    update: UpdateFn<T>;
    updated: boolean;
    sync: UseMutateFunction<T, any, void>;
    syncing: boolean;
};

const useLocalState: UseLocalState = <T>(
    key: MutationKey,
    get: () => Promise<T>,
    sync: (data: T) => Promise<T>
) => {
    const queryClient = useQueryClient();

    const serverData = useQuery<T, any>(key, get);
    const localData = useQuery<T, any>(
        [key, "local"],
        async () => {
            throw Error(`No data at ${key}`);
        },
        { retry: false, cacheTime: Infinity, staleTime: Infinity }
    );

    const data = localData.data ? localData : serverData;

    const mutation = useMutation(
        key,
        () =>
            data.data
                ? sync(data.data)
                : Promise.reject(Error(`No data at ${key}`)),
        {
            onSuccess: (data: T) => {
                queryClient.setQueryData(key, data);
                queryClient.removeQueries([key, "local"]);
            },
        }
    );

    return {
        state: data,
        update: (updater: Updater<T | undefined, T>) => {
            // HACK: This forces react-query to re-render synchronously
            const oldSchedule = notifyManager.schedule;
            notifyManager.schedule = (callback) => callback();
            if (localData.data === undefined && data.data !== undefined) {
                queryClient.setQueryData([key, "local"], data.data);
            }
            queryClient.setQueryData([key, "local"], updater);
            notifyManager.schedule = oldSchedule;
        },
        updated: !!localData.data,
        sync: mutation.mutate,
        syncing: mutation.isLoading,
    };
};

export default useLocalState;
