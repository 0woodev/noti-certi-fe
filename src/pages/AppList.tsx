import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import styled from "styled-components";
import {IApp} from "../type/App";
import {saveApp, searchApp} from "../api/App";


const AppList = () => {
    const [apps, setApps] = useState<IApp[]>([]);
    const navigate = useNavigate();


    const [modalOn, setModalOn] = useState(false);
    const [appName, setAppName] = useState("");
    const [appCode, setAppCode] = useState("");
    const [appDescription, setAppDescription] = useState("");


    const handleAppClick = (id: number) => {
        navigate(`/app/${id}`);
    }

    const handleOpenModalButtonClick = () => {
        setModalOn(true);
    }

    const handleAddAppButtonClick = async () => {
        try {
            const saveAppRes = await saveApp(appName, appCode, appDescription);
            const newApp = saveAppRes.data;
            setApps([...apps, newApp]);
            setModalOn(false);
        } catch (error) {
            alert("앱 추가에 실패했습니다.");
            return;
        }
    }

    useEffect(() => {
        // Fetch apps from API
        searchApp()
            .then((res) => {
                setApps(res.data);
            })
            .catch((error) => {
                alert("앱 정보를 불러오는데 실패했습니다 - " + error.message);
            })

    }, []);

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
                <h1>App List {apps.length}개</h1>
                <button onClick={handleOpenModalButtonClick}>앱 추가</button>
                {apps.map((app) => (
                    <Domain onClick={() => handleAppClick(app.id)}>
                        <Info>
                            <Label>앱 이름</Label><Value>{app.appName}</Value>
                        </Info>
                        <Info>
                            <Label>앱 코드</Label><Value>{app.code}</Value>
                        </Info>
                        <Info>
                            <Label>앱 설명</Label><Value>{app.description}</Value>
                        </Info>
                        <Info>
                            <Label>팀</Label><Value>{app.teamId ? "O" : "X"}</Value>
                        </Info>
                    </Domain>
                ))}
            </DomainListContainer>
            {modalOn && (
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

                    <button onClick={handleAddAppButtonClick} >추가</button>
                </AddAppModal>
            )}
        </>
    );
}

const AddAppModal = styled.div`
    position: absolute;
    // center
    top: 25%;
    left: 25%;
    
    border: 1px solid black;
    width: 50%;
    hieght: fit-content;
    
    display: flex;
    flex-direction: column;
`;

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

export default AppList;