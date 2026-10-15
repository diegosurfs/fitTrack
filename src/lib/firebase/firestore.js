import { generateFakeRestaurantsAndReviews } from "@/src/lib/fakeRestaurants.js"; // Imports the function that creates sample restaurant data.

// Imports the Firestore functions used to read, write, filter, and listen to database documents.
import {
  collection, // References a Firestore collection.
  onSnapshot, // Listens for real-time database changes.
  query, // Creates a Firestore query.
  getDocs, // Retrieves documents matching a query.
  doc, // References a Firestore document.
  getDoc, // Retrieves a single document.
  updateDoc, // Updates an existing document.
  orderBy, // Sorts query results.
  Timestamp, // Creates Firestore timestamps.
  runTransaction, // Runs an atomic database transaction.
  where, // Adds a filter to a query.
  addDoc, // Adds a document with an automatically generated ID.
} from "firebase/firestore"; // Imports the Firestore SDK.

// Imports the client-side Firestore database instance.
import { db as clientDb } from "@/src/lib/firebase/clientApp"; // Renames db to avoid conflicts with function parameters.

// Updates a restaurant document with its uploaded image URL.
export async function updateRestaurantImageReference(restaurantId, publicImageUrl) { // Defines the image reference update function.
  const restaurantRef = doc(clientDb, "restaurants", restaurantId); // Gets a reference to the restaurant document.
  await updateDoc(restaurantRef, { photo: publicImageUrl }); // Saves the public image URL in Firestore.
} // Ends the image reference update function.

// Updates a restaurant's rating totals and creates a review document.
const updateWithRating = async (transaction, docRef, newRatingDocument, review) => { // Defines the transaction helper.
  const restaurant = await transaction.get(docRef); // Retrieves the restaurant inside the transaction.
  if (!restaurant.exists()) { // Checks whether the restaurant exists.
    throw new Error("Restaurant not found."); // Stops the transaction if the restaurant does not exist.
  } // Ends the existence check.
  const data = restaurant.data(); // Reads the restaurant's existing data.
  const oldNumRatings = data.numRatings || 0; // Gets the existing rating count, defaulting to zero.
  const oldAvgRating = data.avgRating || 0; // Gets the existing average rating, defaulting to zero.
  const newNumRatings = oldNumRatings + 1; // Calculates the updated number of ratings.
  const newSumRating = oldAvgRating * oldNumRatings + Number(review.rating); // Calculates the combined rating total.
  const newAverage = newSumRating / newNumRatings; // Calculates the new average rating.
  transaction.update(docRef, { numRatings: newNumRatings, avgRating: newAverage }); // Updates the restaurant's rating statistics.
  transaction.set(newRatingDocument, { ...review, timestamp: Timestamp.now() }); // Creates the review with a Firestore timestamp.
}; // Ends the transaction helper.

// Adds a review to a restaurant and updates its rating statistics.
export async function addReviewToRestaurant(firestoreDb, restaurantId, review) { // Defines the review submission function.
  const restaurantRef = doc(firestoreDb, "restaurants", restaurantId); // References the restaurant being reviewed.
  const newRatingDocument = doc(collection(firestoreDb, "restaurants", restaurantId, "ratings")); // Creates a reference for a new review.
  return runTransaction(firestoreDb, async (transaction) => { // Starts an atomic transaction.
    await updateWithRating(transaction, restaurantRef, newRatingDocument, review); // Updates the restaurant and saves the review.
  }); // Ends and returns the transaction.
} // Ends the review submission function.

