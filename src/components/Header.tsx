// src/components/Header.tsx
import styled from "styled-components";

const Header: React.FC = () => {

    return (
        <HeaderContainer>
            <LogoContainer>
                <LogoIcon src="/logo.png" />
                <LogoText>
                    <Title>NOTI CERTI</Title>
                    <SubTitle>인증서 통합 관리 솔루션</SubTitle>
                </LogoText>
            </LogoContainer>
        </HeaderContainer>
    );
};

// Styled Components

const HeaderContainer = styled.header`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 20px;
    background-color: #f1f1f1;
    height: 50px;
`;

const LogoContainer = styled.div`
    width: 200px;
    font-size: 24px;
    font-weight: bold;
    cursor: pointer;
    display: flex;
    flex-direction: row;
    height: 100%;
`;

const LogoText = styled.div`
    width: 150px;
    font-size: 24px;
    font-weight: bold;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    height: 100%;
    justify-content: center;
    text-align: left;
`;

const LogoIcon = styled.img`
    width: 50px;
    object-fit: contain;
    font-weight: bold;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    height: 100%;
`;

const Title = styled.div`
    width: 100%;
    letter-spacing: -2px;
`;

const SubTitle = styled.div`
    width: 100%;
    font-size: 12px;
    font-weight: lighter;
`;

export default Header;
