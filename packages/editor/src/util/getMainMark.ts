import { CompositeMark } from "vega-lite/build/src/compositemark";
import { Mark, isMarkDef } from "vega-lite/build/src/mark";
import {
    BaseSpec,
    isFacetSpec,
    isLayerSpec,
    isRepeatSpec,
    isUnitSpec,
} from "vega-lite/build/src/spec";
import {
    isConcatSpec,
    isHConcatSpec,
    isVConcatSpec,
} from "vega-lite/build/src/spec/concat";

const getMainMark = (spec: BaseSpec): Mark | CompositeMark | undefined => {
    if (isFacetSpec(spec) || isRepeatSpec(spec)) {
        return getMainMark(spec.spec);
    }

    if (isLayerSpec(spec)) {
        return getMainMark(spec.layer[0]);
    }

    if (isConcatSpec(spec)) {
        return getMainMark(spec.concat[0]);
    }

    if (isVConcatSpec(spec)) {
        return getMainMark(spec.vconcat[0]);
    }

    if (isHConcatSpec(spec)) {
        return getMainMark(spec.hconcat[0]);
    }

    if (isUnitSpec(spec)) {
        return isMarkDef(spec.mark) ? spec.mark.type : spec.mark;
    }
};

export default getMainMark;
