import { Link } from "react-router-dom";
import logo from "../../images/svg/logotype.svg"
import s from "./Footer.module.css"

const Footer = () => {
    return (
        <footer className={s.footer}>
            <Link to="/" className={s.logoLink}>
                <p className={s.logoText}>© BookLib 2024</p>
                <img src={logo} className={s.logoImage} alt="logo"></img>
            </Link>
        </footer>
    )
}

export default Footer;