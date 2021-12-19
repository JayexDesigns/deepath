<h3 align="center"><img src='https://raw.githubusercontent.com/JayexDesigns/deepath/main/public/assets/logo2.png' width='15%'></h3>
<h1 align="center">Deepath</h1>
<p align="center">This is a simple social network with the intention of visualizing the user connections with D3js</p>
<br/>
<h2>Backend</h2>
<p>The backend is made in nodejs with electron and a websockets library, it creates a simple json database to store the users and users connections, the chat is not persistent against reboots of the server. The http server has two endpoints, the main endpoint is for the actual social media, the users login, chat and friends list, the network endpoint is for seeing the graph created by the users and its realtime update</p>
<br/>
<h2>Frontend</h2>
<p>The main application is entirely done with vanilla JavaScript, I thought of using React with Material UI but I didn't have the time to handle that. The network endpoint is created using D3.js and the force layout, a websocket connection updates the graph so its reconstructed every time something changes.</p>
<br/>
