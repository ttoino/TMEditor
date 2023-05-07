import Sidebar from "@app/components/Sidebar";
import React from "react";
import { Outlet } from "react-router-dom";
import { styled } from "@common/theme";

const DashboardSkeleton = () => (
    <Wrapper>
        <Sidebar />
        <Main>
            <Outlet />
        </Main>
    </Wrapper>
);

export default DashboardSkeleton;

const Wrapper = styled("div", {
    display: "grid",
    gridTemplateColumns: "300px 1fr",
    minHeight: "100vh",
    backgroundColor: "$neutral50",
});

const Main = styled("div", {
    overflow: "hidden",
});
