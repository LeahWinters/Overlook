import $ from 'jquery';
import './css/base.scss';
import Hotel from './hotel';
import User from './user';
import Manager from './manager';
import domUpdates from './domUpdates';

let userData;
let roomData;
let bookingData;
let hotel;
let manager;
let customer;

userData = fetch('https://fe-apps.herokuapp.com/api/v1/overlook/1904/users/users')
  .then(data => data.json())
  .then(data => data.users)
  .catch(error => console.log('Theres been an error with fetching userData'));

roomData = fetch('https://fe-apps.herokuapp.com/api/v1/overlook/1904/rooms/rooms')
  .then(data => data.json())
  .then(data => data.rooms)
  .catch(error => console.log('Theres been an error with fetching roomData'));

bookingData = fetch('https://fe-apps.herokuapp.com/api/v1/overlook/1904/bookings/bookings')
  .then(data => data.json())
  .then(data => data.bookings)
  .catch(error => console.log('Theres been an error with fetching bookingData'));

// take the promise and the fetches and put inside a method, and call the method onload. makes it a bit cleaner.

Promise.all([userData, roomData, bookingData])
  .then(data => {
    userData = data[0];
    roomData = data[1];
    console.log(roomData)
    bookingData = data[2];
  })
  .then(() => {
    hotel = new Hotel(generateAllUsers());
    generateRoomObj();
    generateBookingObj();
  })
  .catch(error => {
    console.log('Opps! Something went wrong with the promise.all', error);
  });

const generateAllUsers = () => {
  const allUsers = userData.map(user => {
    return new User(user);
  });
  return allUsers;
}

const generateRoomObj = () => {
  roomData.forEach(room => {
    const roomObj = {
      'number': room.number,
      'roomType': room.roomType,
      'bidet': room.bidet,
      'bedSize': room.bedSize,
      'numBeds': room.numBeds
    }
    hotel.allRooms.push(roomObj);
  })
}

const generateBookingObj = () => {
  hotel.allCurrentBookings = matchRoomsToCorrectBookings();
}

