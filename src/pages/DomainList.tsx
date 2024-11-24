import {useEffect, useState} from "react";
import {IDomain} from "../type/Domain";
import {searchDomain} from "../api/Domain";
import styled from "styled-components";
import DomainTable from "../components/domain/DomainTable";


const DomainList = () => {
    const [domains, setDomains] = useState<IDomain[]>([]);

    useEffect(() => {
        // Fetch domains from API
        getDomains();

    }, []);

    const getDomains = async () => {
        try {
            const res = await searchDomain();
            setDomains(res.data);
        } catch (error) {
            alert("도메인 정보를 불러오는데 실패했습니다.");
        }
    }

    return (
        <PageLayout>
            <DomainTable
                domains={domains}
                refresh={getDomains}
                selectable={false}
                selected={[]}
                setSelected={() => {}}
                intro={"도메인 리스트"}/>
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


export default DomainList;