// Applies the selected category, city, price, and sorting filters.
function applyQueryFilters(q, { category, city, price, sort } = {}) { // Defines the query filtering helper.
  if (category) { // Checks whether a category was selected.
    q = query(q, where("category", "==", category)); // Filters restaurants by category.
  } // Ends the category filter.
  if (city) { // Checks whether a city was selected.
    q = query(q, where("city", "==", city)); // Filters restaurants by city.
  } // Ends the city filter.
  if (price) { // Checks whether a price level was selected.
    q = query(q, where("price", "==", Number(price))); // Filters restaurants by price level.
  } // Ends the price filter.
  if (sort === "Rating") { // Checks whether results should be sorted by rating.
    q = query(q, orderBy("avgRating", "desc")); // Shows higher-rated restaurants first.
  } else if (sort === "Reviews") { // Checks whether results should be sorted by review count.
    q = query(q, orderBy("numRatings", "desc")); // Shows restaurants with more reviews first.
  } else { // Uses the default sorting when no recognized sort is selected.
    q = query(q, orderBy("timestamp", "desc")); // Shows the most recently added restaurants first.
  } // Ends the sorting conditions.
  return q; // Returns the completed query.
} // Ends the query filtering helper.

// Retrieves restaurant documents that match the supplied filters.
export async function getRestaurants(firestoreDb = clientDb, filters = {}) { // Defines the restaurant retrieval function.
  const restaurantsQuery = applyQueryFilters(collection(firestoreDb, "restaurants"), filters); // Creates the filtered restaurant query.
  const results = await getDocs(restaurantsQuery); // Retrieves the matching restaurant documents.
  return results.docs.map((restaurantDoc) => ({ // Converts each document into a JavaScript object.
    id: restaurantDoc.id, // Includes the restaurant document ID.
    ...restaurantDoc.data(), // Includes the restaurant's stored fields.
    timestamp: restaurantDoc.data().timestamp?.toDate?.() ?? null, // Converts the timestamp safely into a JavaScript date.
  })); // Ends the mapping operation.
} // Ends the restaurant retrieval function.

// Listens for real-time updates to the filtered restaurant collection.
export function getRestaurantsSnapshot(cb, filters = {}) { // Defines the restaurant snapshot listener.
  const restaurantsQuery = applyQueryFilters(collection(clientDb, "restaurants"), filters); // Creates the filtered query.
  return onSnapshot(restaurantsQuery, (querySnapshot) => { // Subscribes to changes in the query results.
    const results = querySnapshot.docs.map((restaurantDoc) => ({ // Converts each document into an object.
      id: restaurantDoc.id, // Includes the restaurant ID.
      ...restaurantDoc.data(), // Includes the restaurant data.
      timestamp: restaurantDoc.data().timestamp?.toDate?.() ?? null, // Converts the timestamp to a JavaScript date when available.
    })); // Ends the mapping operation.
    cb(results); // Sends the updated restaurants to the callback.
  }); // Returns the listener so callers can unsubscribe.
} // Ends the restaurant snapshot function.

// Retrieves a single restaurant by its document ID.
export async function getRestaurantById(firestoreDb, restaurantId) { // Defines the single restaurant retrieval function.
  if (!restaurantId) { // Checks whether a restaurant ID was provided.
    console.log("Error: Invalid ID received: ", restaurantId); // Logs the invalid ID.
    return; // Stops when the ID is missing.
  } // Ends the ID check.
  const docRef = doc(firestoreDb, "restaurants", restaurantId); // References the restaurant document.
  const docSnap = await getDoc(docRef); // Retrieves the document.
  if (!docSnap.exists()) { // Checks whether the document exists.
    return null; // Returns null if the restaurant cannot be found.
  } // Ends the existence check.
  const data = docSnap.data(); // Reads the restaurant data.
  return { ...data, timestamp: data.timestamp?.toDate?.() ?? null }; // Returns the restaurant data with a converted timestamp.
} // Ends the restaurant retrieval function.

