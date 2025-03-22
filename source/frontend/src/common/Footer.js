import React from 'react'
import "../styles/Footer.css"

const FooterComponent = () => {
    return (
        <footer className='footer'>
            <span className='footerText'>NDANNAMO's Application | All Rights Reserved &copy; {new Date().getFullYear()} </span>
        </footer>
    )
}

export default FooterComponent