import { expect } from 'chai';
import Hotel from '../src/hotel';
import User from '../src/user';

describe('User', () => {
  let hotel;
  let user1;
  let user2;
  let user3;
  let room1;
  let room2;
  let room3;
  let room4;
  let room5;
  let room6;
  let booking1;
  let booking2;
  let booking3;
  let booking4;
  let booking5;
  let booking6;

  beforeEach(() => {
    user1 = new User(1, 'Leatha Ullrich');

    user2 = new User(2, 'Rocio Schuster');

    user3 = new User(3, 'Kelvin Schiller');

    room1 = {
      "number": 1,
      "roomType": "residential suite",
      "bidet": true,
      "bedSize": "queen",
      "numBeds": 1,
      "costPerNight": 358.4
    }

    room2 = {
      "number": 2,
      "roomType": "suite",
      "bidet": false,
      "bedSize": "full",
      "numBeds": 2,
      "costPerNight": 477.38
    }

    room3 = {
      "number": 3,
      "roomType": "single room",
      "bidet": false,
      "bedSize": "king",
      "numBeds": 1,
      "costPerNight": 491.14
    }

    room4 = {
      "number": 4,
      "roomType":"single room",
      "bidet": false,
      "bedSize": "queen",
      "numBeds": 1,
      "costPerNight": 429.44
    }

    room5 = {
      "number": 5,
      "roomType": "single room",
      "bidet": true,
      "bedSize": "queen",
      "numBeds": 2,
      "costPerNight": 340.17
    }

    room6 = {
      "number": 6,
      "roomType": "junior suite",
      "bidet": true,
      "bedSize": "queen",
      "numBeds": 1,
      "costPerNight": 397.02
    }

    booking1 = {
      "id": "5fwrgu4i7k55hl6sz",
      "userID": 9,
      "date": "2020/02/04",
      "roomNumber": 1,
      "roomType": "residential suite",
      "bidet": true,
      "bedSize": "queen",
      "numBeds": 1,
      "costPerNight": 358.4,
      "roomServiceCharges": []
    }

    booking2 = {
      "id": "5fwrgu4i7k55hl6t5",
      "userID": 1,
      "date": "2020/04/20",
      "roomNumber": 2,
      "roomType": "suite",
      "bidet": false,
      "bedSize": "full",
      "numBeds": 2,
      "costPerNight": 477.38,
      "roomServiceCharges": []
    }

    booking3 = {
      "id": "5fwrgu4i7k55hl6t6",
      "userID": 1,
      "date": "2020/04/25",
      "roomNumber": 3,
      "roomType": "single room",
      "bidet": false,
      "bedSize": "king",
      "numBeds": 1,
      "costPerNight": 491.14,
      "roomServiceCharges": []
    }

    booking4 = {
      "id": "5fwrgu4i7k55hl6t7",
      "userID": 20,
      "date": "2020/02/16",
      "roomNumber": 4,
      "roomType":"single room",
      "bidet": false,
      "bedSize": "queen",
      "numBeds": 1,
      "costPerNight": 429.44,
      "roomServiceCharges": []
    }

    booking5 = {
      "id": "5fwrgu4i7k55hl6t8",
      "userID": 1,
      "date": "2020/02/05",
      "roomNumber": 5,
      "roomType": "single room",
      "bidet": true,
      "bedSize": "queen",
      "numBeds": 2,
      "costPerNight": 340.17,
      "roomServiceCharges": []
    }

    booking6 = {
      "id": "5fwrgu4i7k55hl6t9",
      "userID": 6,
      "date": "2020/02/14",
      "roomNumber": 14,
      "roomType": "junior suite",
      "bidet": true,
      "bedSize": "queen",
      "numBeds": 1,
      "costPerNight": 397.02,
      "roomServiceCharges": []
    }

    hotel = new Hotel();
    hotel.allUsers = [user1, user2, user3];
    hotel.allRooms.push(room1, room2, room3, room4, room5, room6);
    hotel.allCurrentBookings.push(booking1, booking2, booking3, booking4, booking5, booking6);
  });

  it('should be a function', () => {
    expect(User).to.be.a('function');
  });

  it('should have an id', () => {
    expect(user1.id).to.equal(1);
  });

  it('should have a name', () => {
    expect(user1.name).to.equal('Leatha Ullrich');
  });

  it('should be able to get all of their past trips', () => {
    hotel.getUsersBookings(1);
    expect(user1.pastTrips).to.deep.equal([booking5]);
  });

  it('should be able to get all of their upcoming trips', () => {
    hotel.getUsersBookings(1);
    expect(user1.upcomingTrips).to.deep.equal([booking2, booking3]);
  });

  it('should be able to get all available bookings based on an entered date', () => {
    expect(user1.getAvailableRoomsByDate(hotel, '2020/04/20')).to.deep.equal([{"number": 1,
    "roomType": "residential suite",
    "bidet": true,
    "bedSize": "queen",
    "numBeds": 1,
    "costPerNight": 358.4}, {
      "number": 3,
      "roomType": "single room",
      "bidet": false,
      "bedSize": "king",
      "numBeds": 1,
      "costPerNight": 491.14
    }, room4 = {
      "number": 4,
      "roomType":"single room",
      "bidet": false,
      "bedSize": "queen",
      "numBeds": 1,
      "costPerNight": 429.44
    }, {
      "number": 5,
      "roomType": "single room",
      "bidet": true,
      "bedSize": "queen",
      "numBeds": 2,
      "costPerNight": 340.17
    }, room6 = {
      "number": 6,
      "roomType": "junior suite",
      "bidet": true,
      "bedSize": "queen",
      "numBeds": 1,
      "costPerNight": 397.02
    }]);
  });
})
