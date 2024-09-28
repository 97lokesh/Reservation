import modelRestaurant from "../models/restaurant.js"


const getAllRestaurants = async function getAllRestaurants(req, res) {
  try {
    const data = await modelRestaurant.getAllRestaurants(req.query);
    res.send({ restaurants: data });
  } catch (err) {
    console.error(err);
    res.status(500).send({ errorMsg: err.message });
  }
}

const getRestaurant =  async function getRestaurant(req, res) {
  try {
    const data = await modelRestaurant.getRestaurantById(req.params.restId);
    if (data == "null") {
      res.send({message:"no restaurant data found"});
    } else {
      res.send({message:data});
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ errorMsg: err.message });
  }
}

const getRestaurantByOwnerId = async function getRestaurantByOwnerId(req, res) {
  try {
    const data = await modelRestaurant.getRestaurantByOwnerId(req.user.id);
    res.send({message:data});
  } catch (err) {
    console.error(err);
    res.status(500).send({ errorMsg: err.message });
  }
}

const createRestaurant = async function createRestaurant(req, res) {
  try {
    const data = await modelRestaurant.createRestaurant({
      ...req.body,
      owner: req.user.id,
    });
    res.send({message:data});
    // Always redirect after CUD data
    // To refactor to redirect to the restaurant listing we implement it
    // res.redirect('/restaurant/:restId');
  } catch (err) {
    console.error(err);
    res.status(500).send({ errorMsg: err.message });
  }
}

const editRestaurant = async function editRestaurant(req, res) {
  const restdata = await modelRestaurant.getRestaurantById(req.params.restId);
  if (!restdata.owner || restdata.owner != req.user.id) {
    return res.status(401).send({message:"Unauthorized"});
  } else {
    try {
      const data = await modelRestaurant.editRestaurant(
        req.params.restId,
        req.body
      );
      res.send(data);
    } catch (err) {
      console.error(err);
      res.status(500).send({ errorMsg: err.message });
    }
  }
}

const deleteRestaurant = async function deleteRestaurant(req, res) {
  const restdata = await modelRestaurant.getRestaurantById(req.params.restId);
  if (!restdata.owner || restdata.owner != req.user.id) {
    return res.status(401).send({message:"Unauthorized"});
  } else {
    try {
      await modelRestaurant.deleteRestaurant(req.params.restId);
      res.send({message:"data has been deleted."});
      // res.redirect('/');
    } catch (err) {
      console.error(err);
      res.status(500).send({ errorMsg: err.message });
    }
  }
}

export default {
    getAllRestaurants,
    getRestaurant,
    createRestaurant,
    editRestaurant,
    deleteRestaurant,
    getRestaurantByOwnerId
}