// src/Layout.tsx
import styled from "styled-components";
import Header from "./components/Header";

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <ViewWrapper id="wrap">
            <Header />
            <Content>{children}</Content>
        </ViewWrapper>
    );
};

const ViewWrapper = styled.div`
    min-height: 100vh;
    max-height: 100vh;
    height: 100vh;
    width: 100vw;
    display: flex;
    flex-direction: column;
`;

const Content = styled.main`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    min-height: calc(100vh - 50px);
    border: 1px solid black;
    position: relative;
`;

export default Layout;
