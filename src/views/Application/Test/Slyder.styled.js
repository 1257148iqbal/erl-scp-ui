import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  height: 70vh;
  display: flex;
  position: relative;
  overflow: hidden;
`;

export const Arrow = styled.div`
  width: 50px;
  height: 50px;
  background-color: #f7f0f0;
  color: #000;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  bottom: 0;
  left: ${props => props.direction === 'left' && '10px'};
  right: ${props => props.direction === 'right' && '10px'};
  margin: auto;
  cursor: pointer;
  opacity: 0.5;
  z-index: 2;
`;

export const Wrapper = styled.div`
  height: 100%;
  display: flex;
  transition: all 1.5s ease;
  transform: translateX(${props => props.slideIndex * -100}vw);
`;

export const Slide = styled.div`
  display: flex;
  align-items: center;
  width: 100vw;
  height: 100vh;
`;

export const ImageContainer1 = styled.div`
  flex: 1;
  height: 100%;
  position: relative;
`;
export const ImageContainer2 = styled.div`
  flex: 1;
  height: 100%;
  position: relative;
`;

export const Image = styled.img`
  /* height: 100%; */
  width: 100%;
  object-fit: contain;
`;

export const Pass1 = styled.div`
  width: 50px;
  height: 40px;
  padding: 10px;
  position: absolute;
  top: 12%;
  left: 10%;
  border-radius: 5px;
  background-color: skyblue;
`;

export const Pass2 = styled.div`
  width: 50px;
  height: 40px;
  padding: 10px;
  position: absolute;
  top: 130px;
  left: 240px;
  border-radius: 5px;
  background-color: red;
`;
