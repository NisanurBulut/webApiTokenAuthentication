import React, { Component } from 'react';
import AuthContext from '../../context/auth-context';
import { CircularProgress } from '@material-ui/core';
import * as classes from './BookingsPage.module.css';
import BookingList from '../../components/Bookings/BookingList/BookingList';
export class BookingsPage extends Component {
  static contextType = AuthContext;
  state = {
    isLoading: false,
    bookings: [],
  };
  componentDidMount() {
    this.fetchBookings();
  }
  fetchBookings = () => {
    this.setState({ isLoading: true });
    const requestBody = {
      query: `
              query {
                bookings {
                  _id
                 createdAt
                 event {
                   _id
                   title
                   date
                 }
                }
              }
            `,
    };

    fetch('http://localhost:8000/smartBookingApi', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.context.token,
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!');
        }
        return res.json();
      })
      .then((resData) => {
        console.log(resData.data);
        const bookings = resData.data.bookings;
        this.setState({ bookings: bookings, isLoading: false });
      })
      .catch((err) => {
        console.log(err);
        this.setState({ isLoading: false });
      });
  };
  deleteBookingHandler = (bookingId) => {
    this.setState({ isLoading: true });
    const requestBody = {
      query: `
              mutation CancelBooking($id: ID!){
                cancelBooking(bookingId: $id) {
                  _id
                  title
                }
              }
            `,
      variables: {
        id: bookingId,
      },
    };

    fetch('http://localhost:8000/smartBookingApi', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.context.token,
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!');
        }
        return res.json();
      })
      .then((resData) => {
        this.setState((prevState) => {
          const updatedBookings = prevState.bookings.filter((booking) => {
            return booking._id !== bookingId;
          });
          return { bookings: updatedBookings, isLoading: false };
        });
      })
      .catch((err) => {
        console.log(err);
        this.setState({ isLoading: false });
      });
  };
  render() {
    return (
      <div className={classes.bookingPage}>
        {this.state.isLoading ? (
          <CircularProgress className={classes.Spinner} color="secondary" />
        ) : (
          <BookingList
            bookings={this.state.bookings}
            onDelete={this.deleteBookingHandler}
          />
        )}
      </div>
    );
  }
}

export default BookingsPage;
