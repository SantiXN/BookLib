import './menu.css'
import { Link } from "react-router-dom";

const Menu = () => {
  return (
      <nav className="bg-gray-800 p-4">
        <ul className="flex justify-center">
          <li className="mx-2">
            <Link to="/">Main</Link>
          </li>
          <li className="mx-2">
            <Link to="/account">Personal Account</Link>
          </li>
          <li className="mx-2">
            <Link to="/info">Information</Link>
          </li>
          <li className="mx-2">
            <Link to="/admin">Admin/Editor</Link>
          </li>
        </ul>
      </nav>
  );
}

export default Menu
