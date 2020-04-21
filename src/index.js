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
let user;
let date;

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

Promise.all([userData, roomData, bookingData])
  .then(data => {
    userData = data[0];
    roomData = data[1];
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
    return new User(user.id, user.name);
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
          'userID': booking.userID,
          'date': booking.date,
          'roomNumber': booking.roomNumber,
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

const createManager = () => {
  manager = new Manager();
}

const createUser = (id, name) => {
  user = new User(id, name);
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
    displayUserPage(user);
    bindUserEventListener();
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
    createUser(user.id, user.name);
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

const displayUserFutureBookings = (futureReservations) => {
  return futureReservations.map(bookingObj => {
    return `<section class="past-holder">
    <div class="image-holder"> <img class="room-image" src=${getCorrectRoomImage(bookingObj)}  alt="room-image"></div>
      <div class="future-room-info">
        <p class="trip-date">Trip Date: ${bookingObj.date}</p>
        <p class="room-type">Room Number: ${bookingObj.roomType}</p>
        <p class="room-number">Room Number: ${bookingObj.roomNumber}</p>
        <p class="confirmation-code">Confirmation Code: dsh839u4uhnwjdq8u23</p>
      </div>
      </section>`
  });
}

const displayUserPastBookings = (pastReservations) => {
  return pastReservations.map(bookingObj => {
    return `<section class="past-holder">
    <div class="image-holder"><img class="room-image" src=${getCorrectRoomImage(bookingObj)} alt="room-image"></div>
      <div class="past-room-info">
        <p class="trip-date">Trip Date: ${bookingObj.date}</p>
        <p class="room-type">Room Style: ${bookingObj.roomType}</p>
        <p class="room-number">Room Number: ${bookingObj.roomNumber}</p>
        <p class="confirmation-code">Confirmation Code: iohjdosijeoiwje29lkda</p>
      </div>
    </section>`
  });
}

const displayAvailableBookings = (user) => {
  if(event.target.classList.contains("submit-date-button")) {
    date = $('.date-input').val();
    let allAvailableRooms = user.getAvailableRoomsByDate(hotel, date);
    if (allAvailableRooms.length === 0) {
      $('.available-bookings-holder').html(`<p>We are sorry, but there are no rooms available on that date. Please try selecting another date!</p>`)
    } else {
      allAvailableRooms.forEach(room => {
        $('.available-bookings-holder').append(`<div class="avail-hotel-info"><img class="room-image" src=${getCorrectRoomImage(room)} alt="room-image">
        <div class="available-room-info">
          <p class="room-type">Room Style: ${room.roomType}</p>
          <p class="room-number">Room Number: ${room.number}</p>
          <p class="bed-size">Bed Size: ${room.bedSize}</p>
          <p class="num-beds">Number of Beds: ${room.numBeds}</p>
        </div>
          <button type="button" role="button" id="${room.number}" class="book-room-button">Book Room</button>
        </div>
        </section>`)
      });
    }
  }
}

const getFilterInputToDisplay = () => {
  let selectedFilterValue = $('.filter-button').val();
  date = $('.date-input').val();
  let roomType;
  if (selectedFilterValue === 'residential suite') {
    roomType = 'residential suite';
    displayFilteredAvailableBookings(user, roomType, date);
  } else if (selectedFilterValue === 'suite') {
    roomType = 'suite';
    displayFilteredAvailableBookings(user, roomType, date);
  } else if (selectedFilterValue === 'junior suite') {
    roomType = 'junior suite';
    displayFilteredAvailableBookings(user, roomType, date);
  } else if (selectedFilterValue === 'single room') {
    roomType = 'single room';
    displayFilteredAvailableBookings(user, roomType, date);
  }
}

const displayFilteredAvailableBookings = (user, roomType, date) => {
  $('.available-bookings-holder').empty();
  let allFilteredRooms = user.filterRoomsByType(roomType, hotel, date);
  if (allFilteredRooms.length === 0) {
    $('.available-bookings-holder').html(`<p>We are sorry to inform you that there are not any available bookings on the filter you selected. Please try another one!</p>`);
  } else {
    allFilteredRooms.forEach(room => {
      $('.available-bookings-holder').append(`<div class="avail-hotel-info"><img class="room-image" src=${getCorrectRoomImage(room)} alt="room-image">
      <div class="available-room-info">
        <p class="room-type">Room Style: ${room.roomType}</p>
        <p class="room-number">Room Number: ${room.number}</p>
        <p class="bed-size">Bed Size: ${room.bedSize}</p>
        <p class="num-beds">Number of Beds: ${room.numBeds}</p>
      </div>
        <button type="button" role="button" id="${room.number}" class="book-room-button">Book Room</button>
      </div>
      </section>`)
    });
  }
}

const selectRoomToBook = (event) => {
  let roomId = event.target.id;
  let roomMatch = hotel.allRooms.find(room => room.number == roomId);
  return roomMatch;
}

const prepRoomToBook = (event) => {
  let room = selectRoomToBook(event);
  let userIdNum = user.id;
  let roomNum = room.number;
  let roomToPost = {
    'userID': userIdNum,
    'date': date,
    'roomNumber': roomNum
  }
  return roomToPost;
}

const bookSelectedRoom = (event) => {
  let dataToPost = prepRoomToBook(event);
  fetch('https://fe-apps.herokuapp.com/api/v1/overlook/1904/bookings/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(
        dataToPost
      )
    })
    .then(response => response.json())
    .then(data => console.log('Success:', data))
    .catch(err => console.log('there has been an error with your post', error));
    displayReservationConfirmation(user, date);
}

const displayReservationConfirmation = (user, date) => {
  $('.available-bookings-holder').empty();
  $('.available-bookings-holder').html(`<p class="confirmation">Thank you ${user.name} for booking with us! Your trip is on ${date}!</p>`);
}


const bindUserEventListener = () => {
  $('.date-input-btn-holder').on('click', '.submit-date-button', null, function() {
    displayAvailableBookings(user);
  });
  $('.filter-button').on('change', function() {
    getFilterInputToDisplay();
  });
  $('.available-bookings-holder').on('click', function() {
    bookSelectedRoom(event);
  })
}

const displayManagerPage = () => {
  $('.login-page').html(`<section class='manager-page'>
    <h4 class="manager-name">Manager Name</h4>
    <section class="manager-info">
      <section class="hotel-data">
        <p class="rooms-avail-todays-date">Number of Rooms Available Today: ${hotel.getNumOfRoomsAvailibleToday()}</p>
        <p class="total-revenue-today">Total Revenue Today: $${hotel.calculateTodaysRevenue()}</p>
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
    <section class="available-bookings-holder-manager">
        <img class="room-image" src="https://images.unsplash.com/photo-1505773508401-e26ca9845131?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2940&q=80" alt="room-image">
        <div class="available-room-info">
          <p class="trip-date">Trip Date: 2020/06/24</p>
          <p class="room-type">Room Style: Residential Suite</p>
          <p class="room-number">Room Number: 1</p>
        </div>
        <button type="button" role="button" class="book-room-button">Book Room</button>
    </section>
    <p class="future-booking-title">Your Upcoming Bookings: </p>
    <section class="future-bookings-holder-manager">
      <img class="room-image" src="https://images.unsplash.com/photo-1505773508401-e26ca9845131?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2940&q=80" alt="room-image">
      <div class="future-room-info">
        <p class="trip-date">Trip Date: 2020/06/24</p>
        <p class="room-type">Room Style: Residential Suite</p>
        <p class="room-number">Room Number: 1</p>
        <p class="confirmation-code">Confirmation Code: </p>
      </div>
    </section>
    <p class="past-booking-title">Your Past Bookings: </p>
    <section class="past-bookings-holder-manager">
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

const displayUserPage = (user) => {
  let reservations = hotel.getUsersBookings(user.id);
  let upcomingReservations = displayUserFutureBookings(reservations.upcomingTrips);
  let pastReservations = displayUserPastBookings(reservations.pastTrips);
  $('.login-page').html(`<section class="user-page">
    <h4 class="welcome-user">Welcome ${user.name}</h4>
    <section class="create-booking">
      <div class="date-selector">
        <p class="total-spent">You have spent $${reservations.totalSpent} in total at Overlook Hotel Paradise.</p>
        <p class="appreciation-message">We grately appreciate your business!</p>
        <p class="select-date-message">Please select the day you'd like to stay with us:</p>
        <div class="date-input-btn-holder">
          <input class="date-input" type="text" placeholder="YYYY/MM/DD">
          <button class="submit-date-button" type="button" role="button">Select Date</button>
        </div>
      </div>
      <div class="filter-hotel-rooms-dropdown-user">
        <select value="Filter your room search" class="filter-button">
          <option value="filter by room type" disabled selected>Filter available rooms by room style</option>
          <option value="residential suite">Residential Suite</option>
          <option value="suite">Suite</option>
          <option value="junior suite">Junior Suite</option>
          <option value="single room">Single Room</option>
        </select>
      </div>
      <p class="avail-booking-title-user">All Available Rooms: </p>
      <section class="available-bookings-holder">
      </section>
      <p class="future-booking-title-user">Your Upcoming Bookings: </p>
      <section class="future-bookings-holder">
        ${upcomingReservations.join('')}
      </section>
      <p class="past-booking-title-user">Your Past Bookings: </p>
      <section class="past-bookings-holder">
        ${pastReservations.join('')}
      </section>
    </section>
    </section>`);
}

const getCorrectRoomImage = (roomObj) => {
  const roomType = roomObj.roomType;
  switch (roomType) {
  case 'residential suite':
    return 'https://images.unsplash.com/photo-1505773508401-e26ca9845131?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2940&q=80';
  case 'suite':
    return 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80';
  case 'single room':
    return 'https://images.unsplash.com/flagged/photo-1556438758-8d49568ce18e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1953&q=80';
  case 'junior suite':
    return 'https://images.unsplash.com/photo-1560067174-e553b3647603?ixlib=rb-1.2.1&auto=format&fit=crop&w=1867&q=80';
  default:
    return 'https://images.pexels.com/photos/279746/pexels-photo-279746.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260';
  }
}
