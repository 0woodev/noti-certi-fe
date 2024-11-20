import React, {useState} from "react";
import styled from "styled-components";
import {ICertificate} from "../../type/Certificate";
import {getLiveCertificate, findManagedCertificate, connectDomainAndCert} from "../../api/Certificate";
import {useNavigate} from "react-router-dom";
import {IDomain} from "../../type/Domain";
import {getDomainByIpAndPort, getDomainIp, saveDomain} from "../../api/Domain";
import AppTable from "../app/AppTable";
import {IApp} from "../../type/App";
import {
    connectAppsToDomain,
    disconnectAppsToDomain,
    getAppsByDomainId,
    getAppsByExcludeDomainId,
    searchApp
} from "../../api/App";


interface AddDomainProps {
    close: () => void;

}

const AddDomain = ({close}: AddDomainProps) => {
    const navigate = useNavigate();
    const [host, setHost] = useState<string>("");
    const [port, setPort] = useState<number>(443);
    const [ip, setIp] = useState<string | null>(null);

    const [domain, setDomain] = useState<IDomain | null>(null);
    const [liveCertificate, setLiveCertificate] = useState<ICertificate | null>(null);
    const [managedCertificate, setManagedCertificate] = useState<ICertificate | null>(null);

    const [isInitialized, setIsInitialized] = useState<boolean>(false);
    const [step, setStep] = useState(0);
    const [appSearchTableOpen, setAppSearchTableOpen] = useState(false);

    const [notConnectedApps, setNotConnectedApps] = useState<IApp[]>([]);
    const [connectedApps, setConnectedApps] = useState<IApp[]>([]);

    const [selectedInConnectedApps, setSelectedInConnectedApps] = useState<boolean[]>([]);
    const [selectedInNotConnectedApps, setSelectedInNotConnectedApps] = useState<boolean[]>([]);

    const handleDomainChange = (e: React.ChangeEvent<HTMLInputElement
    >) => {
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
            savedDomain = saveDomainRes.data;
            setDomain(savedDomain);
        }

        const connectedDomainRes = await connectDomainAndCert(savedDomain!.id);
        const connectedDomain = connectedDomainRes.data;

        await getApps(savedDomain!.id);
        const notConnectedAppRes = await getAppsByExcludeDomainId(savedDomain!.id);
        setNotConnectedApps(notConnectedAppRes.data);

        const connectedAppRes = await getAppsByDomainId(savedDomain!.id);
        setConnectedApps(connectedAppRes.data);

        setStep(prev => prev + 1);
        // navigateToDomainDetail(connectedDomain.domain.id);
    }

    const navigateToDomainDetail = (domainId: number) => {

        navigate(`/domain/${domainId}`);
    }

    const handleNavigateDomainDetailButtonClick = async () => {
        if (domain !== null) {
            const notConnectedAppRes = await getAppsByExcludeDomainId(domain!.id);
            setNotConnectedApps(notConnectedAppRes.data);

            const connectedAppRes = await getAppsByDomainId(domain!.id);
            setConnectedApps(connectedAppRes.data);

            setStep(prev => prev + 1);
            // navigateToDomainDetail(domain.id)
        } else {
            alert("도메인 정보가 없습니다!");
        }
    }

    const DomainSearchAndSaveAndConnectToCertStep = () => {
        return (
            <>
                <SearchBar>
                    <DomainInput placeholder={"도메인 (ex - 127.0.0.1, www.naver.com)"} onChange={handleDomainChange} value={host}/>
                    <PortInput placeholder={"포트 (ex - 443, 444)"} onChange={handlePortChange} value={port}/>
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
                        {(domain && managedCertificate && domain.certificate?.id === managedCertificate.id) ? (
                            <button onClick={handleNavigateDomainDetailButtonClick}>도메인 정보 보러가기</button>
                        ) : (
                            <button onClick={handleNavigateCertificateNewButtonClick}>인증서 저장하러 가기</button>
                        )}

                    </>
                )}
            </>
        )
    }

    const getApps = async (domainId: number) => {
        const connectedAppRes = await getAppsByDomainId(domainId);
        setConnectedApps(connectedAppRes.data);
        setSelectedInConnectedApps(new Array(connectedApps.length).fill(false));

        const notConnectedAppRes = await getAppsByExcludeDomainId(domainId);
        setNotConnectedApps(notConnectedAppRes.data);
        setSelectedInNotConnectedApps(new Array(notConnectedApps.length).fill(false));
    }

    const handleConnectSelectedApp = async () => {
        const selectedApps = selectedInNotConnectedApps
            .map((x, i) => x ? notConnectedApps[i].id : -1)
            .filter(x => x !== -1);

        console.log("selected", selectedApps);

        await connectAppsToDomain(domain!.id, selectedApps);
        await getApps(domain!.id);
    }
    const handleDisconnectSelectedApp = async () => {
        const selectedApps = selectedInConnectedApps
            .map((x, i) => x ? connectedApps[i].id : -1)
            .filter(x => x !== -1);



        await disconnectAppsToDomain(domain!.id, selectedApps);
        await getApps(domain!.id);
    }

    const DomainConnectToAppStep = () => {

        return (
            <>
                <Info><Label>HOST</Label> {domain?.host}</Info>
                <Info><Label>IP</Label> {domain?.ip}</Info>
                <Info><Label>PORT</Label> {domain?.port}</Info>

                <Info><Label>인증서 CA</Label> {managedCertificate?.issuingCA}</Info>
                <Info><Label>발급일</Label> {managedCertificate?.validFrom}</Info>
                <Info><Label>만료일</Label> {managedCertificate?.validTo}</Info>
                <Info><Label>SN</Label> {managedCertificate?.serialNumber}</Info>
                <Info><Label>회사</Label> {managedCertificate?.organization}</Info>
                <Info>
                    <Label>SANs</Label>
                    {managedCertificate?.sans && managedCertificate.sans.length >= 2 ? (
                        <Value>[{managedCertificate?.sans.slice(0, 2).join(", ")}, ...] 외 {managedCertificate.sans.length - 2}개</Value>
                    ) : (
                        <Value>SANs: {managedCertificate?.sans.join(", ")}</Value>
                    )}
                </Info>
                <TableContainer>
                    <Table>
                        <AppTable
                            apps={connectedApps}
                            selectable={true}
                            selected={selectedInConnectedApps}
                            setSelected={setSelectedInConnectedApps}
                            refresh={() => getApps(domain!.id)}
                            newAppButtonHide={true}
                            intro={"도메인과 연결된 앱"}
                        />
                    </Table>

                    <MoveButtonContainer>
                        <MoveButton onClick={handleConnectSelectedApp}>추가</MoveButton>
                        <MoveButton onClick={handleDisconnectSelectedApp}>삭제</MoveButton>
                    </MoveButtonContainer>
                    <Table>
                        <AppTable
                            apps={notConnectedApps}
                            selectable={true}
                            selected={selectedInNotConnectedApps}
                            setSelected={setSelectedInNotConnectedApps}
                            refresh={() => getApps(domain!.id)}
                            newAppButtonHide={false}
                            intro={"연결되지 않은 앱"}
                        />
                    </Table>
                </TableContainer>

                <Button onClick={close}>완료</Button>
            </>
        )
    }

    return (
        <PageLayout>
            {step === 0 && DomainSearchAndSaveAndConnectToCertStep()}
            {step === 1 && DomainConnectToAppStep()}
        </PageLayout>
    );
};

