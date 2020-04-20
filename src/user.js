class User {
  constructor (userId, guestName) {
    this.id = userId;
    this.name = guestName;
    this.pastTrips = [];
    this.upcomingTrips = [];
  }

  selectRoomToBook() {

  }

  getAvailableRoomsByDate(date, rooms, bookings) {
    // assign a filter through the bookings to find only ones for the date thats passed in
    // chain map over the filter to get back just the room Number
    // make new var (roomsAva?) with another filter over each rooms
    // conditional => if bookedroomsnum do not include the roomnumber,
    // then return that room (this checks if that room is avail.)
    // return rooms avail. outside the chain.
  }

  // dom part => when user puts in a date, use jquery to save the input value as a var, and then you used that var to pass in to the method in the user class. which was saved into a var to mao over to display all rooms avail. on dom.

  getTotalAmountSpentOnRooms() {

  }



  getFurtureBookings() {
      // if date is in the future, push to upcomingtrips
  }

}

export default User;
