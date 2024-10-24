import axios from "axios";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import Footer from "./Footer";

const Admin = () => {
  const [allBooking, setallBooking] = useState([]);
  const [admindet, setAdmindet] = useState(
    JSON.parse(localStorage.getItem("admin_user"))
  );

  const getbooking = () => {
    axios
      .post("https://coffee-web-backend.onrender.com/admin/bookings", { fetch: true })
      .then((response) => {
        console.log(response.data);
        setallBooking(response.data.bookings);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const [activAdmin, setactivAdmin] = useState(false);
  const checkActiveAdmin = () => {
    axios
      .post("https://coffee-web-backend.onrender.com/admin/activateAdmin", {
        email: admindet?.email,
      })
      .then((response) => {
        console.log(response.data);

        if (response.data.status) {
          // getbooking()
          setactivAdmin(true);
        } else {
        }
      });
  };

  useEffect(() => {
    checkActiveAdmin();
    getbooking();
  }, []);

  const deliver = (bkId) => {
    axios
      .post("https://coffee-web-backend.onrender.com/admin/deliver", { bkId })
      .then((response) => {
        console.log(response.data);
        if (response.status) {
          Swal.fire({
            icon: "success",
            title: "Good job",
            text: "Order has been delivered",
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Failed to deliver order",
          });
        }
        getbooking();
      });
  };

  const [allAdmin, setallAdmin] = useState([]);
  const getAllAdmin = () => {
    axios.post("https://coffee-web-backend.onrender.com/admin/allAdmins").then((response) => {
      console.log(response.data);
      if (response.data.status) {
        setallAdmin(response.data.allAdmin);
      }
    });
  };
  const [firstAdmin, setfirstAdmin] = useState(false);
  const checkFirstAdmin = () => {
    axios
      .post("https://coffee-web-backend.onrender.com/admin/checkfirstAdmin", {
        email: admindet?.email,
      })
      .then((response) => {
        console.log(response.data);
        if (response.data.status) {
          setfirstAdmin(true);
          getAllAdmin();
        }
      });
  };
  useEffect(() => {
    checkFirstAdmin();
  }, []);

  const [seeAllAdmin, setseeAllAdmin] = useState(false);

  const activateAdmin = (email, act) => {
    axios
      .post("https://coffee-web-backend.onrender.com/admin/activation", { email, act })
      .then((response) => {
        console.log(response.data);
        if (response.data.status) {
          Swal.fire({
            icon: "success",
            title: "Good job",
            text: "Admin has been activated",
          });
          getAllAdmin();
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: response.data.msg,
          });
        }
      });
  };
  const deleteAdmin = (id, act) => {
    axios
      .delete(`https://coffee-web-backend.onrender.com/admin/deleteadmin/${id}`)
      .then((response) => {
        console.log(response.data);
        if (response.data.status) {
          Swal.fire({
            icon: "success",
            title: "Good job",
            text: "Admin has been deleted successfully",
          });
          getAllAdmin();
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: response.data.msg,
          });
        }
      });
  };

  console.log(allBooking);
  
  return (
    <div>
      <h6> Username: {admindet?.username}</h6>
      {activAdmin ? (
        <div>
          {firstAdmin ? (
            <div>
              <h6>You are the first admin</h6>
              <button
                className="btn "
                onClick={() => {
                  setseeAllAdmin(!seeAllAdmin);
                }}
              >
                {seeAllAdmin ? "Close admin" : "See all admin"}
              </button>
              {seeAllAdmin ? (
                <div>
                  All admin:
                  <table className="table">
                    <tr>
                      <th>Username</th>
                      <th>Email</th>
                      <th>Activate admin</th>
                    </tr>
                    {allAdmin.map((admin, index) => (
                      <tr key={index}>
                        <td>{admin.username}</td>
                        <td>{admin.email}</td>
                        <td>
                          {admin.email == admindet?.email ? (
                            <div>This is you </div>
                          ) : (
                            <>
                              <button
                                className={`btn btn-${
                                  admin.activate ? "danger" : "success"
                                }`}
                                onClick={() => {
                                  activateAdmin(admin.email, admin.activate);
                                }}
                              >
                                {admin.activate ? "Dectivate" : "Activate"}
                              </button>
                              <button
                                className="btn btn-danger ml-4 "
                                onClick={() => {
                                  deleteAdmin(admin._id, admin.activate);
                                }}
                              >
                                Delete
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </table>
                </div>
              ) : null}
            </div>
          ) : null}
          <h6>{allBooking.length} order found</h6>
          {allBooking.length > 0 ? (
            <table class="table table-stripped">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">email</th>
                  <th scope="col">phone</th>
                  <th scope="col">Time</th>
                  <th scope="col">Date</th>
                  <th scope="col">People</th>
                  <th scope="col">bookingType</th>
                  <th scope="col">Menu selector</th>
                  <th scope="col">Comment</th>
                  <th scope="col">Status</th>
                  <th scope="col">Delivered</th>
                </tr>
              </thead>
              <tbody>
                {allBooking
                  .slice()
                  .reverse()
                  .map((booking, index) => (
                    <tr key={index}>
                      <th scope="row">{index + 1}</th>
                      <td>{booking.email}</td>
                      <td>{booking.phone}</td>
                      <td>{booking.time}</td>
                      <td>{booking.date}</td>
                      <td>{booking.numberOfPeople}</td>
                      <td>{booking.bookingType}</td>
                      <td>{booking?.menuSelect.map( menu => (
                        <div className="text">
                          <p>{menu.name}</p>
                          <p>{menu.amount}</p>
                        </div>
                      ))}</td>
                      <td>{booking.comment}</td>
                      <td>{booking.status}</td>
                      <td>
                        {!booking.delivered ? (
                          <button
                            className="btn btn-success"
                            onClick={() => {
                              deliver(booking._id);
                            }}
                          >
                            Delivered
                          </button>
                        ) : (
                          "Order has been delivered"
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          ) : (
            <div className="bg-light p-5 rounded text-center col-11 mx-auto shadow-sm">
              <h6>Your users have no booking</h6>
            </div>
          )}
        </div>
      ) : (
        <div>
          <h5>You have not been given permission to enter this page</h5>
          <button className="btn btn-success">Go back</button>
        </div>
      )}
      <Footer/>
    </div>
  );
};

export default Admin;
