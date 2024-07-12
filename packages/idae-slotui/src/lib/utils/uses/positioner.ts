interface Positioner {
  disabled?: false;
  position: "center" | "cascade" | "overlap" | undefined;
  siblings?: string
}
// center, cascade, overlap
export const positioner = (node: Element, opts: Positioner) => {

  const wBody = document.body.getBoundingClientRect();
  const wElement = node.getBoundingClientRect();

  let top, left;
  switch (opts.position) {
    case "center":
      top = (document.body.clientHeight / 2) - (wElement.height / 2);
      left = (wBody.width / 2) - (wElement.width / 2);
      break;
    case "cascade":
      top = (document.body.clientHeight / 2) - (wElement.height / 2);
      left = (wBody.width / 2) - (wElement.width / 2);
      break;
  }


  node.style.top= top+'px'
  node.style.left= left+'px'
};
