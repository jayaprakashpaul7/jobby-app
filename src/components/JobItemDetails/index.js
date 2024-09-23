import {Component} from 'react'
import Cookies from 'js-cookie'
import {IoLocationOutline} from 'react-icons/io5'
import {BsBriefcase, BsArrowUpRight} from 'react-icons/bs'
import Header from '../Header'

import './index.css'

class JobItemDetails extends Component {
  state = {jobItemDetails: {}, similarJobsList: []}

  componentDidMount() {
    this.getJobDetails()
  }

  getJobDetails = async () => {
    const jwtToken = Cookies.get('jwt_token')
    const {match} = this.props
    const {params} = match
    const {id} = params
    const apiUrl = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      method: 'GET',
      headers: {Authorization: `Bearer ${jwtToken}`},
    }

    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const data = await response.json()
      const jobDetails = data.job_details
      const updatedJobsData = {
        id: jobDetails.id,
        title: jobDetails.title,
        companyLogoUrl: jobDetails.company_logo_url,
        companyWebsiteUrl: jobDetails.company_website_url,
        employmentType: jobDetails.employment_type,
        jobDescription: jobDetails.job_description,
        location: jobDetails.location,
        packagePerAnnum: jobDetails.package_per_annum,
        rating: jobDetails.rating,
        lifeAtCompany: {
          description: jobDetails.life_at_company.description,
          imageUrl: jobDetails.life_at_company.image_url,
        },

        skills: jobDetails.skills,
      }
      const similarJobs = data.similar_jobs
      const updatedSimilarJobs = similarJobs.map(each => ({
        id: each.id,
        employmentType: each.employment_type,
        companyLogoUrl: each.company_logo_url,
        jobDescription: each.job_description,
        location: each.location,
        title: each.title,
      }))
      this.setState({
        jobItemDetails: updatedJobsData,
        similarJobsList: updatedSimilarJobs,
      })
    }
  }

  render() {
    const {jobItemDetails, similarJobsList} = this.state
    const {skills, lifeAtCompany} = jobItemDetails
    return (
      <div>
        <Header />
        <div className="job-item-bg">
          <div className="flex-container">
            <div className="logo-title-container">
              <img
                src={jobItemDetails.companyLogoUrl}
                className="logo"
                alt="job details company logo"
              />
              <div>
                <h1 className="sub-head">{jobItemDetails.title}</h1>
                <p>{jobItemDetails.rating}</p>
              </div>
            </div>
            <div className="locate-job-salary-c">
              <div className="locate-job-c">
                <div className="icon-c">
                  <IoLocationOutline className="icon" />
                  <p>{jobItemDetails.location}</p>
                </div>
                <div className="icon-c">
                  <BsBriefcase className="icon" />
                  <p>{jobItemDetails.employmentType}</p>
                </div>
              </div>
              <p>{jobItemDetails.packagePerAnnum}</p>
            </div>
            <hr />
            <div>
              <div className="visit-c">
                <h1 className="sub-head">Description</h1>
                <a className="Link1" href={jobItemDetails.companyWebsiteUrl}>
                  Visit
                  <span>
                    <BsArrowUpRight />
                  </span>
                </a>
              </div>
              <p className="para">{jobItemDetails.jobDescription}</p>
            </div>
            <div>
              <h1 className="sub-head">Skills</h1>
              <div className="skills-c">
                {skills &&
                  skills.map(each => (
                    <div className="skill" key={each.name}>
                      <img
                        src={each.image_url}
                        alt={each.name}
                        className="skill-icon"
                      />
                      <p>{each.name}</p>
                    </div>
                  ))}
              </div>
            </div>
            <div>
              <h1 className="sub-head">Life at Company</h1>
              {lifeAtCompany && (
                <div className="work-at-comapany">
                  <img
                    className="work-at-comapany-img"
                    src={lifeAtCompany.imageUrl}
                    alt="life at company"
                  />
                  <p className="work-at-comapany-des para">
                    {lifeAtCompany.description}
                  </p>
                </div>
              )}
            </div>
          </div>
          <div>
            <h1 className="sub-head">Similar Jobs</h1>
            <div className="similar-jobs-c">
              {similarJobsList.map(each => (
                <div className="logo-title-c similar-job-item-c">
                  <div>
                    <img
                      className="logo"
                      src={each.companyLogoUrl}
                      alt="similar job company logo"
                    />
                    <div className="">
                      <h1 className="sub-head">{each.title}</h1>
                      <p>{each.rating}</p>
                    </div>
                  </div>
                  <div>
                    <h1>Description</h1>
                    <p className="para">{each.jobDescription}</p>
                  </div>
                  <div className="locate-job-c">
                    <div className="icon-c">
                      <IoLocationOutline className="icon" />
                      <p>{each.location}</p>
                    </div>
                    <div className="icon-c">
                      <BsBriefcase className="icon" />
                      <p>{each.employmentType}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }
}
export default JobItemDetails
