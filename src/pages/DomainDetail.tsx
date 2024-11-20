
import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {getDomainById} from "../api/Domain";
import {IDomain} from "../type/Domain";
import {ICertificate} from "../type/Certificate";
import {connectDomainAndCert, getManagedCertificateById} from "../api/Certificate";
import styled from "styled-components";


const DomainDetail = () => {
    // GET id from URL
    const { id } = useParams<{id: string}>();
    const navigate = useNavigate();
    const [domain, setDomain] = useState<IDomain | null>(null);
    const [certificate, setCertificate] = useState<ICertificate | null>(null);

    useEffect(() => {
        if (!id || isNaN(Number(id))) {
            navigate("/404"); // Redirect to 404 page if `id` is invalid
            return;
        }

        getDomainById(Number(id))
            .then((res) => {
                setDomain(res.data); // Assuming API returns domain in `res.data`
            })
            .catch(() => {
                navigate("/404"); // Redirect to 404 if API call fails
            });
    }, [id, navigate]);

    useEffect(() => {
        if (domain !== null) {
            if (!domain.certificateId) {
                return;
            }
            const certificateId = domain.certificateId;
            getManagedCertificateById(certificateId!)
                .then((res) => {
                    const certificate = res.data;
                    setCertificate(certificate);
                })
        }
    }, [domain]);

    const getCertificate = async () => {
        if (domain === null) return;

        try {
            if (domain.certificateId === null) {
                const connectedRes = await connectDomainAndCert(domain.id);
                const { certificate } = connectedRes.data;

                setCertificate(certificate);
            } else {
                const managedRes = await getManagedCertificateById(domain.certificateId);
                const certificate = managedRes.data;

                setCertificate(certificate);
            }

        } catch (error) {
            alert("인증서 조회에 실패했습니다.")
        }
    }

    return (
        <PageLayout>
            <Info>
                <Label>도메인 주소</Label><Value>{domain?.host}</Value>
            </Info>
            <Info>
                <Label>도메인 IP</Label><Value>{domain?.ip}</Value>
            </Info>
            <Info>
                <Label>도메인 포트</Label><Value>{domain?.port}</Value>
            </Info>

            <Info>
                <Label>인증서 유무</Label>
                {certificate ? (
                    <Managed>O</Managed>
                ) : (
                    <Unmanaged>X</Unmanaged>
                )}
            </Info>
            <Info>
                <Label>인증서 SN</Label><Value>{certificate?.serialNumber}</Value>
            </Info>

            <Info>
                <Label>인증서 발급자</Label><Value>{certificate?.issuingCA}</Value>
            </Info>

            <Info>
                <Label>인증서 만료일</Label><Value>{certificate?.validTo}</Value>
            </Info>

            <Info>
                <Label>인증서 발급일</Label><Value>{certificate?.validFrom}</Value>
            </Info>
            <Info>
                <Label>인증서 SANs</Label><Value>{certificate?.sans.join(", ")}</Value>
            </Info>
            <Info>
                <Label>회사</Label><Value>{certificate?.organization}</Value>
            </Info>


            <button onClick={() => navigate(-1)}>뒤로가기</button>
            <div>연결된 애플리케이션</div>
            <ConnectedAppTableContainer></ConnectedAppTableContainer>
        </PageLayout>
    );
}

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
    background-color: #ad7a7a;
    width: 100%;
    height: 100%;
`;

const Info = styled.div`
    display: flex;
    flex-direction: row;
    
    width: 50%;
`;

export default DomainDetail;