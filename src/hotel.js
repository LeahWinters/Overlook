class Hotel {
  constructor() {
    this.allRooms = [];
    this.allGuests = [];
    this.allCurrentBookings = [];
  }

  getNumOfRoomsAvailibleToday() {
    const date = new Date();
    const today = `${date.getFullYear()}/${date.getMonth+1}/${date.getDate}`;
    const todaysBookedRooms = this.allCurrentBookings.filter(booking => {
      return booking.date === today;
    });
    return this.allRooms.length - todaysBookedRooms.length;
  }


  filterRoomsByType() {

  }

  filterAvailableRoomsBySelectedDate() {

  }

  calculateTodaysRevenue() {
    const date = new Date();
    const today = `${date.getFullYear()}/${date.getMonth+1}/${date.getDate}`;
    const todaysBookedRooms = this.allCurrentBookings.filter(booking => {
      return booking.date === today;
    });
    return todaysBookedRooms.reduce((acc, room) => {
      acc += room.costPerNight;
      return acc;
    }, 0);
  }

  calculateTodayPercentOccupied() {
    const date = new Date();
    const today = `${date.getFullYear()}/${date.getMonth+1}/${date.getDate}`;
    const todaysBookedRooms = this.allCurrentBookings.filter(booking => {
      return booking.date === today;
    });
    console.log("today:",todaysBookedRooms.length);
    return todaysBookedRooms.length / this.allRooms.length;
  }
}


export default Hotel;
