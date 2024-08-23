const { Router } = require("express");
const usersRoutes = require("./users.routes.js");
const MovieNotesRoutes = require("./movieNotes.routes.js");
const MovieTagsRoutes = require("./movieTags.routes.js");


const routes = Router();
routes.use("/users", usersRoutes);
routes.use("/MovieNotes", MovieNotesRoutes);
routes.use("/MovieTags", MovieTagsRoutes);

module.exports = routes;
