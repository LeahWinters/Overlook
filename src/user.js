class User {
  constructor (userId, guestName) {
    this.id = userId;
    this.name = guestName;
    this.pastTrips = [];
    this.upcomingTrips = [];
  }

  selectRoomToBook() {

  }

  getRoomsAvailable() {

  }

  getTotalAmountSpentOnRooms() {

  }



  getFurtureBookings() {
      // if date is in the future, push to upcomingtrips
  }

}

export default User;
