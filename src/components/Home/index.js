import {Link} from 'react-router-dom'
import Header from '../Header'
import './index.css'

const Home = () => (
  <>
    <Header />

    <div className="bg">
      <div className="div1">
        <h1>Find The Job That Fits Your Life</h1>
        <p>
          Millions of People are Searching for jobs, salary information, company
          reviews. Find the job that fits your abilities and potential
        </p>
        <button type="button" className="home-btn">
          <Link className="Link" to="/jobs">
            Find Jobs
          </Link>
        </button>
      </div>
    </div>
  </>
)

export default Home