// Listens for real-time changes to one restaurant.
export function getRestaurantSnapshotById(restaurantId, cb) { // Defines the individual restaurant listener.
  if (!restaurantId) { // Checks whether a restaurant ID was provided.
    console.log("Error: Invalid ID received: ", restaurantId); // Logs the invalid ID.
    return () => {}; // Returns a harmless cleanup function.
  } // Ends the ID check.
  const docRef = doc(clientDb, "restaurants", restaurantId); // References the restaurant document.
  return onSnapshot(docRef, (docSnap) => { // Listens for document updates.
    if (docSnap.exists()) { // Checks whether the document exists.
      const data = docSnap.data(); // Reads the updated restaurant data.
      cb({ ...data, timestamp: data.timestamp?.toDate?.() ?? null }); // Sends the updated data to the callback.
    } // Ends the existence check.
  }); // Returns the listener for cleanup.
} // Ends the individual restaurant listener.

// Retrieves all reviews for a restaurant.
export async function getReviewsByRestaurantId(firestoreDb, restaurantId) { // Defines the review retrieval function.
  if (!restaurantId) { // Checks whether a restaurant ID was provided.
    console.log("Error: Invalid restaurantId received: ", restaurantId); // Logs the invalid ID.
    return []; // Returns an empty array when the ID is missing.
  } // Ends the ID check.
  const q = query( // Creates the reviews query.
    collection(firestoreDb, "restaurants", restaurantId, "ratings"), // References the restaurant's ratings subcollection.
    orderBy("timestamp", "desc") // Sorts reviews from newest to oldest.
  ); // Ends the query.
  const results = await getDocs(q); // Retrieves the reviews.
  return results.docs.map((reviewDoc) => ({ // Converts each review document into an object.
    id: reviewDoc.id, // Includes the review ID.
    ...reviewDoc.data(), // Includes the review fields.
    timestamp: reviewDoc.data().timestamp?.toDate?.() ?? null, // Converts the timestamp when available.
  })); // Returns the mapped reviews.
} // Ends the review retrieval function.

// Listens for real-time changes to a restaurant's reviews.
export function getReviewsSnapshotByRestaurantId(restaurantId, cb) { // Defines the review snapshot listener.
  if (!restaurantId) { // Checks whether a restaurant ID was provided.
    console.log("Error: Invalid restaurantId received: ", restaurantId); // Logs the invalid ID.
    return () => {}; // Returns a harmless cleanup function.
  } // Ends the ID check.
  const q = query( // Creates the review query.
    collection(clientDb, "restaurants", restaurantId, "ratings"), // References the restaurant's ratings subcollection.
    orderBy("timestamp", "desc") // Sorts reviews from newest to oldest.
  ); // Ends the query.
  return onSnapshot(q, (querySnapshot) => { // Listens for changes to the reviews.
    const results = querySnapshot.docs.map((reviewDoc) => ({ // Converts each review document into an object.
      id: reviewDoc.id, // Includes the review ID.
      ...reviewDoc.data(), // Includes the review fields.
      timestamp: reviewDoc.data().timestamp?.toDate?.() ?? null, // Converts the timestamp when available.
    })); // Ends the mapping operation.
    cb(results); // Passes the updated reviews to the callback.
  }); // Returns the listener for cleanup.
} // Ends the review snapshot function.

// Adds sample restaurants and reviews to Firestore.
export async function addFakeRestaurantsAndReviews() { // Defines the sample data function.
  const data = await generateFakeRestaurantsAndReviews(); // Generates sample restaurant and review data.
  for (const { restaurantData, ratingsData } of data) { // Iterates over each restaurant and its reviews.
    try { // Starts error handling for each restaurant.
      const docRef = await addDoc(collection(clientDb, "restaurants"), restaurantData); // Creates the restaurant document.
      for (const ratingData of ratingsData) { // Iterates over the restaurant's sample reviews.
        await addDoc(collection(clientDb, "restaurants", docRef.id, "ratings"), ratingData); // Adds each review to its ratings subcollection.
      } // Ends the review loop.
    } catch (e) { // Handles errors while adding sample data.
      console.log("There was an error adding the document"); // Logs a general error message.
      console.error("Error adding document: ", e); // Logs the specific error details.
    } // Ends the error handler.
  } // Ends the restaurant loop.
} // Ends the sample data function.