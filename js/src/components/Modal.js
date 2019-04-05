import styled from 'styled-components'

const Modal = styled.div`
position: fixed;
display: flex;
justify-content: center;
align-items: center;
top: 0;
left: 0;
right: 0;
bottom: 0;
z-index: 100000;
background: rgba(0,0,0,.2);
`

const ModalInner = styled.div`
background: white;
padding: 30px;
min-width: 300px;
max-width: 700px;
box-shadow: 0 5px 3px rgba(0,0,0,.3);
`

export default ({ children }) => (
  <Modal>
    <ModalInner>
      {children}
    </ModalInner>
  </Modal>
)