<template>
    <div class="e-card playing"> 
        <div class="image"></div>
      
      <div class="wave"></div>
      <div class="wave"></div>
      <div class="wave"></div>
      
        <div class="card  infotop">
            <div class="card__border"></div>
            <div class="card_title__container">
                <span class="card_title">TABLET OPERADOR</span>
                <p class="card_paragraph">Vistas tipo HMI para operación de plantas</p>
            </div>
            <hr class="line" />
            <div class="grid grid-cols-2 sm:grid-cols-2 gap-5">
                <div>
                    <span class="card_title">Acuicultura</span>
                    <ul class="card__list">
    s
                        <li>
                            <button class="button">Entrar</button>
                        </li>
                    </ul>
    
                </div>
                <div>
                    <span class="card_title">Minería</span>
                    <br/>
                    <span class="card_title">(en desarrollo)</span>
                    <ul class="card__list">
                        <li class="card__list_item">
                            <span class="check">
                                <svg class="check_svg" fill="currentColor" viewBox="0 0 16 16"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path clip-rule="evenodd"
                                        d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z"
                                        fill-rule="evenodd"></path>
                                </svg>
                            </span>
                            <span class="list_text">Renders</span>
                        </li>
                        <li class="card__list_item">
                            <span class="check">
                                <svg class="check_svg" fill="currentColor" viewBox="0 0 16 16"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path clip-rule="evenodd"
                                        d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z"
                                        fill-rule="evenodd"></path>
                                </svg>
                            </span>
                            <span class="list_text">Demo</span>
                        </li>
    
    
                    </ul>
                </div>
            </div>
    
        </div>
    </div>
    </template>
    <script>
    
    export default {
    }
    </script>
    
    <style scoped>
    
    .infotop {
      
      position: absolute;
     
      left: 0;
      right: 0;
       
    }
    .card {
        --white: hsl(0, 0%, 100%);
        --black: hsl(240, 15%, 9%);
        --paragraph: hsl(0, 0%, 83%);
        --line: hsl(240, 9%, 17%);
        --primary: hsl(206, 92%, 58%);
    
        position: relative;
    
        display: flex;
        flex-direction: column;
        gap: 1rem;
    
        padding: 1rem;
        width: 29rem;
            border-radius: 0rem;
        box-shadow: 0px -16px 24px 0px rgba(255, 255, 255, 0.25) inset;
        min-height:17rem;
    }
    
    .card .card__border {
        overflow: hidden;
        pointer-events: none;
    
        position: absolute;
        z-index: -10;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    
        width: calc(100% + 2px);
        height: calc(100% + 2px);
        
    
        border-radius: 1rem;
    }
    
    .card .card__border::before {
        content: "";
        pointer-events: none;
    
        position: fixed;
        z-index: 200;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%), rotate(0deg);
        transform-origin: left;
    
        width: 200%;
        height: 10rem;
        background-image: linear-gradient(0deg,
                hsla(0, 0%, 100%, 0) 0%,
                hsl(189, 100%, 50%) 40%,
                hsl(189, 100%, 50%) 60%,
                hsla(0, 0%, 40%, 0) 100%);
    
        animation: rotate 8s linear infinite;
    }
    
    @keyframes rotate {
        to {
            transform: rotate(360deg);
        }
    }
    
    .card_title {
        font-size: 1.5rem;
        color: var(--white);
        font-weight: bold;
        letter-spacing: 1px;
    
    }
    
    .card .card_title__container .card_title {
        font-size: 1.8rem;
        color: var(--white);
        font-weight: bold;
        letter-spacing: 7px;
    }
    
    .card .card_title__container .card_paragraph {
        margin-top: 0.25rem;
        width: 100%;
    
        font-size: 0.9rem;
        color: var(--paragraph);
    }
    
    .card .line {
        width: 100%;
        height: 0.1rem;
        background-color: var(--line);
    
        border: none;
    }
    
    .card .card__list {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        margin-top: 6px;
    }
    
    .card .card__list .card__list_item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .card .card__list .card__list_item .check {
        display: flex;
        justify-content: center;
        align-items: center;
    
        width: 1rem;
        height: 1rem;
        background-color: var(--primary);
    
        border-radius: 50%;
    }
    
    .card .card__list .card__list_item .check .check_svg {
        width: 0.75rem;
        height: 0.75rem;
    
        fill: var(--black);
    }
    
    .card .card__list .card__list_item .list_text {
        font-size: 0.90rem;
        color: var(--white);
    }
    
    .card .button {
        cursor: pointer;
    
        padding: 0.5rem;
        width: 100%;
        background-image: linear-gradient(0deg,
                hsl(189, 92%, 58%),
                hsl(189, 99%, 26%) 100%);
    
    
         font-size: 0.85rem;
        color: var(--white);
        font-weight: bold;
        border: 0;
        border-radius: 9999px;
        box-shadow: inset 0 -2px 25px -4px var(--white);
    }
    
    
    
    .e-card {
      
      background: transparent;
       position: relative;
     
      overflow: hidden;
    }
    
    .wave {
      position: absolute;
      width: 520px;
      height: 500px;
      opacity: 0.8;
      left: 0;
      top: 0;
      margin-left: -0%;
      margin-top: -70%;
      background: linear-gradient(744deg,#af40ff,#5b42f3 60%,#00ddeb);
    }
    
      
    
    .wave:nth-child(2),
    .wave:nth-child(3) {
      top: 210px;
    }
    
    .playing .wave {
      border-radius: 60%;
      animation: wave 7000ms infinite linear;
    }
    
    .wave {
      border-radius: 60%;
      animation: wave 85s infinite linear;
    }
    
    .playing .wave:nth-child(2) {
      animation-duration: 9000ms;
    }
    
    .wave:nth-child(2) {
      animation-duration: 80s;
    }
    
    .playing .wave:nth-child(3) {
      animation-duration: 9000ms;
    }
    
    .wave:nth-child(3) {
      animation-duration: 85s;
    }
    
    @keyframes wave {
      0% {
        transform: rotate(0deg);
      }
    
      100% {
        transform: rotate(360deg);
      }
    }
    </style>