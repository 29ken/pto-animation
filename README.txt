Intake–Cascade PTO animation (PTO v4, Override Season V3)

Files
  index.html          the page
  pto-v4-mesh.txt     the CAD mesh (packed, base64); must sit next to index.html
  vendor/three/       three.js r160 (MIT licence), so the page works offline

Run it (the page has to be served over http; opening index.html directly as a file won't load the mesh)
  cd pto-animation
  python3 -m http.server 8000
  then open http://localhost:8000 in Chrome, Edge, Safari or Firefox

Fonts come from Google Fonts when online; offline the page falls back to system fonts.
