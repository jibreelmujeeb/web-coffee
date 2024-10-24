import React, { useEffect, useState, useRef } from "react";
import Navbar from "../Components/Navbar";
import axios from "axios";
import Swal from "sweetalert2";
import html2pdf from "html2pdf.js";
import Footer from "../Components/Footer";

const BookingHistory = () => {
  const [allBooking, setallBooking] = useState([]);
  const [first, setfirst] = useState(JSON.parse(localStorage.getItem("user")));
  const [receiptDetails, setReceiptDetails] = useState({});
  const componentRef = useRef();
  const [isReceiptVisible, setIsReceiptVisible] = useState(false);

  const getbooking = () => {
    axios
      .post("https://coffee-web-backend.onrender.com/getbooking", { email: first?.email })
      .then((response) => {
        console.log(response.data);
        setallBooking(response.data.bookings);
      })
      .catch((error) => {});
  };

  useEffect(() => {
    getbooking();
  }, []);

  const bookingAction = async (delivered, bookingIndex, bookingId) => {
    if (delivered) {
      setReceiptDetails(allBooking[bookingIndex]);

      if (componentRef.current) {
        const targetElement = document.getElementById("receipt");
        const element = componentRef.current;
        setIsReceiptVisible(true);

        const options = {
          margin: 0.5,
          filename: "receipt.pdf",
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
        };

        // Generate PDF
        await html2pdf().from(element).set(options).save();
        setIsReceiptVisible(false);
      } else {
        console.error("Element not found, ref is null.");
      }
      return;
    }

    axios
      .delete(`https://coffee-web-backend.onrender.com/deletebooking?id=${bookingId}`)
      .then((response) => {
        console.log(response.data);
        if (response.data.status) {
          Swal.fire({
            icon: "success",
            title: "Good job",
            text: response.data.msg,
          });
          getbooking();
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops",
            text: response.data.msg,
          });
        }
      })
      .catch((error) => {});
  };

  const menuPrices = {
    Pancake: 5000,
    Toasted: 15000,
    ChipsRecommend: 5000,
    Banana: 20000,
    Latte: 1500,
    Doughnut: 12000,
    ChocolateMilk: 25000,
    Greentea: 20000,
    DarkChocolate: 30000,
    WhiteCoffeeRecommend: 30000,
  };

  const calculateTotalAmount = (menuSelect) => {
    if (!menuSelect) return 0;

    const totalAmount = menuSelect.reduce((total, menu) => {
      const price = menuPrices[menu.name]; // Use menu.name to fetch the price
      const quantity = parseInt(menu.amount, 10); // Get the quantity

      // Ensure the price exists and the quantity is valid
      if (price && quantity > 0) {
        total += price * quantity; // Multiply price by quantity
      }

      return total;
    }, 0); // Start with a total of 0

    return totalAmount;
  };  

  return (
    <>
      <div>
        <Navbar />

        <h5 className="px-2">
          Welcome {first?.fullname}, {allBooking.length} booking found
        </h5>

        <div className="booking">
          {allBooking.length > 0 ? (
            <table className="table table-stripped">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Time</th>
                  <th scope="col">Date</th>
                  <th scope="col">People</th>
                  <th scope="col">Delivered</th>
                  <th scope="col">Status</th>
                  <th scope="col">Menu selector</th>
                  <th scope="col">Comment</th>
                  <th scope="col">booking Type</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {allBooking.map((booking, index) => (
                  <tr key={index}>
                    <th scope="row">{index + 1}</th>
                    <td>{booking.time}</td>
                    <td>{booking.date}</td>
                    <td>{booking.numberOfPeople}</td>
                    <td>{booking.delivered ? "Delivered" : "Not delivered"}</td>
                    <td>{booking.status}</td>
                    <td>
                      {booking?.menuSelect.map((menu) => (
                        <div className="men" key={menu.name}>
                          <p>{menu.name}</p>
                          <p>{menu.amount}</p>
                        </div>
                      ))}
                    </td>
                    <td>{booking.comment}</td>
                    <td>{booking.bookingType}</td>
                    <td>
                      <button
                        className="btn btn-danger"
                        onClick={() => {
                          bookingAction(true, index, booking._id);
                        }}
                      >
                        Download Receipt
                      </button>
                      {!booking.delivered && (
                        <button
                          className="btn btn-danger ml-lg-3 mt-3"
                          onClick={() => {
                            bookingAction(false, index, booking._id);
                          }}
                        >
                          Cancel order
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="bg-light p-5 rounded text-center col-11 mx-auto shadow-sm">
              <h6>You have no booking</h6>
            </div>
          )}
        </div>

        <Footer/>
      </div>
      
      <div ref={componentRef} id="receipt" className={isReceiptVisible ? 'receipt' : 'd-none'}>
        <div className="receipt-header">
          <h2>Your Booking Receipt</h2>
          <p>Thank you for your reservation!</p>
        </div>

        <div className="receipt-body">
          <div className="section customer-info">
            <h3>Customer Information</h3>
            <p><strong>Name:</strong> {first?.fullname}</p>
            <p><strong>Email:</strong> {first?.email}</p>
            <p><strong>Phone:</strong> 07085099216</p>
          </div>

          <div className="section booking-info">
            <h3>Booking Details</h3>
            <p><strong>Booking Type:</strong> {receiptDetails.bookingType}</p>
            <p>
              <strong>Menu Selection:</strong> 
              {receiptDetails?.menuSelect?.map((menu, index) => (
                <div key={index}>
                  <p>{menu.name}</p>
                  <p>{menu.amount}</p>
                </div>
              ))}
            </p>
            <p><strong>Booking Date:</strong> {receiptDetails.date}</p>
            <p><strong>Booking Time:</strong> {receiptDetails.time}</p>
            <p><strong>Payment Status:</strong> {receiptDetails?.status == 'success' ? 'Payment made' : 'Yet to make payment'}</p>
          </div>

          <div className="section payment-summary">
            <h3>Payment Summary</h3>
            <p><strong>Total Amount:</strong> {calculateTotalAmount(receiptDetails.menuSelect)}</p>
          </div>
        </div>

        <div className="receipt-footer">
          <p>We look forward to welcoming you!</p>
          <p className="contact"><strong>Contact us:</strong> 07085099216</p>
        </div>
      </div>
    </>
  );
};

export default BookingHistory;
