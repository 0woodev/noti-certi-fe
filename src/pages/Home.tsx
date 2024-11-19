import React, {useState} from "react";
import styled from "styled-components";
import {ICertificate} from "../type/Certificate";
import {getLiveCertificate, findManagedCertificate, connectDomainAndCert} from "../api/Certificate";
import {useNavigate} from "react-router-dom";
import {IDomain} from "../type/Domain";
import {getDomainByIpAndPort, getDomainIp, saveDomain} from "../api/Domain";


const Home = () => {
    const navigate = useNavigate();
    const [host, setHost] = useState<string>("");
    const [port, setPort] = useState<number>(443);
    const [ip, setIp] = useState<string | null>(null);

    const [domain, setDomain] = useState<IDomain | null>(null);
    const [liveCertificate, setLiveCertificate] = useState<ICertificate | null>(null);
    const [managedCertificate, setManagedCertificate] = useState<ICertificate | null>(null);

    const [isInitialized, setIsInitialized] = useState<boolean>(false);

    const handleDomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setHost(e.target.value);
    }

    const handlePortChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!isNaN(+e.target.value)) {
            setPort(+e.target.value);
        }
    }

    const handleSearchButtonClick = async () => {
        if (host === "") {
            alert("도메인을 입력해주세요!");
            return;
        }

        setIsInitialized(false);
        setLiveCertificate(null);
        setManagedCertificate(null);
        setDomain(null);

        // DNS 에 등록되어 있는 IP 조회
        let ip;
        try {
            const getDomainIpRes = await getDomainIp(host, port);

            ip = getDomainIpRes.data;
            setIp(ip);
        } catch {
            alert("도메인 주소가 잘못되었거나, DNS 에 등록되어 있지 않습니다!");
            return;
        }

        // DB 에서 도메인 정보 조회
        const getDomainRes = await getDomainByIpAndPort(ip, port);
        const domain: IDomain = getDomainRes.data;
        setDomain(domain);

        // 실시간 인증서 조회
        const getLiveCertRes = await getLiveCertificate(ip, port);
        const liveCertificate: ICertificate= getLiveCertRes.data;
        setLiveCertificate(liveCertificate);

        // 관리되고 있는 인증서 조회
        const getManagedCertRes = await findManagedCertificate(ip, port);
        const managedCertificate: ICertificate= getManagedCertRes.data;
        setManagedCertificate(managedCertificate);


        setIsInitialized(true);
    }

    const handleNavigateCertificateNewButtonClick = async () => {
        let savedDomain = domain;
        if (savedDomain === null) {
            if (ip === null) {
                alert("ip 주소가 없습니다!");
                return;
            }
            const saveDomainRes = await saveDomain(host, ip!, port);
            savedDomain = saveDomainRes.data.data;
            setDomain(savedDomain);
        }

        const connectedDomainRes = await connectDomainAndCert(savedDomain!.id);
        const connectedDomain = connectedDomainRes.data;

        navigateToDomainDetail(connectedDomain.domain.id);
    }

    const navigateToDomainDetail = (domainId: number) => {
        navigate(`/domain/${domainId}`);
    }

    const handleNavigateDomainDetailButtonClick = async () => {
        if (domain !== null) {
            navigateToDomainDetail(domain.id)
        } else {
            alert("도메인 정보가 없습니다!");
        }
    }
    return (
        <PageLayout>
            <Title>
                지금 사용하고 있는 서비스의 인증서를 확인해보세요!
            </Title>
            <HelpGuide>
                <div>128.128.128.128 형태의 IP 주소, 혹은 www.naver.com 같은 도메인 주소와</div>
                <div>443, 80, 8080 과 같은 포트번호를 입력하시고 검색을 눌러주세요!</div>

                <div>잠시만, 기다리시면 인증서 정보를 가져다 드릴게요!</div>
            </HelpGuide>
            <SearchBar>
                <DomainInput placeholder={"도메인"} onChange={handleDomainChange} value={host}/>
                <PortInput placeholder={"포트"} onChange={handlePortChange} value={port}/>
                <SearchButton onClick={handleSearchButtonClick}>조회</SearchButton>
            </SearchBar>
            {isInitialized && (
                <>
                    {ip && (
                        <Info>도메인 정보: {ip}</Info>
                    )}
                    {domain ? (
                        <Managed>해당 도메인은 관리되고 있는 도메인입니다. :)</Managed>
                    ) : (
                        <NotManaged>해당 도메인은 관리되고 있지 않습니다. :(</NotManaged>
                    )}
                    {liveCertificate && (
                        <CertificateJson value={JSON.stringify(liveCertificate, null, 2)} readOnly={true}/>
                    )
                    }
                    {managedCertificate ? (
                        <Managed>이 인증서는 관리 및 모니러팅 중에 있습니다 :)</Managed>
                    ) : (
                        <NotManaged>이 인증서는 관리되고 있지 않습니다 :(</NotManaged>
                    )}
                    {(domain && managedCertificate) ? (
                        <button onClick={handleNavigateDomainDetailButtonClick}>도메인 정보 보러가기</button>
                    ) : (
                        <button onClick={handleNavigateCertificateNewButtonClick}>인증서 저장하러 가기</button>
                    )}

                </>
            )}
        </PageLayout>
    );
};


const Info = styled.div`
`;

const Managed = styled.div`
    color: green;
`;

const NotManaged = styled.div`
    color: red;
`;

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
    justify-content: space-evenly;
    align-items: center;
    width: 30rem;
    hieght: 2rem;
`;

const Input = styled.input`
    height: 4rem;
    border-radius: 0.5rem;
    border: 1px solid black;
    padding: 0 0.5rem;
`;

const DomainInput = styled(Input)`
    width: 60%;
`;

const PortInput = styled(Input)`
    width: 4rem;
`;

const SearchButton = styled.button`
    width: 4rem;
    height: 4rem;
    border-radius: 0.5rem;
    background-color: lightgray;

    &:hover {
        background-color: gray;
        color: white;
        cursor: pointer;
        //transition: background-color 0.1s;
    }
`;

const CertificateJson = styled.textarea`
    width: 30rem;
    height: 30rem;
`;

export default Home;