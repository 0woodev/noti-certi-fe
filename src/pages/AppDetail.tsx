
import {replace, useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {findAllDomainsByAppId, getDomainById} from "../api/Domain";
import {IDomain} from "../type/Domain";
import {ICertificate} from "../type/Certificate";
import {connectDomainAndCert, getManagedCertificateById} from "../api/Certificate";
import styled from "styled-components";
import {getAppById, getAppsByDomainId} from "../api/App";
import {IApp} from "../type/App";
import AppTable from "../components/app/AppTable";
import DomainTable from "../components/domain/DomainTable";


const AppDetail = () => {
    // GET id from URL
    const { id } = useParams<{id: string}>();
    const navigate = useNavigate();
    const [app, setApp] = useState<IApp | null>(null);
    const [domains, setDomains] = useState<IDomain[]>([]);

    useEffect(() => {
        if (!id || isNaN(Number(id))) {
            navigate("/404"); // Redirect to 404 page if `id` is invalid
            return;
        }

        getApp(Number(id));
    }, [id, navigate]);

    useEffect(() => {
        getDomains();
    }, [app]);

    const getApp = async (appId: number) => {
        try {
            const getAppRes = await getAppById(appId);
            const app = getAppRes.data;
            setApp(app);
        } catch (error) {
            alert("도메인 정보를 불러오는데 실패했습니다.");
            navigate("/", {replace: true});
        }

    }

    const getDomains = async () => {
        const appId = Number(id);
        try {
            const getDomainsRes = await findAllDomainsByAppId(appId);
            const apps = getDomainsRes.data;
            setDomains(apps);
        } catch (error) {
            alert("앱 정보를 불러오는데 실패했습니다.");
        }
    }

    return (
        <PageLayout>
            <Info>
                <Label>앱 이름</Label>
                <Value>{app?.appName}</Value>
            </Info>
            <Info>
                <Label>앱 코드</Label>
                <Value>{app?.code}</Value>
            </Info>
            <Info>
                <Label>앱 설명</Label>
                <Value>{app?.description}</Value>
            </Info>
            <Info>
                <Label>팀</Label>
                <Value>{app?.teamId ? "O" : "-"}</Value>
            </Info>

            <button onClick={() => navigate(-1)}>뒤로가기</button>
            <TableWrapper>
                <DomainTable domains={domains} refresh={getDomains} newDomainButtonHide={true} selectable={false} selected={[]} setSelected={()=>{"연결된 도메인"}}/>
            </TableWrapper>
        </PageLayout>
    );
}

const TableWrapper = styled.div`
    width: 70%;
    min-width: 50rem;
    margin-top: 1rem;

`;


const Label = styled.div`
    font-weight: bold;
    min-width: 25%;
`;

const Value = styled.div`
`;

const ConnectedAppTableContainer = styled.div`
    border: 1px solid black;
    width: 50%;
    min-height: 1rem;
    margin-top: 1rem;
`;

const Managed = styled.div`
    color: green;
`;

const Unmanaged = styled.div`
    color: red;
`;

const PageLayout = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
`;

const Info = styled.div`
    display: flex;
    flex-direction: row;

    width: 50%;
`;

export default AppDetail;