// tutorial https://www.youtube.com/watch?v=Bk90lT6ne3g&ab_channel=TomBaranowicz

const fs = require('fs')
const SpotifyWebApi = require('spotify-web-api-node');
const token = "BQB9QDYdj33unPDxljSU6VUjSmLNTdkn5EtpVTu90FKOVXZdjk9PV97TXsypbPl8Zs-fxcqh392oWLmwf3WEPnJXysRcPGtRdbpdLA2Ifv9HMrn2wpofNx6U80cVFIvRFcobnOkO3_1XoUo_skLQhyKopWvu776WAwK4ubMvyYt9199WW2nisHjYCmtJE7kFr7U-paCo9ozIrVGsyGB1EmdCfabsztFKFuc0jAe-mWY75ExLSoT-V7576RXLF1zToEIjHEMiA892aJ9FtVaKjltLIbAs_LA110MuEeuXT2QLI2rQ";

const spotifyApi = new SpotifyWebApi();
spotifyApi.setAccessToken(token);

//GET MY PROFILE DATA
function getMyData() {
  (async () => {
    const me = await spotifyApi.getMe();
    // console.log(me.body);
    getUserPlaylists(me.body.id);
  })().catch(e => {
    console.error(e);
  });
}

//GET MY PLAYLISTS
async function getUserPlaylists(userName) {
  const data = await spotifyApi.getUserPlaylists(userName)

  console.log("---------------+++++++++++++++++++++++++")
  let playlists = []

  for (let playlist of data.body.items) {
    console.log(playlist.name + " " + playlist.id)
    
    let tracks = await getPlaylistTracks(playlist.id, playlist.name);
    // console.log(tracks);

    const tracksJSON = { tracks }
    let data = JSON.stringify(tracksJSON);
    fs.writeFileSync(playlist.name+'.json', data);
  }
}

//GET SONGS FROM PLAYLIST
async function getPlaylistTracks(playlistId, playlistName) {

  const data = await spotifyApi.getPlaylistTracks(playlistId, {
    offset: 1,
    limit: 100,
    fields: 'items'
  })

  // console.log('The playlist contains these tracks', data.body);
  // console.log('The playlist contains these tracks: ', data.body.items[0].track);
  // console.log("'" + playlistName + "'" + ' contains these tracks:');
  let tracks = [];

  for (let track_obj of data.body.items) {
    const track = track_obj.track
    tracks.push(track);
    console.log(track.name + " : " + track.artists[0].name)
  }
  
  console.log("---------------+++++++++++++++++++++++++")
  return tracks;
}

getMyData();