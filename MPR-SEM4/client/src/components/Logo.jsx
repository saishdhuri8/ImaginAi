import React from 'react';
import styled from 'styled-components';

const Logo = () => {
  return (
    <StyledWrapper>
      <div className="cube">
        <div className="cube_item cube_x" />
        <div className="cube_item cube_y" />
        <div className="cube_item cube_y" />
        <div className="cube_item cube_x" />
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .cube {
    height: 80px;
    width: 80px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 6px;
  }

  .cube_item {
    height: 40px;
    width: 40px;
    border-radius: 10px;
    transition: all 0.2s ease-in;
  }

  .cube_x {
    background-color: blueviolet;
    animation: animateLoaders 2s infinite;
  }

  .cube_y {
    background-color: aqua;
    animation: animateLoaders 1s 2s infinite;
  }

  @keyframes animateLoaders {
    0% {
      transform: scale(0.8);
    }

    50% {
      transform: scale(1.2);
    }

    100% {
      transform: scale(0.8);
    }
  }`;

export default Logo;
