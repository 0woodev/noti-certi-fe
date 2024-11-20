import {Route, Routes} from "react-router-dom";
import React from "react";
import CertificateNew from "./pages/DomainDetail";
import DomainDetail from "./pages/DomainDetail";
import DomainList from "./pages/DomainList";
import AppList from "./pages/AppList";
import AppDetail from "./pages/AppDetail";

const BaseRouter = () => {

    return (
        <Routes>
            <Route path="/" element={<DomainList />} />
            <Route path="/domain" element={<DomainList />} />
            <Route path="/domain/:id" element={<DomainDetail />} />
            <Route path="/certificate/new" element={<CertificateNew />} />
            <Route path="/app" element={<AppList />} />
            <Route path="/app/:id" element={<AppDetail />} />
        </Routes>
    );
}

export default BaseRouter;