'use strict'
const express = require('express');
const app = express();
const util = require('util');
const path = require('path');
const fs = require('fs');
const passport = require('passport');
const bodyParser = require('body-parser');
const session = require('express-session');
const dbHandler = require('./dbHandler.js');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true });
const Mustache = require('mustache');


const DEFAULT_HOWMANY = 10;
const TRUE_SECRET = "Node.js pije wode po pierogach!!!!!!oneonejedenjeden";

const pokemonListTemplate = require('../../templates/pokemon-templates.html.js').pokemonListTemplate;
const onePokemonTemplate = require('../../templates/pokemon-templates.html.js').onePokemonTemplate;

app.use(cookieParser(TRUE_SECRET));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(csrfProtection);
app.use(session({
    secret: TRUE_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true },
}));


app.get('/', (req, res) => {
  let view = {
    renderFull: true,
    pokemons: [
      {
        id: 443,
        name: 'bulbasaur',
        height: 443,
        weight: 145,
        dangerous: 'NIE'
      },
      {
        id: 997,
        name: 'pitbul',
        height: 31,
        weight: 44,
        dangerous: 'TAK'
      }
    ]
  };
  dbHandler.getPokemons((pokemons) => {
    pokemons.forEach((pokemon) => {
      //if (pokemon.id < 5) console.log(pokemon);
      pokemon.dangerous = 'NIE';
      if (pokemon.reports >= 4){
        pokemon.dangerous = 'TAK';
      }
      return pokemon;
    })
    view.pokemons = pokemons;

    let output = Mustache.render(pokemonListTemplate, view);
    res.send(output);
  });
});

app.get('/shallow', (req, res) => {
  let view = {
    renderFull: false,
    pokemons: [
      {
        id: 443,
        name: 'bulbasaur',
        height: 443,
        weight: 145,
        dangerous: 'NIE'
      },
      {
        id: 997,
        name: 'pitbul',
        height: 31,
        weight: 44,
        dangerous: 'TAK'
      }
    ]
  };
  dbHandler.getPokemons((pokemons) => {
    pokemons.forEach((pokemon) => {
      //if (pokemon.id < 5) console.log(pokemon);
      pokemon.dangerous = 'NIE';
      if (pokemon.reports >= 4){
        pokemon.dangerous = 'TAK';
      }
      return pokemon;
    })
    view.pokemons = pokemons

    let output = Mustache.render(pokemonListTemplate, view);
    res.send(output);
  });
});

app.get('/pokemon/:pokemonId', (req, res) => {
  let pokemonId = req.params.pokemonId;
  let view = {
    renderFull: true,
    csrfToken: req.csrfToken(),
    pokemon: {
      id: 443,
      name: 'bulbasaur',
      height: 443,
      weight: 145,
      dangerous: 'NIE'
    }
  };
  dbHandler.getOnePokemonWithTypes(pokemonId, (pokemon) => {
    view.pokemon = pokemon;
    let types = pokemon.types
    let effTypes = [];
    types.forEach(type => {
      effTypes.push(type.type);
    });
    view.pokemon.types = effTypes;


    view.pokemon.dangerous = 'niegroźny';
    if (view.pokemon.reports >= 4){
      view.pokemon.dangerous = 'groźny';
    }

    console.log(view.pokemon);

    let output = Mustache.render(onePokemonTemplate, view);
    res.send(output);
  });

});

app.get('/shallow/pokemon/:pokemonId', (req, res) => {
  let pokemonId = req.params.pokemonId;
  let view = {
    renderFull: false,
    csrfToken: req.csrfToken(),
    pokemon: {
      id: 443,
      name: 'bulbasaur',
      height: 443,
      weight: 145,
      dangerous: 'NIE'
    }
  };
  dbHandler.getOnePokemon(pokemonId, (pokemon) => {
    view.pokemon = pokemon;
    view.pokemon.dangerous = 'niegroźny';
    if (view.pokemon.reports >= 4){
      view.pokemon.dangerous = 'groźny';
    }

    console.log(view.pokemon);

    let output = Mustache.render(onePokemonTemplate, view);
    res.send(output);
  });

});

app.post('/report', (req, res) => {
  if (util.isNullOrUndefined(req.body.pokemon_id)){
    res.sendStatus(400);
    return;
  }
  let id = Number(req.body.pokemon_id);
  console.log(dbHandler.addReportSql(id));

  dbHandler.addReport(id, () => {
    res.redirect('/');
  })
});



app.set('port', process.env.PORT || 8080);
app.listen(Number(app.get('port')));
console.log('Listening on port' + Number(app.get('port')));
