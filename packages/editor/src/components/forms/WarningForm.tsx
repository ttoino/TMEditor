import React from "react";
import type { Warning } from "@types";
import FormComponent from "../FormComponent";
import updateAt from "@app/util/updateAt";
import { styled } from "@common/theme";
import FormProps from "./FormProps";

export default function WarningForm({
    warning,
    update,
}: FormProps<Warning, "warning">) {
    return (
        <>
            <StyleWarnings>
                <FormComponent
                    component="select"
                    label="Operator"
                    required
                    value={warning?.operator}
                    onValueChange={updateAt(update, "operator")}
                >
                    <option title="equal to" value="==">
                        =
                    </option>
                    <option title="different from" value="!=">
                        ≠
                    </option>
                    <option title="greater than" value=">">
                        &#62;
                    </option>
                    <option title="less than" value="<">
                        &#60;
                    </option>
                    <option title="less than or equal to" value="<=">
                        ≤
                    </option>
                    <option title="greater than or equal to" value=">=">
                        ≥
                    </option>
                </FormComponent>
            </StyleWarnings>

            <StyleWarnings>
                <FormComponent
                    component="input"
                    label="Threshold"
                    type="number"
                    required
                    value={warning?.threshold}
                    onValueChange={updateAt(update, "threshold")}
                />
            </StyleWarnings>
        </>
    );
}

const StyleWarnings = styled("div", {
    marginLeft: "$4",
});
