const express = require("express");
const app = express();
var SpotifyWebApi = require("spotify-web-api-node");

// credentials are optional
var spotifyApi = new SpotifyWebApi({
  clientId: "4f7b05200436458abd6643176b478862",
  clientSecret: "31daebc8c91745c4aafeae6c002a0b63",
  redirectUri: "http://localhost:8888/callback",
});

/**
 * main endpoint for localhost:8888
**/
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// scopes for node wrapper
var cors = require('cors');
app.use(cors());
const scopes = [
  "ugc-image-upload",
  "user-read-playback-state",
  "user-modify-playback-state",
  "user-read-currently-playing",
  "streaming",
  "app-remote-control",
  "user-read-email",
  "user-read-private",
  "playlist-read-collaborative",
  "playlist-modify-public",
  "playlist-read-private",
  "playlist-modify-private",
  "user-library-modify",
  "user-library-read",
  "user-top-read",
  "user-read-playback-position",
  "user-read-recently-played",
  "user-follow-read",
  "user-follow-modify",
];

/**
 * redirects to spotify login page which is /callback endpoint
**/

app.get("/login", (req, res) => {
  res.redirect(spotifyApi.createAuthorizeURL(scopes));
});

/**
 * spotify's login page.
 * automatically refreshes/set access token to extract userinfo
**/

app.get("/callback", (req, res) => {
  const error = req.query.error;
  const code = req.query.code;
  const state = req.query.state;

  if (error) {
    console.error("Callback Error:", error);
    res.send(`Callback Error: ${error}`);
    return;
  }

  spotifyApi
    .authorizationCodeGrant(code)
    .then((data) => {
      const access_token = data.body["access_token"];
      const refresh_token = data.body["refresh_token"];
      const expires_in = data.body["expires_in"];

      spotifyApi.setAccessToken(access_token);
      spotifyApi.setRefreshToken(refresh_token);

      console.log("access_token:", access_token);
      console.log("refresh_token:", refresh_token);

      console.log(
        `Sucessfully retreived access token. Expires in ${expires_in} s.`
      );
      res.redirect('http://localhost:3000/songs');

      setInterval(async () => {
        const data = await spotifyApi.refreshAccessToken();
        const access_token = data.body["access_token"];

        console.log("The access token has been refreshed!");
        console.log("access_token:", access_token);
        spotifyApi.setAccessToken(access_token);
      }, (expires_in / 2) * 1000);
    })
    .catch((error) => {
      console.error("Error getting Tokens:", error);
      res.redirect('http://localhost:8888/login');
    });
});

/**
 * returns userinfo
**/

app.get("/userinfo", async (req, res) => {
  try {
    var result = await spotifyApi.getMe();
    console.log(result.body);
    res.status(200).send(result.body);
  } catch (err) {
    res.status(400).send(err);
  }
});

/**
 * returns user's top playlists
**/

app.get("/playlists", async (req, res) => {
  try {
    var result = await spotifyApi.getUserPlaylists();
    console.log(result.body);
    res.status(200).send(result.body);
  } catch (err) {
    res.status(400).send(err);
  }
});

/**
 * return user's 25 test artists
**/

app.get("/artists", async(req, res) => {
  spotifyApi.getMyTopArtists({
    limit : 25
  })
  .then(function(data) {
    let topArtists = data.body.items;
    console.log(topArtists);
    return res.status(200).send(topArtists);
  }, function(err) {
    console.log('Something went wrong! artists', err);
    console.log('after redirect artist');
  })
});

/**
 * returns user's top tracks
**/

app.get("/toptracks", async(req, res) => {
  spotifyApi.getMyTopTracks({
    limit: 20
  })
  .then(function(data) {
    let topTracks = data.body.items;
    console.log(topTracks);
    return res.status(200).send(topTracks);
  }, function(err) {
    console.log('Something went wrong! tracks', err);
    return res.redirect('http://google.com');
  });
});

module.exports = app;