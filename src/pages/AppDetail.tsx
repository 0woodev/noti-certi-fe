
import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import styled from "styled-components";
import {getAppById} from "../api/App";
import {IApp} from "../type/App";
import {IDomain} from "../type/Domain";
import {findAllDomainsByAppId} from "../api/Domain";


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

        getAppById(Number(id))
            .then((res) => {
                setApp(res.data); // Assuming API returns domain in `res.data`
            })
            .catch(() => {
                navigate("/404"); // Redirect to 404 if API call fails
            });
    }, [id, navigate]);

    useEffect(() => {
        if (app !== null) {
            findAllDomainsByAppId(app.id)
                .then((res) => {
                    setDomains(res.data);
                }).catch(() => {
                    alert("도메인 정보를 불러오는데 실패했습니다.");
                });
        }
    }, [app]);

    const handleDomainClick = (id: number) => {
        navigate(`/domain/${id}`);
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
                <Value>{app?.teamId ? "O" : "X"}</Value>
            </Info>


            <button onClick={() => navigate(-1)}>뒤로가기</button>
            <div>연결된 도메인</div>
            <ConnectedDomainListContainer>
                {
                    domains.map((domain) => (
                        <Domain onClick={() => handleDomainClick(domain.id)}>
                            <Info>
                                <Label>도메인 주소</Label><Value>{domain.host}</Value>
                            </Info>
                            <Info>
                                <Label>도메인 IP</Label><Value>{domain.ip}</Value>
                            </Info>
                            <Info>
                                <Label>도메인 포트</Label><Value>{domain.port}</Value>
                            </Info>
                            <Info>
                                <Label>인증서</Label><Value>{domain.certificateId ? "O" : "X"}</Value>
                            </Info>
                        </Domain>
                    ))
                }
            </ConnectedDomainListContainer>
        </PageLayout>
    );
}

const Label = styled.div`
    font-weight: bold;
    min-width: 25%;
`;

const Value = styled.div`
`;


const Domain = styled.div`
    border: 1px solid black;
    padding: 10px;
    width: 50%;
    hieght: 10rem;
`;
const ConnectedDomainListContainer = styled.div`
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
    background-color: #ad7a7a;
    width: 100%;
    height: 100%;
`;

const Info = styled.div`
    display: flex;
    flex-direction: row;
    
    width: 50%;
`;

export default AppDetail;