import {Component} from 'react'
import Cookies from 'js-cookie'
import {Link} from 'react-router-dom'
import {IoLocationOutline} from 'react-icons/io5'
import {BsBriefcase, BsSearch} from 'react-icons/bs'
import Loader from 'react-loader-spinner'
import './index.css'
import Header from '../Header'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Jobs extends Component {
  state = {
    profileDetails: {},
    searchInput: '',
    activeSalaryId: '',
    activeEmploymentType: [],
    jobsList: [],
    profileApiStatus: apiStatusConstants.initial,
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getProfile()
    this.getJobs()
  }

  getProfile = async () => {
    this.setState({profileApiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/profile`
    const options = {
      method: 'GET',
      headers: {Authorization: `Bearer ${jwtToken}`},
    }
    const response = await fetch(url, options)
    if (response.ok) {
      const data = await response.json()
      const profileDetails = data.profile_details
      const updatedData = {
        profileImageUrl: profileDetails.profile_image_url,
        name: profileDetails.name,
        shortBio: profileDetails.short_bio,
      }
      this.setState({
        profileDetails: updatedData,
        profileApiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({profileApiStatus: apiStatusConstants.failure})
    }
  }

  getJobs = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {searchInput, activeEmploymentType, activeSalaryId} = this.state
    const string = activeEmploymentType.join(',')
    console.log(string)
    const apiUrl = `https://apis.ccbp.in/jobs?search=${searchInput}&employment_type=${string}&minimum_package=${activeSalaryId}`
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {Authorization: `Bearer ${jwtToken}`},
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const data = await response.json()

      const updatedData = data.jobs.map(each => ({
        id: each.id,
        title: each.title,
        companyLogoUrl: each.company_logo_url,
        employmentType: each.employment_type,
        location: each.location,
        jobDescription: each.job_description,
        packagePerAnnum: each.package_per_annum,
        rating: each.rating,
      }))
      this.setState({
        jobsList: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onChangeSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  onClickSearch = () => {
    this.getJobs()
  }

  onkeydownEnter = event => {
    if (event.key === 'Enter') {
      this.getJobs()
    }
  }

  onClickEmploymentType = type => {
    this.setState(prevState => {
      const isActive = prevState.activeEmploymentType.includes(type)
      const update = isActive
        ? prevState.activeEmploymentType.filter(eachType => eachType !== type)
        : [...prevState.activeEmploymentType, type]
      return {activeEmploymentType: update}
    }, this.getJobs)
  }

  failureView = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
    </div>
  )

  loader = () => (
    <div className="loader-container job-bg" data-testid="loader">
      <Loader type="ThreeDots" color="#fde577" height="50" width="50" />
    </div>
  )

  renderJobs = () => {
    const {profileDetails, jobsList, searchInput} = this.state
    const length = jobsList.length > 0
    return (
      <div className="flexbox-c job-bg">
        <div className="job-bg">
          <div className="profile-bg">
            <img
              src={profileDetails.profileImageUrl}
              className="image"
              alt="profile"
            />
            <h1>{profileDetails.name}</h1>
            <p>{profileDetails.shortBio}</p>
          </div>

          <ul>
            <h1 className="filter-h">Types of Employment</h1>
            {employmentTypesList.map(each => {
              const {activeEmploymentType} = this.state

              return (
                <li key={each.employmentTypeId}>
                  <input
                    className="option-input"
                    type="checkbox"
                    value={activeEmploymentType}
                    checked={activeEmploymentType.includes(
                      each.employmentTypeId,
                    )}
                    id={each.employmentTypeId}
                    onChange={() =>
                      this.onClickEmploymentType(each.employmentTypeId)
                    }
                  />
                  <label htmlFor={each.employmentTypeId}>{each.label}</label>
                </li>
              )
            })}
          </ul>

          <ul>
            <h1 className="filter-h">Salary Range</h1>
            {salaryRangesList.map(each => (
              <li key={each.salaryRangeId}>
                <input
                  className="option-input"
                  type="radio"
                  onClick={this.onClickSalaryPackage}
                  id={each.salaryRangeId}
                  name="1"
                />
                <label htmlFor={each.salaryRangeId}>{each.label}</label>
              </li>
            ))}
          </ul>
        </div>
        <div className="jobs-c">
          <div className="search-input-c">
            <input
              type="search"
              className="input-search"
              value={searchInput}
              placeholder="Search Jobs"
              onChange={this.onChangeSearchInput}
              onKeyDown={this.onkeydownEnter}
            />
            <button
              type="button"
              onClick={this.onClickSearch}
              data-testid="searchButton"
            >
              <BsSearch className="search-icon" />
            </button>
          </div>
          <ul className="jobs-container">
            {length ? (
              <>
                {jobsList.map(each => (
                  <Link to={`/jobs/${each.id}`} className="Link">
                    <li key={each.id} className="job-open-c list">
                      <div className="job-img-title-c">
                        <img
                          className="company-logo"
                          src={each.companyLogoUrl}
                          alt="company logo"
                        />
                        <div className="job-title-rating-c">
                          <h1 className="title">{each.title}</h1>
                          <p className="rating"> {each.rating} </p>
                        </div>
                      </div>

                      <div className="location-salary-c">
                        <div className="location-c">
                          <div className="icon-c">
                            <IoLocationOutline className="icon" />
                            <p>{each.location}</p>
                          </div>
                          <div className="icon-c">
                            <BsBriefcase className="icon" />
                            <p className="icon-p">{each.employmentType}</p>
                          </div>
                        </div>
                        <p>{each.packagePerAnnum}</p>
                      </div>
                      <hr />
                      <h3>Description</h3>
                      <p className="description">{each.jobDescription} </p>
                    </li>
                  </Link>
                ))}
              </>
            ) : (
              <div className="job-bg">
                <div className="no-job-c">
                  <img
                    src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
                    alt="no jobs"
                    className="no-jobs-img"
                  />
                  <h1 className="no-jobs-h">No Jobs Found</h1>
                  <p className="para">
                    We could not find any jobs. Try other filters
                  </p>
                  <button onClick={this.onClickSearch} className="logout-btn">
                    Retry
                  </button>
                </div>
              </div>
            )}
          </ul>
        </div>
      </div>
    )
  }

  renderAll = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderJobs()
      case apiStatusConstants.failure:
        return this.failureView()
      case apiStatusConstants.inProgress:
        return this.loader()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        {this.renderAll()}
      </>
    )
  }
}
export default Jobs
