import { UpdateFn } from "@app/hooks/useLocalState";

// FIXME: The current version of snowpack doesn't support this
// export type FromPath<T extends object, P extends string> = T extends unknown[]
//     ? P extends `${infer K extends number}.${infer R}`
//         ? K extends keyof T
//             ? T[K] extends object
//                 ? FromPath<T[K], R>
//                 : never
//             : never
//         : P extends `${infer K extends number}`
//         ? K extends keyof T
//             ? T[K]
//             : never
//         : never
//     : P extends `${infer K extends string}.${infer R}`
//     ? K extends keyof T
//         ? T[K] extends object
//             ? FromPath<T[K], R>
//             : never
//         : never
//     : P extends `${infer K extends string}`
//     ? K extends keyof T
//         ? T[K]
//         : never
//     : never;

export type FromPath<T extends object, P extends string> = T extends object
    ? P extends string
        ? any
        : never
    : never;

const updateAt: <T extends object, P extends string, D = FromPath<T, P>>(
    update: UpdateFn<T>,
    path: P
) => UpdateFn<D> = (update, path) => {
    const i = path.indexOf(".");
    const k = i === -1 ? path : path.slice(0, i);

    // @ts-ignore
    const newUpdate = (updater) => {
        // @ts-ignore
        update((data) => {
            if (data === undefined) {
                throw Error("No data");
            }

            if (!path) {
                const newData =
                    updater instanceof Function ? updater(data) : updater;

                return newData;
            }

            const oldData =
                // @ts-ignore
                data instanceof Array ? data[parseInt(k)] : data[k];

            const newData =
                updater instanceof Function ? updater(oldData) : updater;

            if (data instanceof Array) {
                const r = [...data];
                r[parseInt(k)] = newData;
                return r;
            }

            return {
                ...data,
                [k]: newData,
            };
        });
    };

    if (i !== -1) {
        return updateAt(newUpdate, path.slice(i + 1));
    }

    return newUpdate;
};

export default updateAt;
