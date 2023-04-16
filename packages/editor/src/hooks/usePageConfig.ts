import { putPage } from "@app/api";
import { getPage } from "@common/api";
import type { Page, UIComponent, UIComponentResponse } from "@types";
import useLocalState from "./useLocalState";

const removeData = (component: UIComponentResponse) => {
    // @ts-ignore
    if (component.components) {
        // @ts-ignore
        component.components = component.components.map(removeData);
    }

    // @ts-ignore
    delete component.data;
    // @ts-ignore
    delete component.meta;
    delete component.error;

    return component as UIComponent;
};

const usePageConfig = (page: string | undefined) =>
    useLocalState<Page>(
        ["page", page],
        async () => {
            const config = await getPage(page, new URLSearchParams());

            // @ts-ignore
            config.components = config.components.map(removeData);

            return config as Page;
        },
        (config) => putPage(page, config)
    );

export default usePageConfig;
