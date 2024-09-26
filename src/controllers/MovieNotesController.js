const knex = require("../database/knex");

class MovieNotesController {
    async create(request, response) {
        const { title, description, rating, movieTags} = request.body;
        const { user_id } = request.params;
        
        const [movieNote_id] = await knex("movieNotes").insert({
            title,
            description,
            rating,
            user_id
        });
        
    }

    async show(request, response) {
        const { id } = request.params;

        const movieNote = await knex("movieNotes").where({ id }).first();
        const movieTags = await knex("movieTags").where({ movieNote_id: id }).orderBy("name");
        
        return response.json({
            ...movieNote,
            movieTags
        });

    }

    async delete(request, response) {
     
        const { id } = request.params;
        await knex("MovieNotes").where({ id }).delete();

        return response.json();

    }

    async index(request, response) {
        const { title, user_id, movieTags } = request.query;

        let movieNotes;

        if (movieTags) {
            const filterMovieTags = movieTags.split(',').map(tag => tag.trim());

            movieNotes = await knex("movieTags")
                .select([
                    "movieNotes.id",
                    "movieNotes.title",
                    "movieNotes.user_id",
                    "movieNotes.rating",
                    "movieNotes.description",
                ])
                
            .where("movieNotes.user_id", user_id)  
            .whereLike("movieNotes.title", `%${ title }%`)    
            .whereIn("name", filterMovieTags)
            .innerJoin("movieNotes", "movieNotes.id", "movieTags.note_id")
        }
        else {
        
         notes = await knex("MovieNotes")
            .where({ user_id })
            .whereLike("title", `%${ title }%`)
            .orderBy("title");
        }
      

        const userMovieTags = await knex("movieTags").where({ user_id });
        const movieNotesWitchMovieTags = movieNotes.map(MovieNote => {
        const movieNoteMovieTags = userMovieTags.filter(tag => tag.movieNote_id === movieNote.id);

            return {
                ...movieNote,
                movieTags:movieNoteMovieTags
            }
        });
       
        return response.json(movieNotesWitchMovieTags);

    }
    


}
   
    module.exports = MovieNotesController
