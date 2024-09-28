import modelBooking from"../models/booking.js"
import modelRestaurant from"../models/restaurant.js"
import sendEmail from "../util/sendEmail.js"

const getAllByUserId = async function getAllByUserId(req, res) {
  const bookings = await modelBooking.getAllByUserId(req.user.id);
  res.send({message:bookings});
}
const getAllByRestaurantId = async function getAllByRestaurantId(req, res) {
  
  const restaurant = await modelRestaurant.getRestaurantByOwnerId(req.user.id);
  if (!restaurant) {
    return res.send([]);
  }

  if (restaurant.owner != req.user.id) {
    return res.status(401).send({message:"Unauthorized"});
  }

  if (req.query.startDateTime > req.query.endDateTime) {
    return res
      .status(400)
      .send({message:"startDateTime must be earlier than endDateTime"});
  }

  if (!req.query.startDateTime && !req.query.endDateTime) {
    const bookings = await modelBooking.getAllByRestaurantId(restaurant._id);
    return res.send({message:bookings});
  }

  const bookings = await modelBooking.filterAllByRestaurantId({
    startDateTime: req.query.startDateTime,
    endDateTime: req.query.endDateTime,
    id: restaurant._id,
  });
  res.send({message:bookings});
}
const getOneById = async function getOneById(req, res) {
  
  const user = req.user.id;
  const booking = await modelBooking.getOneById(req.params.id);
  if (booking.user != user) {
    return res.status(401).send({message:"Unauthorized"});
  }

  res.send(booking);
}


const createBooking = async function createBooking(req, res) {
  const user = req.user.id;
  let booking;
  const errors = [];

  try {
    
    const restaurant = await modelRestaurant.getRestaurantById(
      req.body.restaurant
    );
    if (!restaurant) return res.status(400).send({message:"no restaurant with such id"});

   
    const validationErrors = validateInput(req.body, restaurant);
    if (validationErrors) {
      return res.status(400).send({message:validationErrors});
    }

    
    booking = await modelBooking.createBooking({
      ...req.body,
      user,
    });
    res.status(201).send({message:booking});
  } catch (err) {
    res.status(500).send({ errorMsg: err.message });
  }

  try {
    await sendEmail({
      type: "reservationCompleted",
      payload: {
        userName: req.user.name,
        userEmail: req.user.email,
        pax: booking.pax,
        restaurant: booking.restaurant.name,
        dateTime: booking.dateTime,
      },
    });
  } catch (emailError) {
    console.error("Failed to send email:", emailError);
  }
}


const updateBooking = async function updateBooking(req, res) {
  const user = req.user.id;
  let updatedBooking;
  const errors = [];

  try {
    if (req.body.restaurant) {
      return res.status(400).send({message:"restaurant cannot be updated"});
    }

    
    const currBooking = await modelBooking.getOneById(req.params.id);
    if (currBooking.user != user) {
      return res.status(401).send({message:"Unauthorized"});
    }

    
    const restaurant = await modelRestaurant.getRestaurantById(
      currBooking.restaurant._id
    );
    const validationErrors = validateInput(req.body, restaurant);
    if (validationErrors) {
      return res.status(400).send({message:validationErrors});
    }

    
    updatedBooking = await modelBooking.updateBooking(req.params.id, req.body);
    res.status(200).send(updatedBooking);
  } catch (err) {
    res.status(500).send({ errorMsg: err.message });
  }

  try {
    await sendEmail({
      type: "reservationChanged",
      payload: {
        userName: req.user.name,
        userEmail: req.user.email,
        pax: updatedBooking.pax,
        restaurant: updatedBooking.restaurant.name,
        dateTime: updatedBooking.dateTime,
      },
    });
  } catch (emailError) {
    console.error("Failed to send email:", emailError);
  }
}


const deleteBooking = async function deleteBooking(req, res) {
  
  const user = req.user.id;
  const booking = await modelBooking.getOneById(req.params.id);
  if (booking.user != user) {
    return res.status(401).send({message:"Unauthorized"});
  }

  try {
    await modelBooking.deleteBooking(req.params.id);
    res.status(200).send({message:"booking deleted"});
  } catch (err) {
    res.status(500).send({ errorMsg: err.message });
  }

  try {
    await sendEmail({
      type: "reservationCancelled",
      payload: {
        userName: req.user.name,
        userEmail: req.user.email,
      },
    });
  } catch (emailError) {
    console.error("Failed to send email:", emailError);
  }
}

function validateInput(body, restaurant) {
  const errors = [];
  console.log(body.dateTime);

  // Pax
  if (body.pax > restaurant.maxPax) {
    errors.push("pax must be less than maxPax");
  }
  if (body.pax < 1) {
    errors.push("pax must be more than 0");
  }
  if (body.pax > 10) {
    errors.push("For large group, please contact the restaurant directly");
  }
  // DateTime
  if (body.dateTime < new Date()) {
    errors.push("dateTime must be in the future");
  }
  if (body.dateTime > new Date().setDate(new Date().getDate() + 14)) {
    errors.push("dateTime must be within 14 days");
  }
  const isInputDayClosed = dateTimeHandler.isInputDayClosed(
    restaurant.daysClose,
    body.dateTime
  );
  if (isInputDayClosed) {
    errors.push("restaurant is closed on this day");
  }
  const isInputTimeClosed = dateTimeHandler.isInputTimeClosed(
    body.dateTime,
    restaurant.timeOpen,
    restaurant.timeClose
  );
  if (isInputTimeClosed) {
    errors.push("restaurant is closed at this time");
  }

  if (errors.length > 0) {
    return errors;
  }
}

export default {
    getAllByUserId,
  getAllByRestaurantId,
  getOneById,
  createBooking,
  updateBooking,
  deleteBooking
}