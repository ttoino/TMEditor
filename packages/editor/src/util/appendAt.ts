import { UpdateFn } from "@app/hooks/useLocalState";
import updateAt, { FromPath } from "./updateAt";

const appendAt: <
    T extends object,
    P extends string,
    D extends unknown[] = FromPath<T, P>
>(
    update: UpdateFn<T>,
    path: P,
    defaultValue?: D[number]
) => typeof defaultValue extends undefined
    ? UpdateFn<D[number]>
    : UpdateFn<D[number]> & (() => unknown) = (update, path, defaultValue) => {
        const updater = updateAt(update, path);

        return (data = defaultValue) =>
            // @ts-ignore
            updater((oldData) => {
                if (oldData === undefined || !(oldData instanceof Array)) {
                    return [data];
                }

                return [...oldData, data];
            });
    };

export default appendAt;
