import './index.css'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'
import {Component} from 'react'

class Login extends Component {
  state = {username: '', password: '', errorMsg: '', isErrorMsgShow: false}

  onSubmitSuccess = data => {
    Cookies.set('jwt_token', data.jwt_token, {expires: 30})
    this.setState({isErrorMsgShow: false})
    const {history} = this.props
    history.replace('/')
  }

  onSubmitFailure = data => {
    this.setState({errorMsg: data.error_msg, isErrorMsgShow: true})
  }

  onSubmitForm = async event => {
    event.preventDefault()
    const apiUrl = `https://apis.ccbp.in/login`

    const {username, password} = this.state
    const loginDetails = {username, password}
    const options = {
      method: 'POST',
      body: JSON.stringify(loginDetails),
    }
    const response = await fetch(apiUrl, options)
    const data = await response.json()
    if (response.ok) {
      this.onSubmitSuccess(data)
    } else {
      this.onSubmitFailure(data)
    }
  }

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  renderUsernameInput = () => {
    const {username} = this.state
    return (
      <>
        <label htmlFor="username">USERNAME</label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={this.onChangeUsername}
          autoComplete="username"
        />
      </>
    )
  }

  renderPasswordInput = () => {
    const {password} = this.state
    return (
      <>
        <label htmlFor="password">PASSWORD</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={this.onChangePassword}
          autoComplete="current-password"
        />
      </>
    )
  }

  render() {
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    const {errorMsg, isErrorMsgShow} = this.state
    return (
      <div className="login-bg">
        <form className="form-container" onSubmit={this.onSubmitForm}>
          <div className="input-container">{this.renderUsernameInput()}</div>
          <div className="input-container">{this.renderPasswordInput()}</div>
          <button type="submit" className="login-button">
            Login
          </button>
          <p className="error-msg">{isErrorMsgShow ? errorMsg : null}</p>
        </form>
      </div>
    )
  }
}

export default Login
