import { UpdateFn } from "@app/hooks/useLocalState";
import updateAt from "./updateAt";

const deleteAt: <T extends object, P extends string>(
    update: UpdateFn<T>,
    path: P
) => () => unknown = (update, path) => {
    const i = path.lastIndexOf(".");
    const prefix = i === -1 ? path : path.slice(0, i);
    const suffix = i === -1 ? path : path.slice(i + 1);

    if (i !== -1) {
        update = updateAt(update, prefix);
    }

    return () =>
        // @ts-ignore
        update((data) => {
            if (data === undefined) {
                throw Error("No data");
            }

            if (data instanceof Array) {
                const r = [...data];
                r.splice(parseInt(suffix), 1);
                return r;
            }

            const r = { ...data };
            // @ts-ignore
            delete r[suffix];
            return r;
        });
};

export default deleteAt;
