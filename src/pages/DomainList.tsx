import {useEffect, useState} from "react";
import {IDomain} from "../type/Domain";
import {searchDomain} from "../api/Domain";
import {useNavigate} from "react-router-dom";
import styled from "styled-components";
import AddDomain from "./AddDomain";
import {Modal} from "../components/Modal";


const DomainList = () => {
    const [domains, setDomains] = useState<IDomain[]>([]);
    const navigate = useNavigate();
    const [modalOn, setModalOn] = useState(false);

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

    const handleDomainClick = (id: number) => {
        navigate(`/domain/${id}`);

    }

    const handleAddDomainButtonClick = () => {
        setModalOn(true);
    }


    return (
        <PageLayout>
            <TopBar>
                <Intro>NOTI CERTI 가 관리하고 있는 도메인 수 {domains.length}개</Intro>
                <AddButton onClick={handleAddDomainButtonClick}>도메인 추가</AddButton>
            </TopBar>

            <DomainListContainer>
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
            {modalOn && (
                <Modal close={() => setModalOn(false)}>
                        <AddDomain />
                </Modal>
            )}
        </PageLayout>
    );
}

const PageLayout = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    position: relative;
`;


const TopBar = styled.div`
    padding: 0 10%;
    font-size: 1rem;
    width: 100%;
    hieght: rem;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`;

const Intro = styled.div`
    font-size: 1rem;
    width: 100%;
    height: 100%;
`;


const AddButton = styled.button`
    width: 6rem;
    hieght: 100%;
`;

const DomainListContainer = styled.div`
    border: 1px solid black;
    padding: 0 10%;
    overflow-y: auto;
    background: beige;    
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;
`;

const Domain = styled.div`
    border: 1px solid black;
    padding: 10px;
    margin: 0.5rem 0;
    border-radius: 0.5rem;
    width: 100%;
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