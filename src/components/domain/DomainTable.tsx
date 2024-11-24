import {useEffect, useState} from "react";
import {IDomain} from "../../type/Domain";
import {useNavigate} from "react-router-dom";
import styled from "styled-components";
import AddDomain from "../../components/domain/AddDomain";
import {Modal} from "../Modal";


interface IDomainTableProps {
    domains: IDomain[];
    newDomainButtonHide?: boolean;
    intro?: string;
    refresh: () => Promise<void>;
    selectable: boolean;
    selected: boolean[];
    setSelected: (selected: boolean[]) => void;
}

enum CertificateStatus {
    EXPIRED = 0,
    RED = 1,
    YELLOW= 2,
    GREEN = 3,
    NONE=4
}

const DomainTable = ({ domains, newDomainButtonHide, intro, refresh, selected, setSelected, selectable }: IDomainTableProps) => {
    const navigate = useNavigate();

    const [modalOn, setModalOn] = useState(false);

    useEffect(() => {
        if (!selectable) {
            setSelected(domains.map(() => false));
        }
    }, [domains, selectable, setSelected]);

    const handleDomainClick = (id: number) => {
        if (selectable) {
            const newSelected = [...selected];
            newSelected[id] = !newSelected[id];
            setSelected(newSelected);
        } else {
            navigate(`/domain/${id}`);
        }
    }

    const handleAddDomainButtonClick = () => {
        setModalOn(true);
    }

    const closeModal = async () => {
        await refresh();
        setModalOn(false);
    }

    const getLight = (status: CertificateStatus) => {
        if (status === CertificateStatus.EXPIRED) {
            return <BlackLight />;
        } else if (status === CertificateStatus.RED) {
            return <RedLight />;
        } else if (status === CertificateStatus.YELLOW) {
            return <YellowRight />;
        } else if (status === CertificateStatus.GREEN) {
            return <GreenLight />;
        } else {
            return <></>;
        }
    }

    return (
        <>
            <DomainListContainer>
                <TopBar>
                    <Intro>{intro ?? ""}</Intro>
                    {selected.filter(x => x).length > 0 && (
                        <Count>{selected.filter(x => x).length}개 선택됨</Count>
                    )}
                    {!newDomainButtonHide && (<AddButton onClick={handleAddDomainButtonClick}>도메인 추가</AddButton>)}
                    <Count>{domains.length}개</Count>
                </TopBar>
                <DomainHeader>
                    <Info>
                        <Label>호스트</Label>
                    </Info>
                    <Info>
                        <Label>IP</Label>
                    </Info>
                    <Info>
                        <Label>포트</Label>
                    </Info>
                    <Info>
                        <Label>만료일자</Label>
                    </Info>
                </DomainHeader>
                <List>
                    {domains.map((domain, i) => {
                        let statusMessage = "";
                        let status: CertificateStatus = CertificateStatus.GREEN;
                        let dDay = 0;
                        if (!domain.certificate) {
                            statusMessage = "-";
                            status = CertificateStatus.NONE;
                        }

                        if (domain.certificate) {
                            let expiredAt = new Date(domain.certificate.validTo);
                            // expiredAt 이 이상한 경우
                            if (isNaN(expiredAt.getTime())) {
                                statusMessage = "오류 (문의)";
                                status = 0;
                            } else {
                                dDay = Math.floor((expiredAt.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                                if (expiredAt.getTime() < new Date().getTime()) {
                                    status = CertificateStatus.EXPIRED;
                                } else if (expiredAt.getTime() - new Date().getTime() < 1000 * 60 * 60 * 24 * 30) {
                                    status = CertificateStatus.RED;
                                } else  if (expiredAt.getTime() - new Date().getTime() < 1000 * 60 * 60 * 24 * 60) {
                                    status = CertificateStatus.YELLOW;
                                } else {
                                    status = CertificateStatus.GREEN;
                                }
                                statusMessage = dDay + "일 남음";
                            }
                        }

                        return (
                            <Domain
                                onClick={() => handleDomainClick(selectable ? i : domain.id)}
                                $selected={selected[i] ? "true" : "false"}
                                $valid={domain.certificate ? "true" : "false"}
                            >
                                <Info>
                                    <Value>{domain.host}</Value>
                                </Info>
                                <Info>
                                    <Value>{domain.ip}</Value>
                                </Info>
                                <Info>
                                    <Value>{domain.port}</Value>
                                </Info>
                                <Info>
                                    <Status>
                                        {getLight(status)}
                                        <DDay>{statusMessage}</DDay>
                                    </Status>
                                </Info>
                            </Domain>
                        )
                    })}
                    {domains.length === 0 && (
                        <Domain>
                            <Info>
                                <Value>도메인이 없습니다.</Value>
                            </Info>
                        </Domain>
                    )}
                </List>
            </DomainListContainer>
            {modalOn && (
                <Modal close={closeModal} minWidth={"500px"} minHeight={"500px"}>
                        <AddDomain close={closeModal}/>
                </Modal>
            )}
        </>
    );
}

const Status = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    height: 1rem;
`;

const DDay = styled.p`
    width: 5rem;
`;

const Light = styled.p`
    border: 1px solid gray;
    width: 1rem;
    height: 1rem;
    border-radius: 50%;
    margin-right: 0.5rem;
`;
const GreenLight = styled(Light)`
    background: green;
`;

const BlackLight = styled(Light)`
    background: black;
`;

const RedLight = styled(Light)`
    background: red;
`;

const YellowRight = styled(Light)`
    background: yellow;
`;


const Intro = styled.h1`
    font-size: 20px;
    flex-grow: 1;
    height: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
`;

const TopBar = styled.div`
    padding: 0 10%;
    font-size: 1rem;
    width: 100%;
    hieght: rem;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
`;

const Count = styled.div`
    font-size: 1rem;
    height: 100%;
    margin-left: 1rem;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const AddButton = styled.button`
    margin-left: 1rem;
    width: 6rem;
    hieght: 100%;
`;


const DomainListContainer = styled.div`
    position: relative;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    height: 100%;
    overflow-y: auto;
`;

const List = styled.div`
    position: relative;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    height: 100%;
    overflow-y: auto;
`;
const Domain = styled.div<{ $valid?: string, $selected?: string }>`
    margin: 1px 0;
    border: 1px solid black;
    padding: 0 10px;
    height: 2rem;
    width: 80%;
    display: flex;
    flex-direction: row;
    cursor: pointer;
    ${props => props.$selected === "true" && `
        background: gray;
        color: white;
    `}
    
    ${props => props.$valid === "true" && `
        border-color: green;
    `}
`;

const DomainHeader = styled(Domain)`
    background: beige;
`;

const Info = styled.div`
    text-align: center;
    font-size: 14px;
    width: 100%;
    height: 3rem;
    margin: 0.5rem;
`;

const Label = styled.div`
    font-weight: bold;
    min-width: 25%;
`;

const Value = styled.div`
`;


export default DomainTable;