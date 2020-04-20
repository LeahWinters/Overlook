class Hotel {
  constructor(users) {
    this.allRooms = [];
    this.allUsers = users;
    this.allCurrentBookings = [];
  }

  getNumOfRoomsAvailibleToday() {
    const date = new Date();
    const today = `${date.getFullYear()}/0${date.getMonth()+1}/${date.getDate()}`;
    const todaysBookedRooms = this.allCurrentBookings.filter(booking => {
      return booking.date === today;
    });
    return this.allRooms.length - todaysBookedRooms.length;
  }

  filterRoomsByType(roomType) {
    // 
  }

  filterAvailableRoomsBySelectedDate() {

  }

  calculateTodaysRevenue() {
    const date = new Date();
    const today = `${date.getFullYear()}/0${date.getMonth()+1}/${date.getDate()}`;
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
    const today = `${date.getFullYear()}/0${date.getMonth()+1}/${date.getDate()}`;
    const todaysBookedRooms = this.allCurrentBookings.filter(booking => {
      return booking.date === today;
    });
    return Math.ceil((todaysBookedRooms.length / this.allRooms.length) * 100);
  }

  getUsersBookings(id) {
    let totalSpent = 0;
    const user = this.allUsers.find(user => {
      return user.id === id
    });
    const date = new Date();
    const today = `${date.getFullYear()}/0${date.getMonth()+1}/${date.getDate()}`;
    const parsedToday = Date.parse(today);
    const userBookings = this.allCurrentBookings.filter(booking => booking.userID === id);
      userBookings.forEach(booking => {
        totalSpent += booking.costPerNight;
        if (parsedToday - Date.parse(booking.date) > 0) {
          user.pastTrips.push(booking)
        } else {
          user.upcomingTrips.push(booking);
        }
    });
    return {pastTrips: user.pastTrips, upcomingTrips: user.upcomingTrips, totalSpent: Math.round(totalSpent)};
  }
}


export default Hotel;
