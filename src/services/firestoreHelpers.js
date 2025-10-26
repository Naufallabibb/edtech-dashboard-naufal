import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from './firebase';

const convertTimestamp = (timestamp) => {
  if (timestamp && timestamp.toDate) {
    return timestamp.toDate().toISOString();
  }
  return timestamp;
};

const serializeDoc = (doc) => {
  const data = doc.data();
  return {
    id: doc.id,
    ...data,
    createdAt: convertTimestamp(data.createdAt),
    updatedAt: convertTimestamp(data.updatedAt)
  };
};

// ============================================
// TUTORS CRUD OPERATIONS
// ============================================

export const tutorsCollection = collection(db, 'tutors');

// Create Tutor
export const createTutor = async (tutorData) => {
  try {
    const docRef = await addDoc(tutorsCollection, {
      ...tutorData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      status: tutorData.status || 'active'
    });
    
    // Return with current timestamp as ISO string
    return { 
      id: docRef.id, 
      ...tutorData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error creating tutor:', error);
    throw error;
  }
};

// Get All Tutors
export const getAllTutors = async () => {
  try {
    const querySnapshot = await getDocs(tutorsCollection);
    return querySnapshot.docs.map(doc => serializeDoc(doc));
  } catch (error) {
    console.error('Error getting tutors:', error);
    throw error;
  }
};

// Get Active Tutors Only
export const getActiveTutors = async () => {
  try {
    const q = query(
      tutorsCollection, 
      where('status', '==', 'active')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => serializeDoc(doc));
  } catch (error) {
    console.error('Error getting active tutors:', error);
    throw error;
  }
};

// Get Tutor by ID
export const getTutorById = async (id) => {
  try {
    const docRef = doc(db, 'tutors', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return serializeDoc(docSnap);
    }
    return null;
  } catch (error) {
    console.error('Error getting tutor:', error);
    throw error;
  }
};

// Update Tutor
export const updateTutor = async (id, tutorData) => {
  try {
    const docRef = doc(db, 'tutors', id);
    await updateDoc(docRef, {
      ...tutorData,
      updatedAt: serverTimestamp()
    });
    return { 
      id, 
      ...tutorData,
      updatedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error updating tutor:', error);
    throw error;
  }
};

// Delete Tutor
export const deleteTutor = async (id) => {
  try {
    const docRef = doc(db, 'tutors', id);
    await deleteDoc(docRef);
    return id;
  } catch (error) {
    console.error('Error deleting tutor:', error);
    throw error;
  }
};

// ============================================
// BOOKINGS CRUD OPERATIONS
// ============================================

export const bookingsCollection = collection(db, 'bookings');

// Create Booking
export const createBooking = async (bookingData) => {
  try {
    // Validate that tutor exists
    if (bookingData.tutorId) {
      const tutorExists = await getTutorById(bookingData.tutorId);
      if (!tutorExists) {
        throw new Error('Tutor tidak ditemukan');
      }
    }

    const docRef = await addDoc(bookingsCollection, {
      ...bookingData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      status: bookingData.status || 'scheduled'
    });
    
    // Return with current timestamp as ISO string
    return { 
      id: docRef.id, 
      ...bookingData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
};

// Get All Bookings
export const getAllBookings = async () => {
  try {
    const querySnapshot = await getDocs(bookingsCollection);
    return querySnapshot.docs.map(doc => serializeDoc(doc));
  } catch (error) {
    console.error('Error getting bookings:', error);
    throw error;
  }
};

// Get Booking by ID
export const getBookingById = async (id) => {
  try {
    const docRef = doc(db, 'bookings', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return serializeDoc(docSnap);
    }
    return null;
  } catch (error) {
    console.error('Error getting booking:', error);
    throw error;
  }
};

// Update Booking
export const updateBooking = async (id, bookingData) => {
  try {
    const docRef = doc(db, 'bookings', id);
    await updateDoc(docRef, {
      ...bookingData,
      updatedAt: serverTimestamp()
    });
    return { 
      id, 
      ...bookingData,
      updatedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error updating booking:', error);
    throw error;
  }
};

// Delete Booking
export const deleteBooking = async (id) => {
  try {
    const docRef = doc(db, 'bookings', id);
    await deleteDoc(docRef);
    return id;
  } catch (error) {
    console.error('Error deleting booking:', error);
    throw error;
  }
};

// Get Upcoming Bookings (next 3 days)
export const getUpcomingBookings = async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const threeDaysLater = new Date();
    threeDaysLater.setDate(today.getDate() + 3);
    threeDaysLater.setHours(23, 59, 59, 999);
    
    const todayStr = today.toISOString().split('T')[0];
    const threeDaysStr = threeDaysLater.toISOString().split('T')[0];
    
    const q = query(
      bookingsCollection,
      where('status', '==', 'scheduled')
    );
    const querySnapshot = await getDocs(q);
    
    const bookings = querySnapshot.docs.map(doc => serializeDoc(doc));
    
    // Filter and sort in JavaScript
    return bookings
      .filter(booking => booking.date >= todayStr && booking.date <= threeDaysStr)
      .sort((a, b) => {
        if (a.date === b.date) {
          return a.startTime.localeCompare(b.startTime);
        }
        return a.date.localeCompare(b.date);
      });
  } catch (error) {
    console.error('Error getting upcoming bookings:', error);
    throw error;
  }
};

// Get Bookings by Status
export const getBookingsByStatus = async (status) => {
  try {
    const q = query(
      bookingsCollection, 
      where('status', '==', status)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => serializeDoc(doc));
  } catch (error) {
    console.error('Error getting bookings by status:', error);
    throw error;
  }
};

// Get Bookings by Tutor ID
export const getBookingsByTutor = async (tutorId) => {
  try {
    const q = query(
      bookingsCollection,
      where('tutorId', '==', tutorId)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => serializeDoc(doc));
  } catch (error) {
    console.error('Error getting bookings by tutor:', error);
    throw error;
  }
};

// Check if tutor has bookings (before deletion)
export const checkTutorHasBookings = async (tutorId) => {
  try {
    const bookings = await getBookingsByTutor(tutorId);
    return bookings.length > 0;
  } catch (error) {
    console.error('Error checking tutor bookings:', error);
    throw error;
  }
};

// Get Weekly Bookings Data (last 7 days)
export const getWeeklyBookingsData = async () => {
  try {
    // Get all bookings first
    const querySnapshot = await getDocs(bookingsCollection);
    const allBookings = querySnapshot.docs.map(doc => serializeDoc(doc));
    
    // If no bookings, return empty 7 days with 0 bookings
    if (allBookings.length === 0) {
      const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
      const today = new Date();
      const weeklyData = [];
      
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const dayName = dayNames[date.getDay()];
        weeklyData.push({
          day: dayName,
          date: date.toISOString().split('T')[0],
          bookings: 0
        });
      }
      return weeklyData;
    }
    
    // Find the most recent booking date to use as reference
    const bookingDates = allBookings
      .map(b => {
        if (!b.date) return null;
        return b.date.substring(0, 10);
      })
      .filter(d => d !== null)
      .sort((a, b) => b.localeCompare(a));
    
    // Use the most recent booking date as reference
    const mostRecentDate = bookingDates.length > 0 ? bookingDates[0] : new Date().toISOString().split('T')[0];
    const referenceDate = new Date(mostRecentDate + 'T12:00:00Z');
    
    // Get 6 days before the reference date (to include reference date = 7 days total)
    const sixDaysAgo = new Date(referenceDate);
    sixDaysAgo.setDate(referenceDate.getDate() - 6);
    
    const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
    const weeklyData = [];
    
    // Generate data for each of the 7 days
    for (let i = 6; i >= 0; i--) {
      const date = new Date(referenceDate);
      date.setDate(referenceDate.getDate() - i);
      
      const dateStr = date.toISOString().split('T')[0];
      const dayName = dayNames[date.getDay()];
      
      // Count bookings for this specific date (regardless of status)
      const count = allBookings.filter(b => {
        if (!b.date) return false;
        const bookingDateStr = b.date.substring(0, 10);
        return bookingDateStr === dateStr;
      }).length;
      
      weeklyData.push({
        day: dayName,
        date: dateStr,
        bookings: count
      });
    }
    
    return weeklyData;
  } catch (error) {
    console.error('Error getting weekly bookings data:', error);
    throw error;
  }
};

// Get Bookings Statistics
export const getBookingsStatistics = async () => {
  try {
    const querySnapshot = await getDocs(bookingsCollection);
    const allBookings = querySnapshot.docs.map(doc => serializeDoc(doc));
    
    const scheduled = allBookings.filter(b => b.status === 'scheduled').length;
    const completed = allBookings.filter(b => b.status === 'completed').length;
    const cancelled = allBookings.filter(b => b.status === 'cancelled').length;
    
    return {
      total: allBookings.length,
      scheduled,
      completed,
      cancelled
    };
  } catch (error) {
    console.error('Error getting bookings statistics:', error);
    throw error;
  }
};