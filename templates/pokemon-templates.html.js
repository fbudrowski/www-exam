const pokemonListString = `<!DOCTYPE html>
<html lang="pl">
  <head>
    <title>Lista pokemonów</title>
    <meta charset="UTF-8">
  </head>
  <body>
    <header id='naglowek'>
      {{#renderFull}}
      Pokémon - nazwa serii gier konsolowych firmy Nintendo, tworzonych od 1996 przez Satoshiego Tajiri.
      {{/renderFull}}
      {{^renderFull}}
      Pokémon
      {{/renderFull}}
    </header>
    <section id='typy'>
      Każdy pokémon posiada typ, który określa moce i możliwości, jakie posiada, określając w ten sposób jego dalszy rozwój i ewolucję. Istnieją pokémony posiadające dwa typy. W sumie istnieje osiemnaście typów:
      <ul>
        <li>baśniowe (fairy) </li>
        <li>duchowe (ghost), </li>
        <li>elektryczne (electric), </li>
        <li>kamienne (rock), </li>
        <li>latające (flying), </li>
        <li>lodowe (ice), </li>
        <li>mroczne (dark), </li>
        <li>normalne (normal), </li>
        <li>ogniste (fire), </li>
        <li>psychiczne (psychic), </li>
        <li>robacze (bug), </li>
        <li>smocze (dragon), </li>
        <li>stalowe (steel), </li>
        <li>trawiaste (grass), </li>
        <li>trujące (poison), </li>
        <li>walczące (fighting), </li>
        <li>wodne (water),</li>
        <li>ziemne (ground).</li>
      </ul>
    </section>
    <table id='tabelka'>
      <tr>
        <th onclick="sortTable(0)">Nazwa</th>
        <th onclick="sortTable(1)">Wzrost</th>
        <th onclick="sortTable(2)">Waga</th>
        <th onclick="sortTable(3)">Groźny</th></tr>
      {{#pokemons}}
      <tr><td><a href="{{^renderFull}}shallow/{{/renderFull}}pokemon/{{id}}">{{name}}</a></td><td>{{height}}</td><td>{{weight}}</td><td>{{dangerous}}</td></tr>
      {{/pokemons}}
    </table>


    <footer id='stopka'>
      {{#renderFull}}
      Pokémon – japoński serial anime tworzony od 1997 roku. W Japonii odcinki
      dzielą się na sześć serii: Pokémon, Pokémon: Advanced Generation,
      Pokémon: Diamond &amp; Pearl, Pokémon: Best Wishes!, Pokémon: XY i Pokémon
      Sun &amp; Moon, jednak wszędzie poza nią stosowany jest podział na 21
      sezonów.
      {{/renderFull}}
      {{^renderFull}}
      Pokémon
      {{/renderFull}}
    </footer>
    <script>
      // Skopiowane z https://stackoverflow.com/questions/14267781/sorting-html-table-with-javascript
      const getCellValue = (tr, idx) => tr.children[idx].innerText || tr.children[idx].textContent;

      const comparer = (idx, asc) => (a, b) => ((v1, v2) =>
          v1 !== '' && v2 !== '' && !isNaN(v1) && !isNaN(v2) ? v1 - v2 : v1.toString().localeCompare(v2)
          )(getCellValue(asc ? a : b, idx), getCellValue(asc ? b : a, idx));

      // do the work...
      document.querySelectorAll('th').forEach(th => th.addEventListener('click', (() => {
          const table = th.closest('table');
          Array.from(table.querySelectorAll('tr:nth-child(n+2)'))
              .sort(comparer(Array.from(th.parentNode.children).indexOf(th), this.asc = !this.asc))
              .forEach(tr => table.appendChild(tr) );
      })));
    </script>
  </body>




</html>

`;

const onePokemonString = `
<!DOCTYPE html>
<html lang="pl">
  <head>
    <title>Pokemon {{pokemon.name}}</title>
    <meta charset="UTF-8">
  </head>
  <body>
    <header id='naglowek'>
      {{#renderFull}}
      Pokémon - nazwa serii gier konsolowych firmy Nintendo, tworzonych od 1996 przez Satoshiego Tajiri.
      {{/renderFull}}
      {{^renderFull}}
      Pokémon
      {{/renderFull}}
    </header>
    <dl>
      <dt>Nazwa</dt><dd>{{pokemon.name}}</dd>
      <dt>Waga</dt><dd>{{pokemon.weight}}</dd>
      <dt>Wzrost</dt><dd>{{pokemon.height}}</dd>
      {{#renderFull}}
        <dt>Typy</dt><dd>{{pokemon.types}}</dd>
      {{/renderFull}}
    </dl>
    <b>{{pokemon.dangerous}}</b>
    <a href="../">Wróc</a>
    <form method="POST" action="/report">
      <input type="hidden" name="_csrf" value="{{csrfToken}}">\
      <input type="hidden" name="pokemon_id" value="{{pokemon.id}}">

      <button type="submit">Zgłoś zagrożenie</button>
    </form>
    <div id='stopka'>
      {{#renderFull}}
      Pokémon – japoński serial anime tworzony od 1997 roku. W Japonii odcinki
      dzielą się na sześć serii: Pokémon, Pokémon: Advanced Generation,
      Pokémon: Diamond &amp; Pearl, Pokémon: Best Wishes!, Pokémon: XY i Pokémon
      Sun &amp; Moon, jednak wszędzie poza nią stosowany jest podział na 21
      sezonów.
      {{/renderFull}}
      {{^renderFull}}
      Pokémon
      {{/renderFull}}
    </div>
  </body>
</html>

`

module.exports = {
  pokemonListTemplate: pokemonListString,
  onePokemonTemplate: onePokemonString
}
