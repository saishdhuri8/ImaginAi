import React from 'react';
import styled from 'styled-components';

const Load = () => {
  return (
    <StyledWrapper>
      <svg style={{left: '50%', top: '50%', position: 'absolute', transform: 'translate(-50%, -50%) matrix(1, 0, 0, 1, 0, 0)'}} preserveAspectRatio="xMidYMid meet" viewBox="0 0 187.3 93.7" height="300px" width="400px">
        <path d="M93.9,46.4c9.3,9.5,13.8,17.9,23.5,17.9s17.5-7.8,17.5-17.5s-7.8-17.6-17.5-17.5c-9.7,0.1-13.3,7.2-22.1,17.1 				c-8.9,8.8-15.7,17.9-25.4,17.9s-17.5-7.8-17.5-17.5s7.8-17.5,17.5-17.5S86.2,38.6,93.9,46.4z" strokeMiterlimit={10} strokeLinejoin="round" strokeLinecap="round" strokeWidth={4} fill="none" id="outline" stroke="#4E4FEB" />
        <path d="M93.9,46.4c9.3,9.5,13.8,17.9,23.5,17.9s17.5-7.8,17.5-17.5s-7.8-17.6-17.5-17.5c-9.7,0.1-13.3,7.2-22.1,17.1 				c-8.9,8.8-15.7,17.9-25.4,17.9s-17.5-7.8-17.5-17.5s7.8-17.5,17.5-17.5S86.2,38.6,93.9,46.4z" strokeMiterlimit={10} strokeLinejoin="round" strokeLinecap="round" strokeWidth={4} stroke="#4E4FEB" fill="none" opacity="0.05" id="outline-bg" />
      </svg>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  #outline {
    stroke-dasharray: 2.42777px, 242.77666px;
    stroke-dashoffset: 0;
    -webkit-animation: anim 1.6s linear infinite;
    animation: anim 1.6s linear infinite;
  }

  @-webkit-keyframes anim {
    12.5% {
      stroke-dasharray: 33.98873px, 242.77666px;
      stroke-dashoffset: -26.70543px;
    }

    43.75% {
      stroke-dasharray: 84.97183px, 242.77666px;
      stroke-dashoffset: -84.97183px;
    }

    100% {
      stroke-dasharray: 2.42777px, 242.77666px;
      stroke-dashoffset: -240.34889px;
    }
  }

  @keyframes anim {
    12.5% {
      stroke-dasharray: 33.98873px, 242.77666px;
      stroke-dashoffset: -26.70543px;
    }

    43.75% {
      stroke-dasharray: 84.97183px, 242.77666px;
      stroke-dashoffset: -84.97183px;
    }

    100% {
      stroke-dasharray: 2.42777px, 242.77666px;
      stroke-dashoffset: -240.34889px;
    }
  }`;

export default Load;
