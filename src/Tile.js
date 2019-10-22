import React from "react";

import "./css/tile.css";

function Tile(props) {
  let style = "";

  if (props.state === 0) style = "normal";
  if (props.state === 1) style = "wall";
  if (props.state === 2) style = "start";
  if (props.state === 3) style = "end";
  if (props.state === 6) style = "visited";
  if (props.state === 7) style = "path";
  if (props.state === 9) style = "visiting";

  return (
    <div
      onClick={() => props.changeState(props.i, props.j)}
      className={"tileBody" + " " + style}
    >
      {props.children}
    </div>
  );
}

export default Tile;
