import {useEffect, useState} from "react";
import {IDomain} from "../type/Domain";
import {searchDomain} from "../api/Domain";
import {useNavigate} from "react-router-dom";
import styled from "styled-components";


const DomainList = () => {
    const [domains, setDomains] = useState<IDomain[]>([]);
    const navigate = useNavigate();

    const handleDomainClick = (id: number) => {
        navigate(`/domain/${id}`);
    }

    useEffect(() => {
        // Fetch domains from API
        searchDomain()
            .then((res) => {
                setDomains(res.data);
            })
            .catch((error) => {
                alert("도메인 정보를 불러오는데 실패했습니다 - " + error.message);
            })

    }, []);

    return (
        <DomainListContainer>
            <h1>Domain List {domains.length}개</h1>
            {domains.map((domain) => (
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
            ))}
        </DomainListContainer>
    );
}

const DomainListContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;
    overflow-y: auto;
`;
const Domain = styled.div`
    border: 1px solid black;
    padding: 10px;
    width: 50%;
    hieght: 10rem;
`;

const Info = styled.div`
    display: flex;
    flex-direction: row;

    width: 100%;
`;

const Label = styled.div`
    font-weight: bold;
    min-width: 25%;
`;

const Value = styled.div`
`;

export default DomainList;