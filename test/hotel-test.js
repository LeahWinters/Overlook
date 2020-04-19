import { expect } from 'chai';
import Hotel from '../src/hotel';
import User from '../src/user';

describe('Hotel', () => {
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
    user1 = new User({
      'id': 1,
      'name': 'Leatha Ullrich'
    });

    user2 = new User({
      'id': 2,
      'name': 'Rocio Schuster'
    });

    user3 = new User({
      'id': 3,
      'name': 'Kelvin Schiller'
    });

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
      "roomNumber": 15,
      "roomServiceCharges": []
    }

    booking2 = {
      "id": "5fwrgu4i7k55hl6t5",
      "userID": 43,
      "date": "2020/01/24",
      "roomNumber": 24,
      "roomServiceCharges": []
    }

    booking3 = {
      "id": "5fwrgu4i7k55hl6t6",
      "userID": 13,
      "date": "2020/01/10",
      "roomNumber": 12,
      "roomServiceCharges": []
    }

    booking4 = {
      "id": "5fwrgu4i7k55hl6t7",
      "userID": 20,
      "date": "2020/02/16",
      "roomNumber": 7,
      "roomServiceCharges": []
    }

    booking5 = {
      "id": "5fwrgu4i7k55hl6t8",
      "userID": 1,
      "date": "2020/02/05",
      "roomNumber": 12,
      "roomServiceCharges": []
    }

    booking6 = {
      "id": "5fwrgu4i7k55hl6t9",
      "userID": 38,
      "date": "2020/02/14",
      "roomNumber": 14,
      "roomServiceCharges": []
    }

    hotel = new Hotel();
    hotel.allUsers = [user1, user2, user3];
    hotel.allRooms.push(room1, room2, room3, room4, room5, room6);
    hotel.allCurrentBookings.push(booking1, booking2, booking3, booking4, booking5, booking6);
  });

  it('should be a function', () => {
    expect(Hotel).to.be.a('function');
  });

  it('should have an array of all the users', () => {
    expect(hotel.allUsers).to.deep.equal([user1, user2, user3]);
  });

  it('should have an array of all the rooms in the hotel', () => {
    expect(hotel.allRooms).to.deep.equal([room1, room2, room3, room4, room5, room6]);
  });

  it('should have an array of all the bookings made at the hotel', () => {
    expect(hotel.allCurrentBookings).to.deep.equal([booking1, booking2, booking3, booking4, booking5, booking6]);
  });

  // it('should be able to get the number ot rooms that are available on todays date', () => {
  //
  // });

  // it('should be able to calculate the total revenue from today', () => {
  //
  // });

  // it('should be able to calculatethe percentage of rooms occupied today', () => {
  //
  // });

  // it('should be able to get a specific users past bookings', () => {
  //
  // });

  // it('should be able to get a specific users future bookings', () => {
  //
  // });

})
