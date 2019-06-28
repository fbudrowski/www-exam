'use strict';

Date.prototype.getUnixTime = function() { return this.getTime()/1000|0 };

const sqlite3 = require('sqlite3').verbose();
const DB_PATH = 'baza.db';

const getPokemonsSql = () => {
  let limitTime = new Date(Date.now());
  limitTime.setHours(limitTime.getHours() - 1);
  let bounded = limitTime.getUnixTime();
  return `
  SELECT id, name, height, weight, COUNT(*) AS reports
  FROM pokemon JOIN pokemon_dangerous
  ON id=pokemon_id AND (time > ${bounded} OR time = 0)
  GROUP BY id;`
};

const getOnePokemonSql = (id) => {
  let limitTime = new Date(Date.now());
  limitTime.setHours(limitTime.getHours() - 1);
  let bounded = limitTime.getUnixTime();
  return `
  SELECT id, name, height, weight, COUNT(*) AS reports
  FROM pokemon JOIN pokemon_dangerous
  ON id = ${id} AND id = pokemon_id AND (time > ${bounded} OR time = 0)`;
};

const getPokemonTypesSql = (id) => {return `
  SELECT type_id AS type, slot
  FROM pokemon_types
  WHERE pokemon_id = ${id};`;
};

const addReportSql = (id) => {
  let now = new Date(Date.now()).getUnixTime();
//  console.log(`Pokemon ${id}, time ${now}`)
  return `
  INSERT INTO pokemon_dangerous VALUES (
    ${id},
    ${now}
  );`
}
const checkIfReportedSql = (id) => {
  let limitTime = new Date(Date.now());
  limitTime.setHours(limitTime.getHours() - 1);
  let bounded = limitTime.getUnixTime();
  return `
    SELECT COUNT(*)
    FROM pokemon_dangerous
    WHERE pokemon_id = ${id}
    AND time > ${bounded};`
}


function getPokemons(callback) {
  let db = new sqlite3.Database(DB_PATH);
  db.all(getPokemonsSql(), (err, rows) => {
    if (err) {
      console.log(err);
      throw err;
    }
    callback(rows);
  });
  db.close();
}

function getOnePokemon(id, callback) {
  let db = new sqlite3.Database(DB_PATH);
  db.get(getOnePokemonSql(id), (err, row) => {
    if (err) {
      console.log(err);
      throw err;
    }
    callback(row);
  });
  db.close();
}


function getOnePokemonWithTypes(id, callback) {
  let db = new sqlite3.Database(DB_PATH);
  db.get(getOnePokemonSql(id), (err, pokemon) => {
    if (err) {
      console.log(err);
      throw err;
    }
    db.all(getPokemonTypesSql(id), (err, types) => {
      if (err) {
        console.log(err);
        throw err;
      }
      pokemon.types = types;
      //console.log("Retrieved pokemon ", pokemon);
      callback(pokemon);
    })
  });
  db.close();
}

function addReport(id, callback){
  let db = new sqlite3.Database(DB_PATH);
  db.run(addReportSql(id), [], (err) => {
    if (err) {
      console.log(err);
      throw err;
    }
    callback();
  });
}

module.exports = {
  getPokemons: getPokemons,
  getOnePokemon: getOnePokemon,
  getOnePokemonWithTypes: getOnePokemonWithTypes,
  addReportSql: addReportSql,
  addReport: addReport
};
