import logo from "../../images/svg/logotype.svg"
import s from "./Footer.module.css"

const Footer = () => {
    return (
        <footer className={s.footer}>
            <a href="/" className={s.logoLink}>
                <p className={s.logoText}>© BookLib 2024</p>
                <img src={logo} className={s.logoImage} alt="logo"></img>
            </a>
        </footer>
    )
}

export default Footer;