const knex = require("../database/knex")

class NotesController {
  
 async create(request, response) {
  const {title, description, movie_tags, rating  } = request.body;
  const user_id = request.user.id;

  const [movie_note_id] = await knex("movie_notes").insert({
    title, 
    description,
    rating,
    user_id
  });

  const movieTagsInsert = movie_tags.map(category => {
    return {
      category, 
      movie_note_id, 
      user_id
    }
  });
  
  await knex("movie_tags").insert(movieTagsInsert);


  return response.json()
 }

 //display something specific
 async show(request, response) {
  const { id } = request.params;

  const note = await knex("movie_notes").where({ id }).first();
  const tags = await knex("movie_tags").where({note_id: id}).orderBy("category")
  

  return response.json({
   ...note, 
   tags, 
  });

 }

 async delete(request, response) {
  const {id} = request.params

  await knex("movie_notes").where({ id }).delete();

  return response.json();
 }

 //list all
 async index(request, response) {
  const {title,  tags} = request.query;

  const user_id = request.user.id;

  let notes;

  if(tags) {
   const filterTags = tags.split(',').map(tag => tag.trim());

   notes = await knex("movie_tags")
    .select([
      "movie_notes.id",
      "movie_notes.title",
      "movie_notes.user_id",
    ]) 
   
   .where("movie_notes.user_id", user_id )
   .whereLike("movie_notes.title", `%${title}`)
   .whereIn("name", filterTags)
   .innerJoin("movie_notes", "movie_notes.id", "movie_tags.note_id")
   .orderBy("movie_notes.title")

  }else{

    notes = await knex("movie_notes")
     .where({user_id})
     .whereLike("title", `%${title}%`)
     .orderBy("title");
  }
   
   const userTags = await knex("movie_tags").where({user_id});
   const notesWithTags = notes.map( note => {
    const noteTags = userTags.filter(movie_tag => movie_tag.note_id === movie_note.id)

    return {
      ...note,
      tags: noteTags
    }
   });


  return response.json(notesWithTags);
 }
 
}

module.exports = NotesController;