
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import renderStars from "@/src/components/Stars.jsx";
import { getRestaurantsSnapshot } from "@/src/lib/firebase/firestore.js";
import Filters from "@/src/components/Filters.jsx";

const WorkoutItem = ({ restaurant }) => (
  <li>
    <Link href={`/restaurant/${restaurant.id}`}>
      <div>
        <div className="image-cover">
          <img src={restaurant.photo} alt={restaurant.name} />
        </div>

        <div className="restaurant__details">
          <h2>{restaurant.name}</h2>

          <div className="restaurant__rating">
            <ul>{renderStars(restaurant.avgRating)}</ul>
            <span>({restaurant.numRatings} reviews)</span>
          </div>

          <div className="restaurant__meta">
            <p>{restaurant.category} | {restaurant.city}</p>
            <p>{restaurant.duration} minutes</p>
          </div>
        </div>
      </div>
    </Link>
  </li>
);

export default function RestaurantListings({
  initialRestaurants,
  searchParams,
}) {
  const router = useRouter();

  const initialFilters = {
    city: searchParams.city || "",
    category: searchParams.category || "",
    price: searchParams.price || "",
    sort: searchParams.sort || "",
  };

  const [restaurants, setRestaurants] = useState(initialRestaurants);
  const [filters, setFilters] = useState(initialFilters);

  useEffect(() => {
    routerWithFilters(router, filters);
  }, [router, filters]);

  useEffect(() => {
    return getRestaurantsSnapshot((data) => {
      setRestaurants(data);
    }, filters);
  }, [filters]);

  return (
    <article>
      <header className="fittrack-header">
        <h1>FITTRACK</h1>
        <h2>Build Your Best Self.</h2>
        <p>Discover workouts. Build strength. Stay consistent.</p>
      </header>

      <h2>Explore Workouts</h2>

      <Filters filters={filters} setFilters={setFilters} />

      <ul className="restaurants">
        {restaurants.map((workout) => (
          <WorkoutItem key={workout.id} restaurant={workout} />
        ))}
      </ul>
    </article>
  );
}

function routerWithFilters(router, filters) {
  const queryParams = new URLSearchParams();

  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== "") {
      queryParams.append(key, value);
    }
  }

  const queryString = queryParams.toString();
  router.push(`?${queryString}`);
}
