// @flow
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import DashboardSkeleton from "./containers/DashboardSkeleton";
import HomeContainer from "./containers/HomeContainer";
import PageContainer from "./containers/PageContainer";
import DatabaseContainer from "./containers/DatabaseContainer";

const RouterProvider = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<DashboardSkeleton />}>
                    <Route index element={<HomeContainer />} />
                    <Route path="/pages/:page" element={<PageContainer />} />
                    <Route path="/databases/:database" element={<DatabaseContainer />} />
                </Route>
                {/* <Route path="*" element={<Navigate to="/editor" />} /> */}
            </Routes>
        </BrowserRouter>
    );
};

export default RouterProvider;
