import Map from "./components/Map";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import Sidebar from "./components/Sidebar";
import styled from "styled-components";
import { motion } from "framer-motion";
import { useStore } from "./store";

const Container = styled(motion.div)`
  background-color: #111518;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  box-sizing: border-box;
  box-shadow: 0 16px 32px -16px black;
  overflow: hidden;
  width: 100vw;
  height: 100vh;
  touch-action: none;
`;
const HamburgerContainer = styled(motion.div)`
  border-radius: 32px;
  width: 48px;
  height: 48px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: fixed;
  top: 0;
  margin: 24px;
  cursor: pointer;
  z-index: 2;
`;
const Text = styled(motion.p)`
  font-family: Caviar Dreams;
  color: #fff;
  user-select: none;
  margin: 64px auto;
`;

const App = observer(() => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  const { salesStore } = useStore();

  const handleDistrictClick = (district: string) => {
    setSidebarOpen(true);
    salesStore.helloWorld();
  };

  return (
    <Container>
      <Sidebar setOpen={setSidebarOpen} open={sidebarOpen}>
        <HamburgerContainer
          onTap={() => {
            setSidebarOpen(false);
          }}
        >
          CLOSE
        </HamburgerContainer>
        <Text>Hello there...</Text>
      </Sidebar>
      <Map handleDistrictClick={handleDistrictClick} />
    </Container>
  );
});

export default App;
