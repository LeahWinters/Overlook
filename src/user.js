import Hotel from './hotel';

class User {
  constructor (userId, guestName) {
    this.id = userId;
    this.name = guestName;
    this.pastTrips = [];
    this.upcomingTrips = [];
  }

  getAvailableRoomsByDate(hotel, date) {
    let availableRooms = [];
    const bookedRoomsOnSelectedDate = hotel.allCurrentBookings.filter(booking => {
      return booking.date === date;
    });
    const bookedRoomNums = bookedRoomsOnSelectedDate.map(room => {
      return room.roomNumber;
    });
    hotel.allRooms.forEach(room => {
      if(!bookedRoomNums.includes(room.number)) {
        availableRooms.push(room);
      }
    });
    return availableRooms;
  }
}

export default User;
