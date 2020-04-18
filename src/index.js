// An example of how you import jQuery into a JS file if you use jQuery in that file
import $ from 'jquery';
// An example of how you tell webpack to use a CSS (SCSS) file
import './css/base.scss';
import Hotel from './hotel';
import User from './user';
import Manager from './manager';
import domUpdates from './domUpdates';
// var Moment = require('moment');

let userData;
let roomData;
let bookingData;
let hotel;
// let todaysDate = Moment().format('YYYY/MM/DD');

userData = fetch('https://fe-apps.herokuapp.com/api/v1/overlook/1904/users/users')
  .then(data => data.json())
  .then(data => data.users)
  .catch(error => console.log('Theres been and error with fetching userData'));

console.log(userData);

roomData = fetch('https://fe-apps.herokuapp.com/api/v1/overlook/1904/rooms/rooms')
  .then(data => data.json())
  .then(data => data.rooms)
  .catch(error => console.log('Theres been and error with fetching roomData'));

console.log(roomData);

bookingData = fetch('https://fe-apps.herokuapp.com/api/v1/overlook/1904/bookings/bookings')
  .then(data => data.json())
  .then(data => data.bookings)
  .catch(error => console.log('Theres been and error with fetching bookingData'));

console.log(bookingData);

Promise.all([userData, roomData, bookingData])
  .then(data => {
    userData = data[0];
    roomData = data[1];
    bookingData = data[2];
  })
  .then(() => {
    hotel = new Hotel(userData, roomData, bookingData);
    generateAllUsers();
    generateRoomObj();
    generateBookingObj();
  })
  .catch(error => {
    console.log('Opps! Something went wrong with the promise.all', error);
  });

let generateAllUsers = () => {
  userData.forEach(user => {
    user = new User(user);
    hotel.allGuests.push(user);
  })
}

let generateRoomObj = () => {
  roomData.forEach(room => {
    let roomObj = {
      'number': room.number,
      'roomType': room.roomType,
      'bidet': room.bidet,
      'bedSize': room.bedSize,
      'numBeds': room.numBeds
    }
    hotel.allRooms.push(roomObj);
  })
}

let generateBookingObj = () => {
  hotel.allCurrentBookings = matchRoomsToCorrectBookings();
}

let matchRoomsToCorrectBookings = () => {
  let bookings = [];
  bookingData.map(booking => {
    roomData.forEach(room => {
      if(booking.roomNumber === room.number) {
        let bookingObj = {
          'id': booking.id,
          'userId': booking.userId,
          'date': booking.date,
          'roomNumber': room.roomNumber,
          'roomType': room.roomType,
          'bidet': room.bidet,
          'bedSize': room.bedSize,
          'numBeds': room.numBeds,
          'costPerNight': room.costPerNight,
          'roomServiceCharges': booking.roomServiceCharges
        }
        bookings.push(bookingObj);
      }
    })
  })
  return bookings;
}

// capture text in the input user
// capture text in the Password


let gatherLoginInfo = () => {
  let userNameInput = $('.user-name-input');
  let passwordInput = $('.password-input');
  if (userNameInput.val() === 'manager' && passwordInput.val() === 'overlook2020') {
    $('.login-page').html(`<section class='manager-page'><h4 class="welcome-user">Manager Name</h4>
    <section class="manager-info">
      <p class="rooms-avail-todays-date">15</p>
      <p class="total-revenue-today">$3000</p>
      <p class="percent-rooms-occupied">30%</p>
    </section>
    <section class="create-booking">
      <div class="date-selector">
        <p class="select-date-message">Please choose the day you'd like to stay with us:</p>
        <div class="date-input-btn-holder">
          <input class="date-input" type="number" placeholder="YYYY/MM/DD">
          <button class="submit-date-button" type="button" role="button">Select Date</button>
        </div>
      </div>
      <div class="filter-hotel-rooms-dropdown">
        <button class="filter-button"type="button" role="button">Filter you room search <i class="fa fa-caret-down"></i></button>
        <div class="filter-content">
          <a href="#">Residential Suite</a>
          <a href="#">Suite</a>
          <a href="#">Junior Suite</a>
          <a href="#">Single Room</a>
        </div>
      </div>
    </section>
    </section>`);
    changeMainClassToManager();
  }
}

let changeMainClassToManager = () => {
  console.log('made it')
  $('.login-page').removeClass('.login-page').addClass('.manager-page');
}

$('.login-button').on('click', gatherLoginInfo);

// let displayUserPage = () => {
//
// }
//
// let displayManagerPage = () => {
//
// }
