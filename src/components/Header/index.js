import './index.css'
import Cookies from 'js-cookie'
import {Link, withRouter} from 'react-router-dom'

const Header = props => {
  const onClickLogout = () => {
    Cookies.remove('jwt_token')
    const {history} = props
    history.replace('/login')
  }

  return (
    <div className="header">
      <Link to="/" className="Link">
        <img
          src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
          alt="website logo"
          className="head-logo"
        />
      </Link>

      <ul className="header-ul">
        <Link to="/" className="Link">
          <li className="header-li">
            <p>Home</p>
          </li>
        </Link>
        <Link to="/jobs" className="Link">
          <li className="header-li">
            <p>Jobs</p>
          </li>
        </Link>
      </ul>
      <button type="button" className="logout-btn" onClick={onClickLogout}>
        Logout
      </button>
    </div>
  )
}
export default withRouter(Header)
