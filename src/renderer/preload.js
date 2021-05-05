console.log(process)
const sources = [];

if (process.env.NODE_ENV === "development") {
  // Dynamically insert the DLL script in development env in the
  // renderer process
  // Dynamically insert the bundled app script in the renderer process
  const port = process.env.PORT || 1212;
  sources.push(`http://localhost:${port}/dist/main.js`);
} else {
  sources.push("../dist/renderer.prod.js");
}

window.addEventListener('DOMContentLoaded', () => {

  if (sources.length) {

    for (let i = 0; i < sources.length; i++) {
      const scriptNode = document.createElement('script')
      const src = sources[i];
      scriptNode.src = src
      document.body.appendChild(scriptNode);

    }

  }
})

