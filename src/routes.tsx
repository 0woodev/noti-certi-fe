import {Route, Routes} from "react-router-dom";
import React from "react";
import Home from "./pages/Home";
import CertificateNew from "./pages/DomainDetail";
import DomainDetail from "./pages/DomainDetail";
import DomainList from "./pages/DomainList";
import AppList from "./pages/AppList";


const BaseRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/domain" element={<DomainList />} />
            <Route path="/domain/:id" element={<DomainDetail />} />
            <Route path="/certificate/new" element={<CertificateNew />} />
            <Route path="/app" element={<AppList />} />
        </Routes>
    );
}

export default BaseRouter;