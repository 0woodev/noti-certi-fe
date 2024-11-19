// src/components/Header.tsx
import styled from "styled-components";
import {useNavigate} from "react-router-dom";

const Header: React.FC = () => {
    const navigate = useNavigate();

    const handleLogoButtonClick = () => {
        navigate("/");
    }

    const handleAppButtonClick = () => {
        navigate("/app");
    }

    const handleDomainButtonClick = () => {
        navigate("/domain");
    }

    const handleTeamButtonClick = () => {
        navigate("/team");
    }

    return (
        <HeaderContainer>
            <LogoContainer onClick={handleLogoButtonClick}>
                <LogoIcon src="/logo.png" />
                <LogoText>
                    <Title>NOTI CERTI</Title>
                    <SubTitle>인증서 통합 관리 솔루션</SubTitle>
                </LogoText>
            </LogoContainer>
            <NavigatorWrapper>
                <Navigator onClick={handleLogoButtonClick}>HOME</Navigator>
                <Navigator onClick={handleAppButtonClick}>APP</Navigator>
                <Navigator onClick={handleDomainButtonClick}>DOMAIN</Navigator>
                <Navigator onClick={handleTeamButtonClick}>TEAM</Navigator>
            </NavigatorWrapper>
        </HeaderContainer>
    );
};

const NavigatorWrapper = styled.div`
    display: flex;
    justify-content: flex-end;
    flex-direction: row;
    align-items: center;
    height: 100%;
    width: fit-content;
    right: 0;
    //border: 1px solid black;
    position: absolute;
`;

const Navigator = styled.div`
    height: 100%;
    width: 5rem;
    display: flex;
    justify-content: center;
    align-items: center;
    
    &:hover {
        font-weight: bold;
    }
`;


// Styled Components

const HeaderContainer = styled.header`
    display: flex;
    justify-content: center;
    position: relative;
    align-items: center;
    padding: 0 20px;
    background-color: #f1f1f1;
    height: 50px;
    width: 100%;
`;

const LogoContainer = styled.div`
    width: fit-content;
    font-size: 24px;
    font-weight: bold;
    cursor: pointer;
    display: flex;
    flex-direction: row;
    height: 100%;
`;

const LogoText = styled.div`
    width: 120px;
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
