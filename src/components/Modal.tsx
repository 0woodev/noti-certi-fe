import styled from "styled-components";

export interface ModalProps {
    children: React.ReactNode;
    close: () => void;
    minWidth: string;
    minHeight: string;

}

export const Modal = ({ children, close, minWidth, minHeight }: ModalProps) => {

    // 전체화면에서 모달 이외를 누르면 모달이 닫히도록
    const closeOnOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            close();
        }
    }

    return (
        <ModalContainer onClick={closeOnOutsideClick}>
            <ModalBorder $minWidth={minWidth} $minHeight={minHeight}>
                {children}
            </ModalBorder>
        </ModalContainer>
    )
};

const ModalContainer = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    z-index: 9999;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.5);
`;

const ModalBorder = styled.div<{$minWidth: string, $minHeight: string}>`
    border-radius: 0.5rem;
    overflow: hidden;
    width: 90%;
    height: 90%;
    min-width: ${props => props.$minWidth};
    min-height: ${props => props.$minHeight};
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    position: relative;
    z-index: 1;
`;