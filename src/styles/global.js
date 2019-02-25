import { createGlobalStyle } from 'styled-components'
import 'react-circular-progressbar/dist/styles.css'

export default createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    outline: 0;
    box-sizing: border-box;
  }

  body {
    font: normal normal 100%/1.5 Arial, Helvetica, sans-serif;
    background: #7159c1;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  html, body, #root {
    height: 100%;
  }
`
