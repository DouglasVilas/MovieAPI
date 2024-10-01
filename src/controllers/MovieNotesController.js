const knex = require("../database/knex");

class MovieNotesController {
    async create(request, response) {
        const { title, description, rating, movieTags } = request.body;
        const { user_id } = request.params;

        
        let ratingValido = 0;
        if (typeof rating === 'number' && rating >= 0 && rating <= 10) {
            ratingValido = rating;
        } else {
            return response.status(400).json({ error: 'A nota deve ser um número entre 0 e 10.' }); 
        }

        const [movieNote_id] = await knex("movieNotes").insert({
            title,
            description,
            rating: ratingValido, 
            user_id
        });

        if (movieTags && movieTags.length > 0) {
            const movieTagsInsert = movieTags.map(name => {
                return {
                    movieNote_id,
                    name,
                    user_id
                };
            });
            await knex("movieTags").insert(movieTagsInsert);
        }

        return response.status(201).json({ message: "Nota de filme criada com sucesso!" });
    }

    async show(request, response) {
        const { id } = request.params;

        const movieNote = await knex("movieNotes").where({ id }).first();
        const movieTags = await knex("movieTags").where({ movieNote_id: id }).orderBy("name");

        if (!movieNote) {
            return response.status(404).json({ error: "Nota de filme não encontrada." });
        }
        
        return response.json({
            ...movieNote,
            movieTags
        });
    }

    async delete(request, response) {
        const { id } = request.params;
        const movieNote = await knex("movieNotes").where({ id }).first();

        if (!movieNote) {
            return response.status(404).json({ error: "Nota de filme não encontrada." });
        }

        await knex("movieNotes").where({ id }).delete();
        return response.json({ message: "Nota de filme deletada com sucesso!" });
    }

    async index(request, response) {
        const { title, user_id, movieTags } = request.query;

        let movieNotes;

        if (movieTags) {
            const filterMovieTags = movieTags.split(',').map(movieTag => movieTag.trim());

            movieNotes = await knex("movieTags")
                .select([
                    "movieNotes.id",
                    "movieNotes.title",
                    "movieNotes.user_id",
                    "movieNotes.rating",
                    "movieNotes.description",
                ])
                .where("movieNotes.user_id", user_id)
                .whereLike("movieNotes.title", `%${title}%`)
                .whereIn("name", filterMovieTags)
                .innerJoin("movieNotes", "movieNotes.id", "movieTags.movieNote_id");
        } else {
            movieNotes = await knex("movieNotes")
                .where({ user_id })
                .whereLike("title", `%${title}%`)
                .orderBy("title");
        }

        const userMovieTags = await knex("movieTags").where({ user_id });
        const movieNotesWithMovieTags = movieNotes.map(movieNote => {
            const movieNoteMovieTags = userMovieTags.filter(movieTag => movieTag.movieNote_id === movieNote.id);

            return {
                ...movieNote,
                movieTags: movieNoteMovieTags
            };
        });

        return response.json(movieNotesWithMovieTags);
    }
}

module.exports = MovieNotesController;
