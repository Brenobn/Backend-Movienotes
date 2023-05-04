const {Router} = require("express");

const SessionsController = require("../controllers/SessionsCotroller")
const sessionsController = new SessionsController()

const sessionsRoutes = Router()
sessionsRoutes.post( "/", sessionsController.Create);

module.exports = sessionsRoutes;