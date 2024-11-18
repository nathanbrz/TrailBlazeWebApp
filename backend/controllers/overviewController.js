const Trip = require('../dbmodels/trip');
const User = require("../dbmodels/user");

// Total trips created
const totalTripsCreated = async (req, res) => {
  try {
    const totalTrips = await Trip.countDocuments();
    res.status(200).json({ totalTrips });
  } catch (error) {
    console.error("Error getting total trips:", error);
    res.status(500).json({ message: "Error getting total trips", error });
  }
};

// Average trip length
const averageTripLength = async (req, res) => {
    try {
      const result = await Trip.aggregate([
        {
          $group: {
            _id: null,
            averageLength: { $avg: "$total_duration" }
          }
        }
      ]);
      
      // If no trips exist, result will be an empty array, so return 0
      const averageLength = result.length ? result[0].averageLength : 0;
      
      res.status(200).json({ averageTripLength: averageLength });
    } catch (error) {
      res.status(500).json({ message: 'Error calculating average trip length', error });
    }
  };

// Most popular trip style
const mostPopularTripStyle = async (req, res) => {
    try {
      const result = await Trip.aggregate([
        { $group: { _id: "$trip_interest", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 1 }
      ]);
      const mostPopularStyle = result.length ? result[0]._id : "No styles found";
      res.status(200).json({ mostPopularTripStyle: mostPopularStyle });
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving most popular trip style', error });
    }
  };
  
  // Total users
  const totalUsers = async (req, res) => {
    try {
      const totalUserCount = await User.countDocuments();
      res.status(200).json({ totalUsers: totalUserCount });
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving total users', error });
    }
  };
  
  module.exports = {
    totalTripsCreated,
    averageTripLength,
    mostPopularTripStyle,
    totalUsers
  };