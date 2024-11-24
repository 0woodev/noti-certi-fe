import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import styled from "styled-components";
import {IApp} from "../type/App";
import {saveApp, searchApp} from "../api/App";
import AppTable from "../components/app/AppTable";


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

    const getApps = async () => {
        try {
            const res = await searchApp();
            setApps(res.data);
        } catch (error) {
            alert("앱 정보를 불러오는데 실패했습니다");
        }
    }

    return (
        <>
            <PageLayout>
                <AppTable
                    apps={apps}
                    refresh={getApps}
                    newAppButtonHide={false}
                    intro="앱 리스트"
                    selectable={false}
                    selected={[]}
                    setSelected={() => {}}
                />
            </PageLayout>

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

const PageLayout = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
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