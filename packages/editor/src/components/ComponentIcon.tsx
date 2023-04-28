import React from "react";
import { UIComponent } from "@types";
import {
    MdAreaChart,
    MdBarChart,
    MdCandlestickChart,
    MdImage,
    MdInfo,
    MdMap,
    MdNotes,
    MdNumbers,
    MdPieChart,
    MdRectangle,
    MdScatterPlot,
    MdShowChart,
    MdStackedLineChart,
    MdTabUnselected,
    MdTableChart,
    MdTextFields,
    MdTitle,
    MdViewColumn,
    MdWaterfallChart,
} from "react-icons/md";
import { styled } from "@common/theme";
import { TopLevelSpec } from "vega-lite";
import getMainMark from "@app/util/getMainMark";

interface Props {
    component: UIComponent;
}

function ComponentIcon({ component, ...rest }: Props) {
    switch (component.type) {
    case "chart": {
        const spec = component.spec as TopLevelSpec;
        const mark = getMainMark(spec);

        switch (mark) {
        case "area":
            return <MdAreaChart {...rest} />;

        case "arc":
            return <MdPieChart {...rest} />;

        case "boxplot":
        case "errorbar":
            return <MdCandlestickChart {...rest} />;

        case "circle":
        case "point":
        case "square":
            return <MdScatterPlot {...rest} />;

        case "errorband":
            return <MdStackedLineChart {...rest} />;

        case "line":
        case "rule":
        case "trail":
            return <MdShowChart {...rest} />;

        case "geoshape":
            return <MdMap {...rest} />;

        case "image":
            return <MdImage {...rest} />;

        case "rect":
            return <MdRectangle {...rest} />;

        case "text":
            return <MdTextFields {...rest} />;

        case "tick":
            return <MdWaterfallChart {...rest} />;

        case "bar":
        default:
            return <MdBarChart {...rest} />;
        };
    }

    case "columns":
        return <MdViewColumn {...rest} />;
    case "heading":
        return <MdTitle {...rest} />;
    case "info":
        return <MdInfo {...rest} />;
    case "summary":
        return <MdNotes {...rest} />;
    case "table":
        return <MdTableChart {...rest} />;
    case "tabs":
        return <MdTabUnselected {...rest} />;
    case "value":
        return <MdNumbers {...rest} />;
    }
}

export default styled(ComponentIcon, { fontSize: "24px" });
