import { useEffect } from "react";
// @ts-ignore
import styled from "styled-components";
import { motion, useSpring } from "framer-motion";

const Container = styled(motion.div)`
  position: fixed;
  width: auto;
  height: 100vh;
  touch-action: none;
  z-index: 2;
`;

const SidebarContainer = styled(motion.div)`
  position: fixed;
  background-color: white;
  width: 320px;
  height: 100%;
  box-sizing: border-box;
  padding: 64px;
`;

const Sidebar = ({ children, open }: any) => {
  const width = 400;
  const x: any = useSpring(0, { stiffness: 400, damping: 40 });

  useEffect(() => {
    !open ? x.set(-width) : x.set(0);
  }, [open, x]);

  return (
    <Container>
      <SidebarContainer
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 40,
        }}
        initial={{ x: -width }}
        style={{ x }}
      >
        {children}
      </SidebarContainer>
    </Container>
  );
};

export default Sidebar;
