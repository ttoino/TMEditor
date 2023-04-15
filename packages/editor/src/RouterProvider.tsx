// @flow
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import DashboardSkeleton from "./containers/DashboardSkeleton";
import HomeContainer from "./containers/HomeContainer";
import PageContainer from "./containers/PageContainer";
import DatabaseContainer from "./containers/DatabaseContainer";
import ReducersContainer from "./containers/ReducersContainer";

const RouterProvider = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<DashboardSkeleton />}>
                    <Route index element={<HomeContainer />} />
                    <Route path="/pages/:page" element={<PageContainer />} />
                    <Route path="/databases/:database" element={<DatabaseContainer />} />
                    <Route path="/reducers" element={<ReducersContainer />} />
                </Route>
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </BrowserRouter>
    );
};

export default RouterProvider;
