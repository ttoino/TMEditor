import { UpdateFn } from "@app/hooks/useLocalState";

type FormProps<T, K extends string = "component"> = {
    [_ in K]: T | undefined;
} & {
    update: UpdateFn<T>;
};

export default FormProps;
