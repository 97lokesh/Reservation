
import daoRestaurant from "../daos/restaurant.js"

const getAllRestaurants = function getAllRestaurants(query) {
  return daoRestaurant.find(query);
}

const getRestaurantById = async function getRestaurantById(param) {
  const data = await daoRestaurant.findOne({ _id: param });
  return data;
}

const getRestaurantByOwnerId = async function getRestaurantByOwnerId(param) {
  const data = await daoRestaurant.findOne({ owner: param });
  return data;
}

function createRestaurant(body) {
  return daoRestaurant.create(body);
}

const editRestaurant = async function editRestaurant(param, body) {
  const data = await daoRestaurant.findOneAndUpdate({ _id: param }, body, {
    new: true, 
  });
  return data;
}

const deleteRestaurant = async function deleteRestaurant(param) {
  const data = await daoRestaurant.findOne({ _id: param });
  return daoRestaurant.deleteOne(data);
}
export default {
    getAllRestaurants,
    getRestaurantById,
    createRestaurant,
    editRestaurant,
    deleteRestaurant,
    getRestaurantByOwnerId
}
