import React, { useState } from "react";

import Tile from "./Tile";

import "./css/App.css";

const App = () => {
  let matriceInit = [];

  let open = [];
  let closed = [];
  let start = { x: 2, y: 1, f: 0, g: 0 };
  let goal = { x: 8, y: 8, f: 0, g: 0 };
  let neighbours;
  let path;

  for (let i = 0; i <= 10; i++) matriceInit[i] = [];
  for (let i = 0; i < 10; i++)
    for (let j = 0; j < 10; j++) matriceInit[i][j] = 0;

  //spawn la peretii initiali
  for (let i = 0; i < 10; i++) matriceInit[9][i] = 1;
  for (let i = 0; i < 10; i++) matriceInit[i][9] = 1;
  for (let i = 0; i < 10; i++) matriceInit[0][i] = 1;
  for (let i = 0; i < 10; i++) matriceInit[i][0] = 1;

  matriceInit[start.x][start.y] = 2;
  matriceInit[goal.x][goal.y] = 3;

  //matricea legata la UI
  const [matrice, setMatrice] = useState([...matriceInit]);

  //functia de gasire a vecinilor
  function findNeighbour(arr, n) {
    var a;
    for (var i = 0; i < arr.length; i++) {
      a = arr[i];
      if (n.x === a.x && n.y === a.y) return i;
    }
    return -1;
  }

  //adaugare vecini
  function addNeighbours(current) {
    var p;
    for (var i = 0; i < neighbours.length; i++) {
      var n = {
        x: current.x + neighbours[i].x,
        y: current.y + neighbours[i].y,
        g: 0,
        h: 0,
        parent: { x: current.x, y: current.y }
      };

      if (matrice[n.x][n.y] === 1 || findNeighbour(closed, n) > -1) continue;
      n.g = current.g + neighbours[i].c;
      n.h = Math.abs(goal.x - n.x) + Math.abs(goal.y - n.y);
      p = findNeighbour(open, n);
      if (p > -1 && open[p].g + open[p].h <= n.g + n.h) continue;
      open.push(n);
    }

    //gasim nodul cu h-ul ce mai mic
    open.sort((a, b) => {
      return a.g + a.h - (b.g + b.h);
    });
  }

  function createPath() {
    path = [];
    var a, b;
    a = closed.pop();
    path.push(a);
    while (closed.length) {
      b = closed.pop();
      if (b.x !== a.parent.x || b.y !== a.parent.y) continue;
      a = b;
      path.push(a);
    }
  }

  function solve() {
    drawAnimate();

    //Cand lista de noduri posibile -open- este goala => imposibil de ajuns la goal
    if (open.length < 1) {
      alert("Nu se poate ajunge la goal!");

      return;
    }
    var current = open.splice(0, 1)[0]; //nodul current este primul element din lista open
    closed.push(current); //adaugam nodul curent in closed pentru ca a fost vizitat

    //daca nodul current este GOAL-ul, algortimul se opreste si creeaza cel mai scurt path
    if (current.x === goal.x && current.y === goal.y) {
      createPath();
      drawAnimate();
      return;
    }
    addNeighbours(current);
    requestAnimationFrame(solve);
  }
  function drawAnimate() {
    var a;
    let newMatrice = matrice;

    if (path.length) {
      for (var i = path.length - 1; i > -1; i--) {
        a = path[i];

        //desenam path-ul final cu galben
        if (newMatrice[a.x][a.y] !== 2 && newMatrice[a.x][a.y] !== 3)
          newMatrice[a.x][a.y] = 7;
      }

      setMatrice([...newMatrice]);

      return;
    }
    for (var i = 0; i < open.length; i++) {
      //a este element in lista open, aflam coordonatele si il desenam cu mov deschis
      a = open[i];
      let newMatrice = matrice;
      if (newMatrice[a.x][a.y] !== 2 && newMatrice[a.x][a.y] !== 3)
        newMatrice[a.x][a.y] = 6;
      setMatrice([...newMatrice]);
    }
    for (var i = 0; i < closed.length; i++) {
      //a este element in lista closed, aflam coordonatele si il desenam cu mov inchis
      a = closed[i];
      let newMatrice = matrice;
      if (newMatrice[a.x][a.y] !== 2 && newMatrice[a.x][a.y] !== 3)
        newMatrice[a.x][a.y] = 9;
      setMatrice([...newMatrice]);
    }
  }

  function aStar() {
    setMatrice([...matriceInit]);
    neighbours = [
      //vecini
      { x: 1, y: 0, c: 1 },
      { x: -1, y: 0, c: 1 },
      { x: 0, y: 1, c: 1 },
      { x: 0, y: -1, c: 1 },
      //pentru diagonala
      { x: 1, y: 1, c: 1.4 },
      { x: 1, y: -1, c: 1.4 },
      { x: -1, y: 1, c: 1.4 },
      { x: -1, y: -1, c: 1.4 }
    ];
    path = [];

    //adaugam primul nod (start) in lista open
    open.push(start);

    solve();
  }

  //prin aceasta functie putem adauga / sterge pereti
  function changeState(i, j) {
    let newMatrice = matrice;

    if (newMatrice[i][j] !== 2 && newMatrice[i][j] !== 3)
      if (newMatrice[i][j] === 1) newMatrice[i][j] = 0;
      else newMatrice[i][j] = 1;

    setMatrice([...newMatrice]);

    console.log(matrice[i][j]);
  }

  //desenam grid-ul
  function renderGrid() {
    return matrice.map((row, i) => (
      <div className="row" key={i}>
        {row.map((col, j) => (
          <Tile
            state={matrice[i][j]}
            i={i}
            j={j}
            changeState={changeState}
            onClick={() => console.log(i + " " + j)}
            key={j}
          ></Tile>
        ))}
      </div>
    ));
  }

  const legendaList = [
    [0, "Empty state"],
    [1, "Blocaj"],
    [2, "Start"],
    [3, "Final"],
    [6, "Cale posibila"],
    [9, "Cale inchisa"],
    [7, "Cale success"]
  ];

  function renderLegenda() {
    return legendaList.map((item, i) => {
      return (
        <li key={i}>
          <div className="legendBoi">
            <Tile state={item[0]}></Tile>
            <p>{item[1]}</p>
          </div>
        </li>
      );
    });
  }

  //functia de creat UI-ul
  return (
    <div className="App">
      <div className="legenda">
        <ul>{renderLegenda()}</ul>
      </div>

      <div className="gridBody">{renderGrid()}</div>
      <div className="buttonStart" onClick={() => aStar()}>
        <p>Start</p>
      </div>
    </div>
  );
};

export default App;
