const { Router } = require("express");
const usersRoutes = require("./users.routes.js");
const MovieNotesRoutes = require("./MovieNotes.routes");
const MovieTagsRoutes = require("./MovieTags.routes");


const routes = Router();
routes.use("/users", usersRoutes);
routes.use("/MovieNotes", MovieNotesRoutes);
routes.use("/MovieTags", MovieTagsRoutes);

module.exports = routes;
