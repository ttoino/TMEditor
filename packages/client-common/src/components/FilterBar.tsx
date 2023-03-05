import React from "react";
import Select from "react-select";
import { useSearchParams } from "react-router-dom";

import { styled } from "@common/theme";
import DatePicker from "./DatePicker";
import useParticipants from "../hooks/useParticipants";
import useCohorts from "../hooks/useCohorts";

export default function FilterBar() {
    const { data: participants } = useParticipants();
    const cohorts = useCohorts();
    const [searchParams, setSearchParams] = useSearchParams();

    const user = searchParams.get("user");
    const optionsParticipant = participants?.map(({ __key, __label }) => ({
        value: __key,
        label: __label,
    }));
    const currentUser = optionsParticipant?.find(
        (item) => item.value.toString() === user
    );

    const cohort = searchParams.get("cohort");
    const optionsCohorts = cohorts.map((item) => ({
        value: item,
        label: item,
    }));
    const currentCohort = optionsCohorts.find((item) => item.value === cohort);

    const handleChange = (newValue: any, action: any) => {
        const newSearchParams = new URLSearchParams(searchParams);

        if (newValue !== null) {
            newSearchParams.set(action.name, newValue.value);
        } else {
            newSearchParams.delete(action.name);
        }

        setSearchParams(newSearchParams);
    };
    return (
        <Wrapper>
            <div style={{ display: "flex", gap: 16 }}>
                {cohorts.length > 0 && (
                    <Select
                        name="cohort"
                        placeholder="Search cohorts..."
                        styles={customStyles}
                        value={currentCohort}
                        isClearable={true}
                        onChange={handleChange}
                        options={optionsCohorts}
                    />
                )}

                <Select
                    name="user"
                    placeholder="Search participants..."
                    styles={customStyles}
                    value={currentUser}
                    isClearable={true}
                    onChange={handleChange}
                    options={optionsParticipant}
                />
            </div>

            <DatePicker />
        </Wrapper>
    );
}

const Wrapper = styled("div", {
    display: "flex",
    justifyContent: "space-between",
});

const customStyles = {
    control: (provided: any) => ({
        ...provided,
        width: 300,
    }),
};
