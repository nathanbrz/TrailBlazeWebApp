import React from "react";
import PlanItem from "./PlanItem";

const trips = [
  {
    id: "plan123",
    title: "Vacation Plan to Hawaii",
    description: "A detailed itinerary for a 7-day vacation to the islands of Hawaii. Includes flights, accommodations, and planned activities like hiking, surfing, and sightseeing.",
    imageUrl: "/images/broken-image.png"
  },
  {
    id: "plan456",
    title: "European Adventure",
    description: "A 14-day journey across Europe, visiting major cities like Paris, Rome, and Berlin. Includes museum tours, local cuisine, and scenic train rides between destinations.",
    imageUrl: "/images/broken-image.png"
  },
  {
    id: "plan789",
    title: "Mountain Hiking Expedition",
    description: "An adventurous 5-day hiking trip through the Rocky Mountains. Includes camping, wildlife viewing, and visits to scenic lookouts.",
    imageUrl: "/images/broken-image.png"
  },
  {
    id: "plan101",
    title: "City Escape to New York",
    description: "A 3-day trip to New York City featuring Broadway shows, fine dining, and visits to iconic landmarks like Central Park and the Statue of Liberty.",
    imageUrl: "/images/broken-image.png"
  },
  {
    id: "plan112",
    title: "Beach Getaway in the Caribbean",
    description: "A relaxing 7-day beach vacation on a tropical island in the Caribbean. Includes all-inclusive resorts, snorkeling, and sunset cruises.",
    imageUrl: "/images/broken-image.png"
  },
  {
    id: "plan131",
    title: "Road Trip Along Route 66",
    description: "A classic 10-day American road trip along Route 66, covering famous pit stops and attractions like the Grand Canyon, roadside diners, and vintage motels.",
    imageUrl: "/images/broken-image.png"
  },
  {
    id: "plan142",
    title: "Cultural Exploration in Japan",
    description: "A 12-day journey exploring the cultural wonders of Japan. Includes visits to Tokyo, Kyoto, and Hiroshima, along with temple tours, sushi-making classes, and scenic gardens.",
    imageUrl: "/images/broken-image.png"
  }
];

export default function PlanListSection() {
  return (
    <section className="py-6">
      {trips.map((trip) => (
        <PlanItem
          key={trip.id}
          id={trip.id}
          title={trip.title}
          description={trip.description}
          imageUrl={trip.imageUrl}
        />
      ))}
    </section>
  );
}
