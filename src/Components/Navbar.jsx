import React from 'react'
import img1 from '../assets/images/coffee-beans.png'
import { useNavigate,Link } from 'react-router-dom'

const Navbar = () => {
    const navigate = useNavigate()
  return (
    <nav className="navbar navbar-expand-lg">
            <div className="container">
              <Link  className="navbar-brand d-flex align-items-center" to="/home">
                <img src={img1} className="navbar-brand-image img-fluid" alt="Barista Cafe Template" />
                Jibreel
              </Link >
    
              <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
              </button>
    
              <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav ms-lg-auto">
                  <li className="nav-item">
                    <Link  className="nav-link smoothscroll" to="/home">Home</Link >
                  </li>
                  <li className="nav-item">
                    <Link  className="nav-link smoothscroll" to="#section_2">About</Link >
                  </li>
                  <li className="nav-item">
                    <Link  className="nav-link smoothscroll" to="#section_3">Our Menu</Link >
                  </li>
                  <li className="nav-item">
                    <Link  className="nav-link smoothscroll" to="#section_4">Reviews</Link >
                  </li>
                  <li className="nav-item">
                    <Link  className="nav-link smoothscroll" to="#section_5">Contact</Link >
                  </li>
                  <li className="nav-item">
                    <Link  className="nav-link smoothscroll" to="/history">History</Link >
                  </li>
                  <li className="nav-item" onClick={()=>{
                    localStorage.removeItem('user'), 
                    !localStorage.user?navigate('/login'):null
                    }}>
                    <Link  className="nav-link smoothscroll" ><i className="bi bi-box-arrow-left"></i></Link >
                  </li>
                </ul>
    
                <div className="ms-lg-3 col-3">
                  <button className="btn custom-btn custom-border-btn w-100" onClick={()=>{navigate('/reserve')}}>
                    Reservation
                    <i className="bi-arrow-up-right ms-2"></i>
                  </button>
                </div>
              </div>
            </div>
          </nav>
  )
}

export default Navbar