const matchRoomsToCorrectBookings = () => {
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

// post try

// const createBooking = () => {
//   const data = {
//     'id': `${Date.now()}`,
//     'userID': 2,
//     'date': '2020/04/18',
//     'roomNumber': 4
//   }
//   fetch('https://fe-apps.herokuapp.com/api/v1/overlook/1904/bookings/bookings', {
//     method: 'POST',
//     headers: {
//         'Content-Type': 'application/json'
//       },
//     body: JSON.stringify(data)
//   })
//   .then(res => console.log(res))
//   .catch(error => console.log("There has been an issue with your post"));
// }

const createManager = () => {
  manager = new Manager();
}

const createCustomer = (id, name) => {
  customer = new User(id, name);
}

const gatherLoginInfo = () => {
  const userNameInput = $('.user-name-input');
  const passwordInput = $('.password-input');
  if (userNameInput.val() === 'manager' && passwordInput.val() === 'overlook2020') {
    createManager();
    changeSectionClassToManager();
    displayManagerPage();
  } else if (getUserIdNumber(userNameInput.val()) && passwordInput.val() === 'overlook2020') {
    changeSectionClassToUser();
    displayUserPage();
  } else if (!getUserIdNumber(userNameInput.val()) && passwordInput.val() === 'overlook2020') {
    $('.username-error').css('visibility', 'visible');
  } else if (getUserIdNumber(userNameInput.val()) && passwordInput.val() !== 'overlook2020') {
    $('.password-error').css('visibility', 'visible');
  }
}

const getUserIdNumber = (userNameInput) => {
  const user = userData.find(user => {
    return `customer${user.id}` === userNameInput;
  });
  if (user === undefined) {
    return false;
  } else {
    createCustomer(user.id, user.name);
    return true;
  }
}

const changeSectionClassToManager = () => {
  $('.login-page').removeClass('.login-page').addClass('.manager-page');
}

const changeSectionClassToUser = () => {
  $('.login-page').removeClass('.login-page').addClass('.user-page');
}

$('.login-button').on('click', gatherLoginInfo);

const displayManagerPage = () => {
  $('.login-page').html(`<section class='manager-page'>
    <h4 class="manager-name">Manager Name</h4>
    <section class="manager-info">
      <section class="hotel-data">
        <p class="rooms-avail-todays-date">Number of Rooms Available Today: ${hotel.getNumOfRoomsAvailibleToday()}</p>
        <p class="total-revenue-today">Total Revenue Today: ${hotel.calculateTodaysRevenue()}</p>
        <p class="percent-rooms-occupied">Percentage of Rooms Occupied Today: ${hotel.calculateTodayPercentOccupied()}%</p>
      </section>
      <section class="find-user">
        <input type="text" placeholder="Find Guest By Name" class="enter-user-name">
        <button type="button" role="button" class="submit-user-name">Find Guest</button>
      </section>
    </section>
    <section class="manager-create-booking">
      <h5>Found Guest Name</h5>
      <div class="date-selector">
        <p class="select-date-message-manager">Please choose the day (Guest Name) would like to stay with us:</p>
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
    <p class="avail-booking-title">All Available Rooms: </p>
    <section class="available-bookings-holder">
        <img class="room-image" src="https://images.unsplash.com/photo-1505773508401-e26ca9845131?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2940&q=80" alt="room-image">
        <div class="available-room-info">
          <p class="trip-date">Trip Date: 2020/06/24</p>
          <p class="room-type">Room Style: Residential Suite</p>
          <p class="room-number">Room Number: 1</p>
        </div>
        <button type="button" role="button" class="book-room-button">Book Room</button>
    </section>
    <p class="future-booking-title">Your Upcoming Bookings: </p>
    <section class="future-bookings-holder">
      <img class="room-image" src="https://images.unsplash.com/photo-1505773508401-e26ca9845131?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2940&q=80" alt="room-image">
      <div class="future-room-info">
        <p class="trip-date">Trip Date: 2020/06/24</p>
        <p class="room-type">Room Style: Residential Suite</p>
        <p class="room-number">Room Number: 1</p>
        <p class="confirmation-code">Confirmation Code: </p>
      </div>
    </section>
    <p class="past-booking-title">Your Past Bookings: </p>
    <section class="past-bookings-holder">
      <img class="room-image" src="https://images.unsplash.com/photo-1505773508401-e26ca9845131?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2940&q=80" alt="room-image">
      <div class="past-room-info">
        <p class="trip-date">Trip Date: 2020/06/24</p>
        <p class="room-type">Room Style: Residential Suite</p>
        <p class="room-number">Room Number: 1</p>
        <p class="confirmation-code">Confirmation Code: </p>
      </div>
    </section>
  </section>
  </section>
  </section>`);
}

const displayUserPage = () => {
  $('.login-page').html(`<section class="user-page">
    <h4 class="welcome-user">Welcome ${customer.name}</h4>
    <section class="create-booking">
      <div class="date-selector">
        <p class="total-spent">You have spent $500 in total at Overlook Hotel Paradise.</p>
        <p class="appreciation-message">We grately appreciate your business!</p>
        <p class="select-date-message">Please select the day you'd like to stay with us:</p>
        <div class="date-input-btn-holder">
          <input class="date-input" type="number" placeholder="YYYY/MM/DD">
          <button class="submit-date-button" type="button" role="button">Select Date</button>
        </div>
      </div>
      <div class="filter-hotel-rooms-dropdown-user">
        <button class="filter-button"type="button" role="button">Filter you room search <i class="fa fa-caret-down"></i></button>
        <div class="filter-content">
          <a href="#">Residential Suite</a>
          <a href="#">Suite</a>
          <a href="#">Junior Suite</a>
          <a href="#">Single Room</a>
        </div>
      </div>
      <p class="avail-booking-title-user">All Available Rooms: </p>
      <section class="available-bookings-holder">
        <img class="room-image" src="https://images.unsplash.com/photo-1505773508401-e26ca9845131?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2940&q=80" alt="room-image">
        <div class="available-room-info">
          <p class="trip-date">2020/06/24</p>
          <p class="room-type">Residential Suite</p>
          <p class="room-number">1</p>
        </div>
        <button type="button" role="button" class="book-room-button">Book Room</button>
      </section>
      <p class="future-booking-title-user">Your Upcoming Bookings: </p>
      <section class="future-bookings-holder">
        <img class="room-image" src="https://images.unsplash.com/photo-1505773508401-e26ca9845131?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2940&q=80" alt="room-image">
        <div class="future-room-info">
          <p class="trip-date">2020/06/24</p>
          <p class="room-type">Residential Suite</p>
          <p class="room-number">1</p>
          <p class="confirmation-code">Confirmation Code</p>
        </div>
      </section>
      <p class="past-booking-title-user">Your Past Bookings: </p>
      <section class="past-bookings-holder">
        <img class="room-image" src="https://images.unsplash.com/photo-1505773508401-e26ca9845131?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2940&q=80" alt="room-image">
        <div class="past-room-info">
          <p class="trip-date">2020/06/24</p>
          <p class="room-type">Residential Suite</p>
          <p class="room-number">1</p>
          <p class="confirmation-code">Confirmation Code</p>
        </div>
      </section>
    </section>
    </section>`);
}
