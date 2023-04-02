import {
    MutationKey,
    useQuery,
    useMutation,
    UseQueryResult,
    useQueryClient,
    UseMutateFunction,
} from "react-query";

type Optional<T> = T | undefined;

type UseLocalState = <T>(
    key: MutationKey,
    get: () => Promise<T>,
    sync: (data: T) => Promise<T>
) => {
    state: UseQueryResult<T, any>;
    update: (callback: (old: Optional<T>) => Optional<T>) => unknown;
    sync: UseMutateFunction<T, any, void>;
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
        { retry: false, cacheTime: Infinity }
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
        update: (callback: (old: Optional<T>) => Optional<T>) =>
            queryClient.setQueryData([key, "local"], callback(data.data)),
        sync: mutation.mutate,
    };
};

export default useLocalState;
