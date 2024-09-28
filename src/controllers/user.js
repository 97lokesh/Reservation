import modelUsers from "../models/user.js"

const getUsers = async function getUsers(req, res) {
  try {
    const userData = await modelUsers.getUsers(req.query);
    res.send({ users: userData });
  } catch (err) {
    res.status(500).send({ errorMsg: err.message });
  }
}

const getLoginDetails = async function getLoginDetails(req, res) {
  try {
    const loginDetails = await modelUsers.getLoginDetails(req.query);
    if (loginDetails.success != true) {
      res.status(400).send({ errorMsg: loginDetails.error });
      return;
    }
    res.send(loginDetails.data);
  } catch (err) {
    res.status(500).send({ errorMsg: err.message });
  }
}

const loginUser =async function loginUser(req, res) {
  try {
    const token = await modelUsers.loginUser(req.body);
    console.log(token);
    if (!token.success) {
      res.status(400).send({ errorMsg: token.error });
      return;
    }
    res.send(token.data);
  } catch (err) {
    res.status(500).send({ errorMsg: err.message });
  }
}

const createUser = async function createUser(req, res) {
  try {
    const userData = await modelUsers.createUser(req.body);
    console.log(userData);
    if (!userData.success) {
      res.status(400).send({ errorMsg: userData.error });
      return;
    }
    res.send(userData);
  } catch (err) {
    console.log(err);
    res.status(500).send({ errorMsg: err.message });
  }
}

const logoutUser = async function logoutUser(req, res) {
  try {
    const result = await modelUsers.logoutUser(req.body);
    if (!result.success) {
      res.status(400).send({ errorMsg: result.error });
      return;
    }
    res.send(result);
  } catch (err) {
    console.log(err);
    res.status(500).send({ errorMsg: err.message });
  }
}


export default {
    getUsers,
    getLoginDetails,
    loginUser,
    logoutUser,
    createUser,
  };