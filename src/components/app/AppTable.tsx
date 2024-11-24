import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import styled from "styled-components";
import {IApp} from "../../type/App";
import {saveApp, searchApp} from "../../api/App";
import {Modal} from "../Modal";

interface IAppTableProps {
    apps: IApp[];
    newAppButtonHide?: boolean;
    intro?: string;
    refresh: () => Promise<void>;
    selectable: boolean;
    selected: boolean[];
    setSelected: (selected: boolean[]) => void;
}

const AppTable = ({ apps, newAppButtonHide, intro, refresh, selected, setSelected, selectable }: IAppTableProps) => {
    const navigate = useNavigate();

    const [modalOn, setModalOn] = useState(false);
    const [appName, setAppName] = useState("");
    const [appCode, setAppCode] = useState("");
    const [appDescription, setAppDescription] = useState("");

    useEffect(() => {
        if (!selectable) {
            setSelected(apps.map(() => false));
        }
    }, [apps]);

    const handleAppClick = (id: number) => {
        if (selectable) {
            const newSelected = [...selected];
            newSelected[id] = !newSelected[id];
            setSelected(newSelected);
        } else {
            navigate(`/app/${id}`);
        }
    }

    const handleOpenModalButtonClick = () => {
        setModalOn(true);
    }

    const handleAddAppButtonClick = async () => {
        try {
            await saveApp(appName, appCode, appDescription);
            await refresh();
            setModalOn(false);
        } catch (error) {
            alert("앱 추가에 실패했습니다.");
            return;
        }
    }

    const handleAppNameChange = (e: any) => {
        setAppName(e.target.value);
    }

    const handleAppCodeChange = (e: any) => {
        setAppCode(e.target.value);
    }

    const handleAppDescriptionChange = (e: any) => {
        setAppDescription(e.target.value);
    }

    return (
        <>
            <DomainListContainer>
                <TopBar>
                    <Intro>{intro ?? ""}</Intro>
                    {selected.filter(x => x).length > 0 && (
                        <Count>{selected.filter(x => x).length}개 선택됨</Count>
                    )}
                    {!newAppButtonHide && (<AddButton onClick={handleOpenModalButtonClick}>앱 추가</AddButton>)}
                    <Count>{apps.length}개</Count>
                </TopBar>

                <AppHeader>
                    <Info>
                        <Label>앱 이름</Label>
                    </Info>
                    <Info>
                        <Label>앱 코드</Label>
                    </Info>
                    <Info>
                        <Label>앱 설명</Label>
                    </Info>
                    <Info>
                        <Label>팀</Label>
                    </Info>
                </AppHeader>
                <List>
                    {apps.map((app, i) => (
                        <App onClick={() => handleAppClick(selectable ? i : app.id)} $selected={selected[i] ? "true" : "false"}>
                            <Info>
                                <Value>{app.appName ?? "-"}</Value>
                            </Info>
                            <Info>
                                <Value>{app.code ?? "-"}</Value>
                            </Info>
                            <Info>
                                <Value>{app.description ?? "-"}</Value>
                            </Info>
                            <Info>
                                <Value>{app.teamId ? "V" : "-"}</Value>
                            </Info>
                        </App>
                    ))}
                    {apps.length === 0 && (
                        <App>
                            <Info>
                                <Value>앱이 없습니다.</Value>
                            </Info>
                        </App>
                    )}
                </List>


            </DomainListContainer>
            {modalOn && (
                <Modal
                    close={() => setModalOn(false)}
                    minHeight={"500px"}
                    minWidth={"500px"}
                >
                    <AddAppModal>
                        <Info>
                            <Label>이름</Label><Input value={appName} onChange={handleAppNameChange}/>
                        </Info>
                        <Info>
                            <Label>코드</Label><Input value={appCode} onChange={handleAppCodeChange}/>
                        </Info>
                        <Info>
                            <Label>설명</Label><Input value={appDescription} onChange={handleAppDescriptionChange}/>
                        </Info>
                        <button onClick={handleAddAppButtonClick}>추가</button>
                    </AddAppModal>
                </Modal>
            )}
        </>
    );
}

const AddAppModal = styled.div`
    border: 1px solid black;
    width: 100%;
    hieght: 100%;
    display: flex;
    background: white;
    flex-direction: column;
    padding: 1rem;
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
const App = styled.div<{ $selected?: string }>`
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
`;

const AppHeader = styled(App)`
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

export default AppTable;