const Button = styled.button`
    width: 5rem;
    min-height: 3rem;
    border-radius: 0.5rem;
    background-color: lightgray;

    &:hover {
        background-color: gray;
        color: white;
        cursor: pointer;
    }
`;

const MoveButtonContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 3rem;
    height: 100%;

    // 화면이 좁으면 위 아래 배치
    @media (max-width: 1000px) {
        flex-direction: row;
        width: 100%;
        height: 3rem;
    }
`;

const MoveButton = styled.button`
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 0.5rem;
    background-color: lightgray;
    margin: 0.5rem 0;
    
    &:hover {
        background-color: gray;
        color: white;
        cursor: pointer;
    }

    @media (max-width: 1000px) {
        flex-direction: row;
        margin: 0 0.5rem;    
        //transform: rotate(90deg);
    }
`;

const TableContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: center;
    min-height: 20rem;
    width: 100%;
    padding: 0 0.5rem;
    
    // 화면이 좁으면 위 아래 배치
    @media (max-width: 1000px) {
        flex-direction: column;
    }
`;

const Table = styled.div`
    padding:  0 10px;
    width: 40%;
    overflow-y: hidden;
    max-height: 25rem;
    //border: 1px solid black;

    // 화면이 좁으면 위 아래 배치
    @media (max-width: 1000px) {
        width: 100%;
        height: fit-content;
        max-height: 10rem;
    }
`;


const Info = styled.div`
    display: flex;
    flex-direction: row;
    padding: 0 1rem;
    width: 30rem;
`;

const Label = styled.div`
    font-weight: bold;
    min-width: 25%;
`;

const Value = styled.div`
`;


const Managed = styled.div`
    color: green;
`;

const NotManaged = styled.div`
    color: red;
`;

const PageLayout = styled.div`
    padding: 1rem 0;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    background-color: white;
    width: 100%;
    height: 100%;
`;

const SearchBar = styled.div`
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
    border: 2px solid black;
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

export default AddDomain;
