import {useEffect, useState} from "react";
import {IDomain} from "../../type/Domain";
import {searchDomain} from "../../api/Domain";
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
const DomainTable = ({ domains, newDomainButtonHide, intro, refresh, selected, setSelected, selectable }: IDomainTableProps) => {
    const navigate = useNavigate();

    const [modalOn, setModalOn] = useState(false);

    useEffect(() => {
        if (!selectable) {
            setSelected(domains.map(() => false));
        }
    }, [domains]);

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
                        let status = 2;
                        let dDay = 0;
                        if (!domain.certificate) {
                            statusMessage = "-";
                            status = 0;
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
                                    status = 0;
                                } else if (expiredAt.getTime() - new Date().getTime() < 1000 * 60 * 60 * 24 * 30) {
                                    status = 1;
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
                                    {status ? (
                                        <Managed>{statusMessage}</Managed>
                                    ) : (
                                        <NotManaged>{statusMessage}</NotManaged>
                                    )}
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
                <Modal close={() => setModalOn(false)} minWidth={"500px"} minHeight={"500px"}>
                        <AddDomain close={() => setModalOn(false)}/>
                </Modal>
            )}
        </>
    );
}

const Managed = styled.div`
    color: green;
`;

const NotManaged = styled.div`
    color: red;
`;

const AddDomainModal = styled.div`
    border: 1px solid black;
    width: 100%;
    hieght: 100%;
    display: flex;
    background: white;
    flex-direction: column;
    padding: 1rem;
`;


const Intro = styled.div`
    font-size: 1rem;
    flex-grow: 1;
    height: 100%;
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

const Input = styled.input`
`;

export default DomainTable;