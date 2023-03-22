import { useState } from "react";
import {
    MutationKey,
    useQuery,
    useMutation,
    UseQueryResult,
    UseMutationResult,
    useQueryClient,
} from "react-query";

type LocalState<T extends object> = T & {
    __modified?: boolean | undefined;
};

const localState: Map<MutationKey, LocalState<any>> = new Map();

const useLocalState: <T extends object>(
    key: MutationKey,
    get: () => Promise<T>,
    sync: (data: T) => Promise<T>
) => {
    state: UseQueryResult<LocalState<T>, any>;
    update: (callback: (old: T | undefined) => T | undefined) => unknown;
    sync: UseMutationResult<T, any, void>;
} = <T extends object>(
    key: MutationKey,
    get: () => Promise<T>,
    sync: (data: T) => Promise<T>
) => {
    const [, setDummy] = useState(0);

    const queryClient = useQueryClient();
    const mutation = useMutation(
        key,
        () => {
            const data = localState.get(key) as LocalState<T> | undefined;
            delete data?.__modified;

            if (!data) {
                return Promise.reject(Error(`No data at ${key} to sync`));
            }

            return sync(data as T);
        },
        {
            onSuccess: (data: T) => {
                queryClient.setQueryData(key, data);
            },
        }
    );

    const serverData = useQuery<T, any>(key, get);
    const localData = localState.get(key) as LocalState<T> | undefined;

    const data = localData?.__modified
        ? { ...serverData, data: localData }
        : serverData;

    if (data.data) localState.set(key, data.data);

    return {
        state: data as UseQueryResult<LocalState<T>, any>,
        update: (callback) => {
            // @ts-ignore
            const localData = callback(data.data) as LocalState<T>;
            if (localData) localData.__modified = true;
            localState.set(key, localData);
            setDummy((dummy) => dummy + 1);
        },
        sync: mutation,
    };
};

export default useLocalState;
