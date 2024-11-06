// src/components/LandingPage/OverviewStats.js
import React, { useEffect, useState } from "react";
import { usePublicApi } from "../../hooks/usePublicApi";
import "../../../styles/global_styles.css";

const OverviewStats = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalTrips: null,
    averageTripLength: null,
    mostPopularTripStyle: null,
    totalUsers: null,
  });

  const [error, setError] = useState(null);

  // Fetch each stat using the useApi hook with corrected routes
  const {
    data: totalTripsData,
    loading: loadingTotalTrips,
    error: errorTotalTrips,
  } = usePublicApi("api/overview/totalTripsCreated", "GET");
  const {
    data: averageTripLengthData,
    loading: loadingAvgTrip,
    error: errorAvgTrip,
  } = usePublicApi("api/overview/averageTripLength", "GET");
  const {
    data: mostPopularTripStyleData,
    loading: loadingPopularStyle,
    error: errorPopularStyle,
  } = usePublicApi("api/overview/mostPopularTripStyle", "GET");
  const {
    data: totalUsersData,
    loading: loadingTotalUsers,
    error: errorTotalUsers,
  } = usePublicApi("api/overview/totalUsers", "GET");

  useEffect(() => {
    // Wait until all API responses are complete before updating the state
    if (
      !loadingTotalTrips &&
      !loadingAvgTrip &&
      !loadingPopularStyle &&
      !loadingTotalUsers
    ) {
      // Handle errors from any API call
      if (
        errorTotalTrips ||
        errorAvgTrip ||
        errorPopularStyle ||
        errorTotalUsers
      ) {
        setError("Error loading stats. Please try again later.");
        setLoading(false);
        return;
      }
      console.log("mostPopularTripStyleData:", mostPopularTripStyleData); // Debugging line


      // If no errors, update stats
      // Format averageTripLength to an integer with Math.round() and set stats
      setStats({
        totalTrips: totalTripsData?.totalTrips ?? "N/A",
        averageTripLength: averageTripLengthData?.averageTripLength
          ? Math.round(averageTripLengthData.averageTripLength)
          : "N/A",
        mostPopularTripStyle:
          mostPopularTripStyleData?.mostPopularTripStyle ?? "N/A",
        totalUsers: totalUsersData?.totalUsers ?? "N/A",
      });

      setError(null); // Clear any previous errors
      setLoading(false); // Stop loading
    }
  }, [
    loadingTotalTrips,
    loadingAvgTrip,
    loadingPopularStyle,
    loadingTotalUsers,
    errorTotalTrips,
    errorAvgTrip,
    errorPopularStyle,
    errorTotalUsers,
  ]);

  if (loading) {
    return <div>Loading overview stats...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
<section className="py-5 bg-light">
      <div className="container text-center">
        <h2 className="mb-4 text-4xl">Overview Statistics</h2>
        <p className="text-muted mb-5">Key insights into our platform</p>

        <div className="row justify-content-center">
          <div className="col-lg-4 col-md-6 mb-4">
            <div className="card h-100 shadow-sm stat-card">
              <div className="card-body">
                <h3 className="card-title fs-4">Total Trips Created</h3>
                <p className="card-text text-blaze">{stats.totalTrips}</p>
              </div>
            </div>
          </div>
          <div className="col-lg-4 col-md-6 mb-4">
            <div className="card h-100 shadow-sm stat-card">
              <div className="card-body">
                <h3 className="card-title fs-4">Average Trip Length</h3>
                <p className="card-text text-blaze">{stats.averageTripLength} days</p>
              </div>
            </div>
          </div>
          <div className="col-lg-4 col-md-6 mb-4">
            <div className="card h-100 shadow-sm stat-card">
              <div className="card-body">
                <h3 className="card-title fs-4">Most Popular Trip Style</h3>
                <p className="card-text text-blaze">{stats.mostPopularTripStyle}</p>
              </div>
            </div>
          </div>
          <div className="col-lg-4 col-md-6 mb-4">
            <div className="card h-100 shadow-sm stat-card">
              <div className="card-body">
                <h3 className="card-title fs-4">Total Users</h3>
                <p className="card-text text-blaze">{stats.totalUsers}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OverviewStats;
