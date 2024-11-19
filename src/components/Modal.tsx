import styled from "styled-components";

export interface ModalProps {
    children: React.ReactNode;
    close: () => void;

}

export const Modal = ({ children, close }: ModalProps) => {

    // 전체화면에서 모달 이외를 누르면 모달이 닫히도록
    const closeOnOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            close();
        }
    }

    return (
        <ModalContainer onClick={closeOnOutsideClick}>
            {children}
        </ModalContainer>
    )
};

const ModalContainer = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9999;
    padding: 15%;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.5);
`;

