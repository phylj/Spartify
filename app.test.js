
const request = require("supertest");
const app = require("spotify-app/app.js");
var SpotifyWebApi = require("spotify-web-api-node");
var spotifyApi = new SpotifyWebApi({
  clientId: "6d9e1a481bd04b2182636a6c3cd67c61",
  clientSecret: "3fe4af1de6d742bd88b57b511f00ee1d",
  redirectUri: "http://localhost:8888/callback",
});

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

it("Testing to see if Jest works", () => {
  expect(1).toBe(1);
});

describe("Test the root path", () => {
  test("It should response the GET method", () => {
    return request(app).get("/").expect(200);
  });
});


describe("Test the /login path", () => {
  test("It correctly redirects to callback", async () => {
    const response = await request(app).get("/login");
    expect(response.headers.location).toContain('/callback')
    expect(response.status).toBe(302);
  });
});

describe('sign-up process', () => {
  test('can load oauth demo site', async () => {
    const response = await request(app).get("/callback");
    expect(response.status).toBe(200);
  })});


describe("Test the /userinfo path", () => {
  test("It should response 200 to the GET method after login", async () => {
    spotifyApi.setAccessToken("BQBHVaeImP7AFDB7--jpzvGeP9n3j-gVzprVJfUJoIHZuQWz_0S3PHjlO-nifbd0ywrUKSSBmb1zuTWwVvIES_lYv5O-UH7b9jOu83_3EinrN2TCZd0qYmPfeFtRYMVsy5LBD1PrAiJcnMOnYYhRgEYR3OWE6KTHJ1pkwT5IMyPFuIaLK44bOPvosl3-c1xstF5HCXckAzPjofHpV3_YuMq-jT_CrqGX3gaND4gRCRlYL3dL5Mkd3wDU4exG2iBuQ0aVDvMe2o7Iw5OC-kg8PTGbEwzE6662d26d6AGj8e5jJrb6");
    var result = await spotifyApi.getMe();
    expect(result.body).toStrictEqual({
      "country": 'US',
      "display_name": 'silveryyt',
      "email": 'grace103001@gmail.com',
      "explicit_content": { filter_enabled: false, filter_locked: false },
      "external_urls": {
        "spotify": 'https://open.spotify.com/user/vaixkobk06qp3x4i65gh2fjq1'
      },
      "followers": { href: null, total: 0 },
      "href": 'https://api.spotify.com/v1/users/vaixkobk06qp3x4i65gh2fjq1',
      "id": 'vaixkobk06qp3x4i65gh2fjq1',
      "images": [],
      "product": 'open',
      "type": 'user',
      "uri": 'spotify:user:vaixkobk06qp3x4i65gh2fjq1'
    })
  });
});


describe("Test the /recentlyplayed path", () => {
  test("It should response 200", async () => {
    spotifyApi.setAccessToken("BQBHVaeImP7AFDB7--jpzvGeP9n3j-gVzprVJfUJoIHZuQWz_0S3PHjlO-nifbd0ywrUKSSBmb1zuTWwVvIES_lYv5O-UH7b9jOu83_3EinrN2TCZd0qYmPfeFtRYMVsy5LBD1PrAiJcnMOnYYhRgEYR3OWE6KTHJ1pkwT5IMyPFuIaLK44bOPvosl3-c1xstF5HCXckAzPjofHpV3_YuMq-jT_CrqGX3gaND4gRCRlYL3dL5Mkd3wDU4exG2iBuQ0aVDvMe2o7Iw5OC-kg8PTGbEwzE6662d26d6AGj8e5jJrb6");
    const result = spotifyApi.getMyRecentlyPlayedTracks({
      limit : 20
    }).then(function(data) {
      // Output items
      let s = '';
      data.body.items.forEach( item =>
        s += item.track.name +
        ' (popularity is ' +
        item.track.popularity +
        ')' + '\n');
      expect(s).toContain('popularity is')
    })
  });
});
