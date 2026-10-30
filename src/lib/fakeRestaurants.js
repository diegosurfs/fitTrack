
import {
  randomNumberBetween,
  getRandomDateAfter,
  getRandomDateBefore,
} from "@/src/lib/utils.js";

import { Timestamp } from "firebase/firestore";

export async function generateFakeRestaurantsAndReviews() {
  const workouts = [
    {
      name: "Upper Body Strength",
      category: "Strength Training",
      level: "Intermediate",
      duration: 45,
      photo: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=900&q=80",
    },
    {
      name: "Full Body Workout",
      category: "Full Body",
      level: "Beginner",
      duration: 30,
      photo: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=900&q=80",
    },
    {
      name: "Cardio and Endurance",
      category: "Cardio",
      level: "Beginner",
      duration: 25,
      photo: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=900&q=80",
    },
    {
      name: "Leg Day Challenge",
      category: "Strength Training",
      level: "Advanced",
      duration: 50,
      photo: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=900&q=80",
    },
    {
      name: "Core and Abs",
      category: "Core Training",
      level: "Intermediate",
      duration: 20,
      photo: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=900&q=80",
    },
    {
      name: "Weight Loss Cardio",
      category: "Weight Loss",
      level: "Beginner",
      duration: 35,
      photo: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=900&q=80",
    },
    {
      name: "Muscle Building",
      category: "Muscle Building",
      level: "Advanced",
      duration: 60,
      photo: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=900&q=80",
    },
    {
      name: "Functional Fitness",
      category: "Full Body",
      level: "Intermediate",
      duration: 40,
      photo: "https://images.unsplash.com/photo-1517963628607-235ccdd5476c?w=900&q=80",
    },
  ];

  const sampleReviews = [
    "Great workout! Easy to follow and challenging.",
    "This routine helped me stay consistent with training.",
    "Loved the exercise selection. Great overall workout.",
    "A good workout for building strength and endurance.",
    "The instructions were clear and easy to understand.",
    "I enjoyed this routine and would recommend it.",
  ];

  const data = [];

  for (const workout of workouts) {
    const workoutTimestamp = Timestamp.fromDate(getRandomDateBefore());
    const ratingsData = [];

    for (let j = 0; j < randomNumberBetween(2, 5); j++) {
      const ratingTimestamp = Timestamp.fromDate(
        getRandomDateAfter(workoutTimestamp.toDate())
      );

      ratingsData.push({
        rating: randomNumberBetween(3, 5),
        text: sampleReviews[
          randomNumberBetween(0, sampleReviews.length - 1)
        ],
        userId: `User #${randomNumberBetween(1000, 9999)}`,
        timestamp: ratingTimestamp,
      });
    }

    const totalRating = ratingsData.reduce(
      (sum, review) => sum + review.rating,
      0
    );

    const workoutData = {
      name: workout.name,
      category: workout.category,
      city: workout.level,
      duration: workout.duration,
      price: 1,
      photo: workout.photo,
      avgRating: totalRating / ratingsData.length,
      numRatings: ratingsData.length,
      sumRating: totalRating,
      timestamp: workoutTimestamp,
    };

    data.push({
      restaurantData: workoutData,
      ratingsData,
    });
  }

  return data;
}
