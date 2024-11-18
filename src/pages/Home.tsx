import React, {useState} from "react";
import styled from "styled-components";
import {api} from "../axiosInstance";
import {Certificate} from "../type/Certificate";
import {getCertificate} from "../api/Certificate";


const Home = () => {
    const [step, setStep] = useState<number>(0);
    const [domain, setDomain] = useState<string>("");
    const [port, setPort] = useState<string>("");
    const [value, setValue] = useState<string>("");
    const handleDomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDomain(e.target.value);
    }

    const handlePortChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPort(e.target.value);
    }

    const handleSearchButtonClick = async () => {
        const res = await getCertificate(domain, parseInt(port));
        const certificate: Certificate = res.data;

        console.log(certificate);
        setValue(JSON.stringify(certificate, null, 2));
    }

    return (
        <PageLayout>
            <Title>
                지금 사용하고 있는 서비스의 인증서를 확인해보세요!
            </Title>
            <HelpGuide>
                128.128.128.128 형태의 IP 주소, 혹은 www.naver.com 같은 도메인 주소와
                443, 80, 8080 과 같은 포트번호를 입력하시고 검색을 눌러주세요!

                잠시만, 기다리시면 인증서 정보를 가져다 드릴게요!
            </HelpGuide>
            <SearchBar>
                <DomainInput placeholder={"도메인"} onChange={handleDomainChange} />
                <PortInput placeholder={"포트"} onChange={handlePortChange} />
                <SearchButton onClick={handleSearchButtonClick}>검색</SearchButton>
            </SearchBar>
            <CertificateJson value={value}/>
        </PageLayout>
    );
};


const PageLayout = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: #ad7a7a;
    width: 100%;
    height: 100%;
`;

const Title = styled.h1`
    font-size: 2rem;
    font-weight: bold;
    margin-bottom: 2rem;
`;

const HelpGuide = styled.div`
    font-size: 1rem;
    margin-bottom: 1rem;
`;

const SearchBar = styled.div`
    border: 1px solid black;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 30rem;
    hieght: 2rem;
`;

const Input = styled.input`
    height: 4rem;
    border-radius: 0.5rem;
    border: 1px solid black;
`;

const DomainInput = styled(Input)`
    width: 60%;
    margin-right: 1rem;
`;

const PortInput = styled(Input)`
    width: 4rem;
`;

const SearchButton = styled.button`
    width: 4rem;
    height: 4rem;
    border-radius: 0.5rem;
`;

const CertificateJson = styled.textarea`
    width: 30rem;
    height: 30rem;
`;

export default Home;