import mergeImages from 'merge-images';
import { saveAs } from 'file-saver';
import React, { useState, useEffect } from "react";
import Header from '../components/Header';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

/*
Component that displays the various components displayed on the artist page
including the header, the navigation buttons, the image, and a button
to download the image
*/
const Artist = () => {
    const [src, setSrc] = useState(null);

    /*
    Function that gets a user's top 10 artists from the backend /topartists endpoint and puts the artist JSON 
    objects into an array
    */
    const apiGet = () => {
        return new Promise(
            resolve => {
                fetch('http://localhost:8888/artists', {
                    method: 'GET',
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
                    }
                })
                    .then((response) => response.json())
                    .then(function (json) {
                        const artist = [];
                        for (let i = 0; i < 10; i++) {
                            artist.push(json[i]);
                            if (i === 9) {
                                resolve(artist);
                            }
                        }
                    })

            });
    }
    /* 
    Function taking in url, width, and height of an image and turns the circle into
    an image into a circle based on the given width and height and adds a white
    border
    It returns a promise that resolves to a base64 string
    */
    const convertAndResize = (url, width, height) => {
        return new Promise(
            function (resolve) {
                var img = new Image();
                img.src = url;
                img.setAttribute('crossOrigin', 'anonymous');

                img.onload = () => {
                    var canvas = document.createElement("canvas");
                    canvas.width = width + 20;
                    canvas.height = height + 20;
                    var ctx = canvas.getContext("2d");
                    ctx.fillStyle = "white";
                    ctx.beginPath();
                    ctx.arc((width) * .5, (width) * .5, (width) * .5, 0, Math.PI * 2, true);
                    ctx.closePath();
                    ctx.fill();

                    ctx.beginPath();
                    ctx.arc((width) * .5, (width) * .5, (width) * .47, 0, Math.PI * 2, true);
                    ctx.closePath();
                    ctx.clip();

                    ctx.drawImage(img, 0, 0, width, width);
                    resolve(canvas.toDataURL("image/png"));
                }
            });
    }
    /*
    Function taking in url, width, and height of an image that converts from an image url 
    to base64 resizing to given width and height
    returns a promise that resolves to the base64 string
    */
    const convert = (url, width, height) => {

        return new Promise(
            function (resolve) {
                var img = new Image();
                img.src = url;
                img.setAttribute('crossOrigin', 'anonymous');

                img.onload = () => {
                    var canvas = document.createElement("canvas");
                    canvas.width = width;
                    canvas.height = height;
                    var ctx = canvas.getContext("2d");
                    ctx.drawImage(img, 0, 0, width, height);
                    resolve(canvas.toDataURL("image/png"));
                }
            });
    }

    //call to the apiGet function for song information
    var apicall = apiGet();

    //waits until the API call is made to put the artist images into an array
    Promise.resolve(apicall).then((artists) => {
        var images = artists ? artists.map((item) => item.images[1].url) : null;

        const promises = [];

        //calls the convert and resize function on the artists decreasing the size
        //with each call
        var size = 250;
        for (var i = 0; i < 10; i++) {
            promises.push(convertAndResize(images[i], size, size));
            size -= 15;
        }

        //calls to convert for sticker images that are interspersed with artist images
        promises.push(convert("https://i.postimg.cc/pd7WLLqj/sticker-png-32601.png", 150, 150));
        promises.push(convert("https://i.postimg.cc/ydbZBKSp/butterfly.png", 150, 150));
        promises.push(convert("https://i.postimg.cc/Nfgk4skm/pizza.png", 170, 170));
        promises.push(convert("https://i.postimg.cc/mDrWGfQn/rainbow.png", 170, 170));
        promises.push(convert("https://i.postimg.cc/P5LD4FPr/barcode.png", 170, 170));
        promises.push(convert("https://i.postimg.cc/kXH6BFfr/leaf.png", 80, 80));

        // waits until all promises are resolved to merge images
        Promise.all(promises).then((values) => {
            mergeImages([
                {
                },
                {
                    src: values[0],
                    x: 5,
                    y: 5
                },
                {
                    src: values[10],
                    x: -20,
                    y: 150
                },
                {
                    src: values[4],
                    x: 0,
                    y: 270
                },
                {
                    src: values[3],
                    x: 290,
                    y: 470
                },
                {
                    src: values[5],
                    x: 130,
                    y: 460
                },
                {
                    src: values[8],
                    x: 170,
                    y: 350
                },
                {
                    src: values[6],
                    x: 140,
                    y: 200
                },
                {
                    src: values[2],
                    x: 230,
                    y: 30
                },
                {
                    src: values[9],
                    x: 385,
                    y: 150
                },
                {
                    src: values[1],
                    x: 260,
                    y: 240
                },
                { // leaf
                    src: values[15],
                    x: 260,
                    y: 210
                },
                { // rainbow
                    src: values[13],
                    x: 340,
                    y: 370
                },
                { // butterfly
                    src: values[11],
                    x: 355,
                    y: -3
                },
                { // barcode
                    src: values[14],
                    x: 130,
                    y: 580
                },
                { // pizza
                    src: values[12],
                    x: 15,
                    y: 420
                },
                {
                    src: values[7],
                    x: 10,
                    y: 540
                },

            ])
                .then((src) => setSrc(src))
                .catch(error => console.log(error))
        });
    })

    // loading placehoder image
    useEffect(() => {
        mergeImages([
            'data:image/png;base64,/9j/4AAQSkZJRgABAQAASABIAAD/4QCMRXhpZgAATU0AKgAAAAgABQESAAMAAAABAAEAAAEaAAUAAAABAAAASgEbAAUAAAABAAAAUgEoAAMAAAABAAIAAIdpAAQAAAABAAAAWgAAAAAAAABIAAAAAQAAAEgAAAABAAOgAQADAAAAAQABAACgAgAEAAAAAQAAArygAwAEAAAAAQAAAYoAAAAA/+0AOFBob3Rvc2hvcCAzLjAAOEJJTQQEAAAAAAAAOEJJTQQlAAAAAAAQ1B2M2Y8AsgTpgAmY7PhCfv/AABEIAYoCvAMBIgACEQEDEQH/xAAfAAABBQEBAQEBAQAAAAAAAAAAAQIDBAUGBwgJCgv/xAC1EAACAQMDAgQDBQUEBAAAAX0BAgMABBEFEiExQQYTUWEHInEUMoGRoQgjQrHBFVLR8CQzYnKCCQoWFxgZGiUmJygpKjQ1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4eLj5OXm5+jp6vHy8/T19vf4+fr/xAAfAQADAQEBAQEBAQEBAAAAAAAAAQIDBAUGBwgJCgv/xAC1EQACAQIEBAMEBwUEBAABAncAAQIDEQQFITEGEkFRB2FxEyIygQgUQpGhscEJIzNS8BVictEKFiQ04SXxFxgZGiYnKCkqNTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqCg4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2dri4+Tl5ufo6ery8/T19vf4+fr/2wBDAAMCAgICAgICAgICAgICAggCAgICAgoHBwYIAgoCAgIKAgICDgYGAgIGAgICBgoGBQgICQkJAgYLEAoIDQYICQj/2wBDAQMEBAYFBggGBggLCAYICAgICAgICAgICAgICAgICAgICAgIFAgICAgICAgICAgICAgICAgICAgICAgICAgICAj/3QAEACz/2gAMAwEAAhEDEQA/APuWiiivHP0sKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAP/Q+5aKKK8c/SwooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooA/9H7looorxz9LCiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD/0vuWiiivHP0sKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAP/T+5aKKK8c/SwooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooA/9T7looorxz9LCiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD/1fuWiiivHP0sKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAP/W+5aKKK8c/SwooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooA/9f7looorxz9LCiiigAooooAKKKKACiiigAoorjPiL8ZvhX8JDpA+Jfjvw/4KOviRtFGuXJXzv7M+yDUPsojDbxGb+zznGPtS+tNK+xMpKKvJ2Xd6I7OivGv+Gyv2Wf+i6eAP/Bk3/xNJ/w2X+yz/wBFz8A/+DJv/iarkl2Zj9Ypfzx/8CR7NRXjP/DZf7LP/Rc/AP8A4Mj/APE0f8Nl/ss/9Fz8A/8AgyP/AMTRyS7MPrFL+eP/AIEj2aivGf8Ahsv9ln/oufgH/wAGR/8AiaP+Gy/2Wf8AoufgH/wZH/4mjkl2YfWKX88f/AkezUV4z/w2X+yz/wBFz8A/+DI//E0f8Nl/ss/9Fz8A/wDgyP8A8TRyS7MPrFL+eP8A4Ej2aivGf+Gy/wBln/oufgH/AMGR/wDiaP8Ahsv9ln/oufgH/wAGR/8AiaOSXZh9Ypfzx/8AAkezUV4z/wANl/ss/wDRc/AP/gyP/wATR/w2X+yz/wBFz8A/+DI//E0ckuzD6xS/nj/4Ej2aivGf+Gy/2Wf+i5+Af/Bkf/iaP+Gy/wBln/oufgH/AMGR/wDiaOSXZh9Ypfzx/wDAkezUV4z/AMNl/ss/9Fz8A/8AgyP/AMTR/wANl/ss/wDRc/AP/gyP/wATRyS7MPrFL+eP/gSPZqK8Z/4bL/ZZ/wCi5+Af/Bkf/iaP+Gy/2Wf+i5+Af/Bkf/iaOSXZh9Ypfzx/8CR7NRXjP/DZf7LP/Rc/AP8A4Mj/APE0f8Nl/ss/9Fz8A/8AgyP/AMTRyS7MPrFL+eP/AIEj2aivGf8Ahsv9ln/oufgH/wAGR/8AiaP+Gy/2Wf8AoufgH/wZH/4mjkl2YfWKX88f/AkezUV4z/w2X+yz/wBFz8A/+DI//E0f8Nl/ss/9Fz8A/wDgyP8A8TRyS7MPrFL+eP8A4Ej2aivGf+Gy/wBln/oufgH/AMGR/wDiaP8Ahsv9ln/oufgH/wAGR/8AiaOSXZh9Ypfzx/8AAkezUV4z/wANl/ss/wDRc/AP/gyP/wATR/w2X+yz/wBFz8A/+DI//E0ckuzD6xS/nj/4Ej2aivGf+Gy/2Wf+i5+Af/Bkf/iaP+Gy/wBln/oufgH/AMGR/wDiaOSXZh9Ypfzx/wDAkezUV4z/AMNl/ss/9Fz8A/8AgyP/AMTR/wANl/ss/wDRc/AP/gyP/wATRyS7MPrFL+eP/gSPZqK8Z/4bL/ZZ/wCi5+Af/Bkf/iaP+Gy/2Wf+i5+Af/Bkf/iaOSXZh9Ypfzx/8CR7NRXjP/DZf7LP/Rc/AP8A4Mj/APE0f8Nl/ss/9Fz8A/8AgyP/AMTRyS7MPrFL+eP/AIEj2aivGf8Ahsv9ln/oufgH/wAGR/8AiaP+Gy/2Wf8AoufgH/wZH/4mjkl2YfWKX88f/AkezUV4z/w2X+yz/wBFz8A/+DI//E0f8Nl/ss/9Fz8A/wDgyP8A8TRyS7MPrFL+eP8A4Ej2aivGf+Gy/wBln/oufgH/AMGR/wDiaP8Ahsv9ln/oufgH/wAGR/8AiaOSXZh9Ypfzx/8AAkezUV4z/wANl/ss/wDRc/AP/gyP/wATR/w2X+yz/wBFz8A/+DI//E0ckuzD6xS/nj/4Ej2aivGf+Gy/2Wf+i5+Af/Bkf/iaP+Gy/wBln/oufgH/AMGR/wDiaOSXZh9Ypfzx/wDAkezUV4z/AMNl/ss/9Fz8A/8AgyP/AMTR/wANl/ss/wDRc/AP/gyP/wATRyS7MPrFL+eP/gSPZqK8Z/4bL/ZZ/wCi5+Af/Bkf/iaP+Gy/2Wf+i5+Af/Bkf/iaOSXZh9Ypfzx/8CR7NRXjP/DZf7LP/Rc/AP8A4Mj/APE0f8Nl/ss/9Fz8A/8AgyP/AMTRyS7MPrFL+eP/AIEj2aivGf8Ahsv9ln/oufgH/wAGR/8AiaP+Gy/2Wf8AoufgH/wZH/4mjkl2YfWKX88f/AkezUV4z/w2X+yz/wBFz8A/+DI//E0f8Nl/ss/9Fz8A/wDgyP8A8TRyS7MPrFL+eP8A4Ej2aivGf+Gy/wBln/oufgH/AMGR/wDiaP8Ahsv9ln/oufgH/wAGR/8AiaOSXZh9Ypfzx/8AAkezUV4z/wANl/ss/wDRc/AP/gyP/wATR/w2X+yz/wBFz8A/+DI//E0ckuzD6xS/nj/4Ej2aivGf+Gy/2Wf+i5+Af/Bkf/iaP+Gy/wBln/oufgH/AMGR/wDiaOSXZh9Ypfzx/wDAkezUV4z/AMNl/ss/9Fz8A/8AgyP/AMTR/wANl/ss/wDRc/AP/gyP/wATRyS7MPrFL+eP/gSPZqK868C/tE/A/wCJuvL4X8AfE3wv4s8QNZPqI0nR7os+yx8s3bMGACRL5seST/GOtei1LTW5rGcZq8Wmu6d/yCiiikWFFFFABRRRQAUUUUAFFFFAH//Q+5aKKK8c/SwooooAKKKKACiiigAooooAK/PT/grpLLDpXwNaKWSJvt1/80b4P3PD/wDEtfoXX54/8FeP+QR8Dv8Ar+v/AP0Dw/W1L4kebmH+7z/7d/8ASkfHPwS/Zp+OH7QFjr2o/DbTk1a08OXKWepyXnitINragrXdsI01A5nBgUHIHGa9M/4dy/td/wDQsaf/AOHFh/xr6N/4JJc+C/jF/wBjJaf+iZa9g/bC/bC1P9l3U/A9jY+B9K8XReLtKuNSnn1LX3t/K/sV9HskES2KT/ad7aup5Ax5HvXTKcublilc8ajhKLoKtVlJLrb/ABWWlmz4S/4dy/td/wDQsaf/AOHFh/xo/wCHcv7XX/Qsaf8A+HFh/wAa9i/4e6a5/wBEY8L/APhdz/8Axivc/wBkb9t/Vv2nPHmveD7z4e6N4UtdF8KHxGNT0/xNJOzlJLPTkU2t7HAI49s8zFsn7ijBycDlUWrSsEKGDnJRjOfM9F/Vj4q/4dy/tdf9Cxp//hxYf8aP+Hcv7Xf/AEK+n/8AhxYf8a/Q79rv9pfUP2Y/CfhLxLp/hLTvFz+JfEUmiS22pay0CxiyiutYZknslmaVyLUrt2/xda+Ux/wV01vv8GPC5/7nuf8A+MURlOSukrFVcNhKUnCc5qS+e/yPHf8Ah3L+11/0LGn/APhxYf8AGk/4dy/tdf8AQsad/wCHFh/xr68/Zh/4KA6x+0N8WNJ+G1x8M9C8NWupaVcalJrFj4qkmZf7DSO7ULZXkcKtvaWMZ3cAH2r7NqJVZx0aR0UcBhq0eaEptXt0Wv3eZ+O3/DuX9rr/AKFjT/8Aw4sP+NH/AA7l/a6/6FjT/wDw4sP+NfsTRUfWJdl9xt/ZNL+aX3r/ACPx2/4dy/tdf9Cxp/8A4cWH/Gj/AIdy/tdf9Cxp/wD4cWH/ABr9iaKPrEuy+4P7JpfzS+9f5H47f8O5f2uv+hY0/wD8OLD/AI0f8O5f2uv+hY0//wAOLD/jX7E0UfWJdl9wf2TS/ml96/yPx2/4dy/tdf8AQsaf/wCHFh/xo/4dy/tdf9Cxp/8A4cWH/Gv2Joo+sS7L7g/sml/NL71/kfjt/wAO5f2uv+hY0/8A8OLD/jR/w7l/a6/6FjT/APw4sP8AjX7E0UfWJdl9wf2TS/ml96/yPx2/4dy/tdf9Cxp//hxYf8aP+Hcv7XX/AELGn/8AhxYf8a/Ymij6xLsvuD+yaX80vvX+R+O3/DuX9rr/AKFjT/8Aw4sP+NH/AA7l/a6/6FjT/wDw4sP+NfsTRR9Yl2X3B/ZNL+aX3r/I/Hb/AIdy/tdf9Cxp/wD4cWH/ABo/4dy/tdf9Cxp//hxYf8a/Ymij6xLsvuD+yaX80vvX+R+O3/DuX9rr/oWNP/8ADiw/40f8O5f2uv8AoWNP/wDDiw/41+xNFH1iXZfcH9k0v5pfev8AI/Hb/h3L+11/0LGn/wDhxYf8aP8Ah3L+11/0LGn/APhxYf8AGv2Joo+sS7L7g/sml/NL71/kfjt/w7l/a6/6FjT/APw4sP8AjR/w7l/a6/6FjT//AA4sP+NfsTRR9Yl2X3B/ZNL+aX3r/I/Hb/h3L+11/wBCxp//AIcWH/Gj/h3L+11/0LGn/wDhxYf8a/Ymij6xLsvuD+yaX80vvX+R+O3/AA7l/a6/6FjT/wDw4sP+NH/DuX9rr/oWNP8A/Diw/wCNfsTRR9Yl2X3B/ZNL+aX3r/I/Hb/h3L+11/0LGn/+HFh/xo/4dy/tdf8AQsaf/wCHFh/xr9iaKPrEuy+4P7JpfzS+9f5H47f8O5f2uv8AoWNP/wDDiw/40f8ADuX9rr/oWNP/APDiw/41+xNFH1iXZfcH9k0v5pfev8j8dv8Ah3L+11/0LGn/APhxYf8AGj/h3L+11/0LGn/+HFh/xr9iaKPrEuy+4P7JpfzS+9f5H47f8O5f2uv+hY0//wAOLD/jR/w7l/a6/wChY0//AMOLD/jX7E0UfWJdl9wf2TS/ml96/wAj8dv+Hcv7XX/Qsaf/AOHFh/xo/wCHcv7XX/Qsaf8A+HFh/wAa/Ymij6xLsvuD+yaX80vvX+R+O3/DuX9rr/oWNP8A/Diw/wCNH/DuX9rr/oWNP/8ADiw/41+xNFH1iXZfcH9k0v5pfev8j8dv+Hcv7XX/AELGn/8AhxYf8aP+Hcv7XX/Qsaf/AOHFh/xr9iaKPrEuy+4P7JpfzS+9f5H47f8ADuX9rr/oWNP/APDiw/40f8O5f2uv+hY0/wD8OLD/AI1+xNFH1iXZfcH9k0v5pfev8j8dv+Hcv7XX/Qsaf/4cWH/Gj/h3L+11/wBCxp//AIcWH/Gv2Joo+sS7L7g/sml/NL71/kfjt/w7l/a6/wChY0//AMOLD/jR/wAO5f2uv+hY0/8A8OLD/jX7E0UfWJdl9wf2TS/ml96/yPx2/wCHcv7XX/Qsaf8A+HFh/wAaP+Hcv7XX/Qsaf/4cWH/Gv2Joo+sS7L7g/sml/NL71/kfjt/w7l/a6/6FjT//AA4sP+NH/DuX9rr/AKFjT/8Aw4sP+NfsTRR9Yl2X3B/ZNL+aX3r/ACPx2/4dy/tdf9Cxp/8A4cWH/Gj/AIdy/tdf9Cxp/wD4cWH/ABr9iaKPrEuy+4P7JpfzS+9f5H47f8O5f2uv+hY0/wD8OLD/AI0f8O5f2uv+hY0//wAOLD/jX7E0UfWJdl9wf2TS/ml96/yPx2/4dy/tdf8AQsaf/wCHFh/xrl/id+xb+0l8I/A+t/ELxpotrp/hnw8sbaneW3jeKVlGoSWelW2yytDvnzd3sA+Xpuz2r9sa+dv+Cg//ACaF8Xv+uFn/AOlnhmrhWbaVlqzGvllKFOc05XjGTWq3Sv2Phr/gl9NPP+0fb/aJpZmXwFqKgyyE/wDQpdC3QZr9bq/I/wD4Jdf8nIQ/9iLqP/upV+uB6n61Ff4vkdGVfwf+3n+SCiiiuY9kKKKKACiiigAooooAKKKKAP/R+5aKKK8c/SwooooAKKKKACiiigAooooAK/PH/grx/wAgj4Hf9f1//wCgeH6/Q6vzx/4K8f8AII+B3/X9f/8AoHh+tqXxL+uh5uYf7vP/ALd/9KRpf8EkR/xRfxh4/wCZjtOf+2Mv61yn/BXT/kOfBof9Svff+jvBldZ/wSR/5Ev4w/8AYx2n/omWuT/4K6f8h34Nf9ivff8Ao7wZW6/i/wBdjzJf8i/5/wDt5+dlfdH/AASa/wCSz+O/+yYt/wCj7Cvhevun/gk1/wAln8d/9kxb/wBH2FdFT4X6Hj4L+PD/ABI9s/4Kxf8AJKfhd/2Plx/6SavX5Ven+fWv1V/4Kxf8kp+F3/Y+XH/pJq1flV6VFH4UdGZ/x5fL8kfWn/BMn/k6Hwz/ANixqH/oqzr9hq/Hn/gmV/ydD4Z/7FjUP/RNnX7DVz19/ke3lP8ABf8Aif5RCiiiuU9oKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAr52/4KD/8mhfF7/rhZ/8ApZ4Yr6Jr52/4KD/8mhfF7/rhZ/8ApZ4YrSn8S9UcuK/g1P8ABL/0lnwv/wAEuv8Ak5CH/sRdR/8AdSr9cTX5Hf8ABLr/AJOQi/7EXUf/AHUa/XGta/xfL9Tgyr+C/wDE/wAkFFFFcx7IUUUUAFFFFABRRRQAUUUUAf/S+5aKKK8c/SwooooAKKKKACiiigAooooAK/PH/grx/wAgj4Hf9f1//wCgeH6/Q6vzx/4K8f8AII+B3/X9f/8AoHh+tqXxL+uh5uYf7vP/ALd/9KRp/wDBJH/kS/jD/wBjHaf+iZaqf8FSfh9448c698If+EP8H+K/FEdl4bvYb2bw54XnuljNxN4VmthevoSTfZXeK1uSA+M+Qa8S/Ya/bE+HX7NPh/x7pPjXw9401qfxRq0F/YyeF4ICqjTY5LKf7WdbltiJDIQRsDDHcV9Oj/grB8BR08C/F8f7tpZ/0uea6JRkp8yV1/wDy6VWjPCqlOfK+ujdvev+J+cH/DO/xu/6JR8TP/Da3v8A8Zr7I/4JjfDbx/4F+MXjGfxf4I8Z+GrS8+GzW9tf+IPB1xbRM0U+mSssV/rccUb3flyqwQHcQjEAhGI9Y/4exfAb/oR/jD/4C2f/AMk0h/4Kw/AU8HwN8YD7G0s/63NVJzkrcv4mVGlhqU4z9tfld7crLP8AwU78HeLPGnw1+Gth4S8MeI/E93beOJpru38OaBLctGs9rqdpE11b6IsrwW5up4V3FcZkr82D+zv8bv8AolHxMH/dNL3/AOM1+jw/4KwfAUdPAvxfGeu20s/1xc80v/D2L4Df9CP8Yf8AwFs//kmpg5xVuUvEww9eo5usle2nK3srHz1/wTx+FHxK8GftKeGtU8UeAPHGgaUnhy+il1XW/BdzbxK1zFAtsJb/AFmOJEmdoZQBnkpjuK/Vqvio/wDBWH4DHg+BvjAR6G1s/wCRuTSf8PX/AICf9CH8Xf8AwDsv/kms5xnJ3sduFrYfDwcFVTu73s10S/Q+1qK+Kf8Ah6/8BP8AoQ/i7/4BWX/yTR/w9f8AgJ/0Ifxd/wDAKy/+Saz9jLsdn16h/OvxPtaivin/AIev/AP/AKET4u/+AVl/8k0f8PX/AICf9CH8Xf8AwCsv/kmj2MuwfX6H86/E+1qK+Kf+Hr/wD/6ET4u/+AVl/wDJNH/D1/4B/wDQifF3/wAArL/5Jo9jLsH16h/OvxPtaivin/h6/wDAP/oRPi7/AOAVl/8AJNH/AA9f+Af/AEInxd/8ArL/AOSaPYy7B9eofzr8T7Wor4p/4ev/AAD/AOhE+Lv/AIBWX/yTR/w9f+Af/QifF3/wCsv/AJJo9jLsH16h/OvxPtaivin/AIev/AT/AKEP4u/+AVl/8k0f8PX/AIB/9CJ8Xf8AwCsv/kmj2MuwfXqH86/E+1qK+Kf+Hr/wD/6ET4u/+AVl/wDJNH/D1/4B/wDQifF3/wAArL/5Jo9jLsH16h/OvxPtaivin/h6/wDAT/oQ/i7/AOAVl/8AJNH/AA9f+Af/AEInxd/8ArL/AOSaPYy7B9eofzr8T7Wor4p/4ev/AAE/6EP4u/8AgFZf/JNH/D1/4B/9CJ8Xf/AKy/8Akmj2MuwfXqH86/E+1qK+Kf8Ah6/8A/8AoRPi7/4BWX/yTR/w9f8AgH/0Inxd/wDAKy/+SaPYy7B9eofzr8T7Wor4p/4ev/AP/oRPi7/4BWX/AMk0f8PX/gJ/0Ifxd/8AAKy/+SaPYy7B9eofzr8T7Wor4p/4ev8AwE/6EP4u/wDgFZf/ACTR/wAPX/gJ/wBCH8Xf/AKy/wDkmj2MuwfXqH86/E+1qK+Kf+Hr/wAA/wDoRPi7/wCAVl/8k0f8PX/gJ/0Ifxd/8ArL/wCSaPYy7B9eofzr8T7Wor4p/wCHr/wE/wChD+Lv/gFZf/JNH/D1/wCAn/Qh/F3/AMArL/5Jo9jLsH16h/OvxPtaivin/h6/8A/+hE+Lv/gFZf8AyTR/w9f+An/Qh/F3/wAArL/5Jo9jLsH16h/OvxPtaivin/h6/wDAP/oRPi7/AOAVl/8AJNH/AA9f+Af/AEInxd/8ArL/AOSaPYy7B9eofzr8T7Wor4p/4ev/AAD/AOhE+Lv/AIBWX/yTR/w9f+An/Qh/F3/wCsv/AJJo9jLsH16h/OvxPtaivin/AIev/AP/AKET4u/+AVl/8k0f8PX/AIB/9CJ8Xf8AwCsv/kmj2MuwfXqH86/E+1qK+Kf+Hr/wE/6EP4u/+AVl/wDJNH/D1/4Cf9CH8Xf/AACsv5/aaPYy7B9eofzr8T7Wor4p/wCHr/wE/wChD+Lv/gFZf/JNH/D1/wCAf/QifF3/AMArL/5Jo9jLsH1+h/OvxPtaivin/h6/8A/+hE+Lv/gFZf8AyTR/w9f+Af8A0Inxd/8AAKy/+SaPYy7B9eofzr8T7Wor4p/4ev8AwD/6ET4u/wDgFZf/ACTR/wAPX/gH/wBCJ8Xf/AKy/wDkmj2MuwfXqH86/E+1qK+Kf+Hr/wAA/wDoRPi7/wCAVl/8k0f8PX/gH/0Inxd/8ArL/wCSaPYy7B9eofzr8T7Wor4p/wCHr/wE/wChD+Lv/gFZf/JNH/D1/wCAf/QifF3/AMArL/5Jo9jLsH16h/OvxPtaivin/h6/8BP+hD+Lv/gFZf8AyTR/w9f+An/Qh/F3/wAArL/5Jo9jLsH16h/OvxPtaivin/h6/wDAP/oQvi//AOAVn/8AJNH/AA9g+Af/AEIfxe/8AbP/AOSaXspdh/XqH86/E+1qK+Kf+HsHwD/6EP4vf+ANn/8AJNH/AA9f+Af/AEIfxe/8AbP/AOSaPZS7MPr1D+dH2tXzt/wUH/5NC+L/AP1ws/8A0s8NV5l/w9g+Af8A0Ifxe/8AAGz/APkmvKv2pP8AgoX8IfjZ8CfHfwx8MeEfiPput+J44I7K+121thCv9mT6PrE/2p9LmmlANvYTAbEbl16DJq4U5KSduqObE4yjKlOKmm3CSS82mec/8Euv+TkIv+xF1H/3Ua/XGvyO/wCCXJz+0fAfXwJqB/P/AIRI1+uJ6n60V/i+ROVfwX/if5IKKKK5z2QooooAKKKKACiiigAooooA/9P7looorxz9LCiiigAooooAKKKKACiiigAr5q/bN/ZP1/8Aaih+Htvovi7QvC0Xgya5mvF1nSpJTKdcGkxW32ZtOaPyERbC4yGzkzLyNpDfStFVGXK7mVWlGrFwnrF79Nnc/Mz/AIdIeNP+iseCP/CbuP8A45S/8OkPGf8A0VjwP/4Tdx/8cr9MqK19vI8/+zMP2f3s/M3/AIdIeNP+iseCP/CbuP8A45R/w6Q8af8ARWPBH/hN3H/xyv0yoo9vIP7Modn/AOBM/M3/AIdIeNP+iseCP/CbuP8A45R/w6Q8af8ARWPBH/hN3H/xyv0yop+3kH9mUOz/APAmfmb/AMOkPGn/AEVjwR/4Tdx/8co/4dIeNP8AorHgj/wm7j/45X6ZUUe3kH9mUOz/APAmfmb/AMOkPGn/AEVjwR/4Tdx/8co/4dIeNP8AorHgj/wm7j/45X6ZUUe3kH9mUOz/APAmfmb/AMOkPGn/AEVjwR/4Tdx/8co/4dIeNP8AorHgj/wm7j/45X6ZUUe3kH9mUOz/APAmfmb/AMOkPGn/AEVjwR/4Tdx/8co/4dIeNP8AorHgj/wm7j/45X6ZUUe3kH9mUOz/APAmfmb/AMOkPGn/AEVjwR/4Tdx/8co/4dIeNP8AorHgj/wm7j/45X6ZUUvbyD+zKHZ/+BM/M3/h0h40/wCiseCP/CbuP/jlH/DpDxp/0VjwR/4Tdx/8cr9MqKft5B/ZlDs//Amfmb/w6Q8af9FY8Ef+E3cf/HKP+HSHjT/orHgj/wAJu4/+OV+mVFHt5B/ZlDs//Amfmb/w6Q8af9FY8Ef+E3cf/HKP+HSHjT/orHgj/wAJu4/+OV+mVFHt5B/ZlDs//Amfmb/w6Q8af9FY8Ef+E3cf/HKP+HSHjT/orHgj/wAJu4/+OV+mVFL28g/syh2f/gTPzN/4dIeNP+iseCP/AAm7j/45R/w6Q8af9FY8Ef8AhN3H/wAcr9MqKPbyD+zKHZ/+BM/M3/h0h40/6Kx4I/8ACbuP/jlH/DpDxp/0VjwR/wCE3cf/AByv0yop+3kH9mUOz/8AAmfmb/w6Q8af9FY8Ef8AhN3H/wAco/4dIeNP+iseCP8Awm7j/wCOV+mVFHt5B/ZlDs//AAJn5m/8OkPGn/RWPBH/AITdx/8AHKP+HSHjT/orHgj/AMJu4/8AjlfplRS9vIP7Modn/wCBM/M3/h0h40/6Kx4I/wDCbuP/AI5R/wAOkPGn/RWPBH/hN3H/AMcr9MqKft5B/ZlDs/8AwJn5m/8ADpDxp/0VjwR/4Tdx/wDHKP8Ah0h40/6Kx4I/8Ju4/wDjlfplRS9vIP7Modn/AOBM/M3/AIdIeNP+iseCP/CbuP8A45R/w6Q8af8ARWPBH/hN3H/xyv0yoo9vIP7Modn/AOBM/M3/AIdIeNP+iseCP/CbuP8A45R/w6Q8af8ARWPBH/hN3H/xyv0yop+3kH9mUOz/APAmfmb/AMOkPGn/AEVjwR/4Tdx/8co/4dIeNP8AorHgj/wm7j/45X6ZUUe3kH9mUOz/APAmfmb/AMOkPGn/AEVjwR/4Tdx/8co/4dIeNP8AorHgj/wm7j/45X6ZUUe3kH9mUOz/APAmfmb/AMOkPGn/AEVjwR/4Tdx/8co/4dIeNP8AorHgj/wm7j/45X6ZUUe3kH9mUOz/APAmfmb/AMOkPGn/AEVjwR/4Tdx/8co/4dIeNP8AorHgj/wm7j/45X6ZUUe3kH9mUOz/APAmfmb/AMOkPGn/AEVjwR/4Tdx/8co/4dIeNP8AorHgj/wm7j/45X6ZUUe3kH9mUOz/APAmfmb/AMOkPGn/AEVjwR/4Tdx/8co/4dIeNP8AorHgj/wm7j/45X6ZUUvbyD+zKHZ/+BM/M3/h0h40/wCiseCP/CbuP/jlH/DpDxp/0VjwR/4Tdx/8cr9MqKPbyD+zKHZ/+BM/M3/h0h40/wCiseCP/CbuP/jlH/DpDxp/0VjwR/4Tdx/8cr9MqKPbyD+zKHZ/+BM/M3/h0h40/wCiseCP/CbuP/jlH/DpDxp/0VjwR/4Tdx/8cr9MqKPbyD+zKHZ/+BM/M3/h0f4z/wCiseB//CauP/jlH/Do/wAZ/wDRWPA//hNXH/xyv0yop+3kT/ZdDs/vPzN/4dH+M/8AorHgf/wmrj/45R/w6P8AGf8A0VjwP/4TVx/8cr9MqKPbyD+y6HZ/efmb/wAOkPGf/RWPA/8A4TVx/wDHKP8Ah0h40/6Kx4H/APCbuP8A45X6ZUUe3kH9l0Oz+8+NP2UP2D/E/wCzl8VIfH+p+PPDPiLT08N3OhnTNK0eWN92u/2Vsbz9QaRWjX+y1G3j/WHrX2XRRWUpuTuzvoUIUY8sL2vfV3/rYKKKKg6AooooAKKKKACiiigAooooA//U+5aKKK8c/SwooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAPzoII6gj6ivG/wBse5uLT9l7423VpPPa3Nv4JeWC5tpirKUexKGKaLBjcEdQa+Gv+CaOs+JL79o3VbfWdW1q9gX4b35gg1HW5JV/cTeBUhKxXrSBJglxMMjB/eHrW0ad4uV9jgrYr2dWFLlvzW1vtdtbdT9SaKKKxO8KKK5e/wDir8MdG1K50zV/iJ4I0vUtOufI1DT9R8URRvEybJHF5bXDBreQRuhIbHDimlcltLc6nDf3W/75owRzg4+lfij8QvAn7SN7488ZXmg+D/jhdaLeeMLu806603w7qLRPFdXGrXGnNpk+mKYZ9OfTJLRkaElSsgPeu5/ZT8NfG7wr8f8A4Y+JPiToPxX8PeDdE8RtqGv674y0i+hs7eKKDxCkr67qXicLbWFmt3JYDfMwALjnk10uikr3PEWZSc1H2ejaV7vvvsfrpRXOaH8Rvh94k1CPSPD3jjwlruqyQtcJpukeIY5ZCtrsN0UtLUszRIHTJxgbx61e8QeK/C/hO3t7vxT4i0Tw5a3dx9ktLjXNUSFXYB5ysEt6VEs/kRSNtBziMntXNY9vmVr309TV57An6Cl2t6H8q/PP/gondeK/iXrPwqufgXP4k8eW+kaLeW/iK4+FTT3awveSeGZdLGuyeBfM+xTSW0GolBPjcIXIzg18hyfDz9qDy7DZ4J+P/mBT9t3eGdU/vSGPy/l4/wBG2dO9dEaN1dux49bMXTm4qnzJW1T3ur+Z+49FfOP7Jfj/AMM+DP2ePhr4a+JPjLSfC/jfSNMki8SaD4510QXkLzS394BrWm68VuLO4NrcQOBMAdsykcEV9BvdW19pMl7ZXMN3aXemm5tbq2lDK6zq8kLQTR8SwtGykMODmsXGzsenTqc8FLZtJ2vt5Fza391vyowf7rf981+AGla98T9W1DStN0jV/Gmp3ep+XbWNlp3iC4klla5VGQWWn2LmS7uWbeRHEpY7eB2rr/8AhXf7VnfwT8e//CY1T/4n1rp9gu54izZvanf/ALe/4B+5+COoI7ciivzI/wCCf0PxK+HPxq17XPjbH438EeErj4ZXGmWer/E2C6tbZriefwhPZpbX3jYRwS6u1ja6kyoh3lbaU4wrV+jvh7xr4O8XNdp4W8V+HfEj2Cq18mg6ykxjF15q232oWRb7OrtBOAWxnym9DWE4crtv5nq4bEe2jdrld2rX12vfozawfQn8P8KXDD+Fv++a/Ob/AIKR+FvjFrvxd8G3Xw38OfE7VtNi+HYgvrnwXo93LCJFn1F4xdS+FQyJffZnc4bnDjP8NfE/ii8+LfhnUYdG1i7+IGh6zBpiS6jpWvavdQTIbg3ZjM2may0UtsjxIjLuQAjkZBydY0VJXucOIzJ0ZuHs7pO172vpfsfvjg+h/Kkr8LovBn7R+s2kOq6F4W+OOraJqelreaZqOl6PqM0couI43iaw1G0Dw31o1yWIdHZCCOSK/aTxQJYvhN4iVhLFPH8NplYNkMDHbXAbdnBjlDg+hBWonT5ba7nRhsY63NeHKoq+977+h121v7rflRgjqCPqP8a/AbRtW+K2v6jpuj+H9R8d63f6jAsen6dpGs3M00rNH9rYWml6U7y3T7IpnKxocLCxwApx9efsE2PxL+H/AMa7jxH8Z7Px74M8Kp4Du9POu/Em0u7a0Et+/hNdHRdT8aiOBdVkMWpBUQ7m8tuuBVyoWV7/AIHLRzN1JKPJZNpN328+n5n6eUuCegJ+g/wrC8PeOfBfi2a6tvC3i3w34juLGEXN7b6FraTNGtwZIYDcxWJYwRNNFKoLcExH0r4A/wCCqer+IdM8Z/CVdB1TVtPeXwbdyyppurvCG8qfQo1M/wBiaPziEnlA3H/lpWMIcztseliK6o03US5rW0v3aW+p+jfTggg+4or5j/4J0Xd/ffszaVc6ld3l7dt44v45Li/u2kc+RKYYxJdXRZpAqIF5J+7Xu2o/FL4Z6HqNxpetfELwTpOpadcCK/0/UvE8UckZHlTEXdrcMGt5PJkjbDAcSA96Uo2bW5dKsp041H7vMr2bOnwfRj/wH/Cja391v++a/Fn4jeCP2idS+JnjXUdB8J/G698N3/j27vtOvdH8P6i8MkN3c6rc6c2j3OkqYbjTX0eS1ZHgJUrIpB5zXMn4eftT+a+3wT8ffJ8w7M+GNUzj5/Lz8vXG2uj2C7nkPNJX/hN/P/gH7mYPofrj+tJX5g/sA+D/AI4aP+0Tol98QPDHxX0zRI/Cl6kl74t0S9jtw8sdktgHuPE4WJbtmF0FAOTj6V+n1Y1Icrte56WFxDrxcnHls7W+Sd+ncKKKKyO0KKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAP/V+5aKKK8c/SwooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooA8X/bP5/ZX+OX/YiuefZrH9a+DP8AgmBB5P7SWtZltpN/w51Fx5E2cfvvAAG/b91v8K+8/wBs/wD5NX+OX/YiP2/2rH8q+D/+CYUMEX7SWtCC8S73/DfUWcrAy7SZvh8SG+0Abj9PSuun8D/roeDi/wDe6Xy/9KZ+rFFFFch7wHofpX4l/tp26v8AtQ/HCTdYjb4ul3LNt3Hy7fRZI/K35JIkJIwepNftoeh+lfiZ+2lDbt+1B8cJJLxIpY/F03l25t2O7Ntov3ZY/lTkkfMe1dVD4n6Hh5v/AAo/4/0Z+zfgosPBvhEbm48L244b/plZ9MVwX7V7N/wzN8ehubH/AAqi94Lf9Mpu1d54L58G+Ej/ANSvb/8Aoqzrgv2r/wDk2b49f9kovf8A0VPWP2vn+p6VT+C/8D/9JPzt/wCCa1skH7U0e02B/wCKO1JU+x7eBH/YPlCQQ4xgO2Af7xr6M/4KtxiX4OfDZCYAT8TWINzjaNtn4pZd5kyOHCn6gV86/wDBNmGCL9qZBBdpdb/CWptIEgZdpP8Awj/BM4G89enpX0X/AMFWkjk+Dvw2SWdbeNviY4aZoycZs/FXWOHJbkdv71dcv4i9P8zwMP8A7nV/xf8AyJ5R/wAE3/jr8Ivg34S+J9j8SfH3h/wlc654ltrnS47qQ4lFjC8N6YPsQIwtxOgOccyV9iH9tv8AZXx/yW7wnz285/pyNvHevy3+AP7JPxM/aI0LX7v4b6t4WFr4V1lbbVJNe1uS1JbV44Lq1+yRxRzm5jENtJkttwcdc5r1ib/gmD+0tLBZxf2r8NF+yRsm5fH8vzec0tz83+jjkeZj8KJwg3q9ScLiMTCmlTp80dbOzfV3/E8f/bF8V+GPiF+0V8VPGfg7XNG1/wAOa5qKXel6tBID5y2tp4e08m1M43kLqNhfIBx80J9Qa/Yn4VjHwZ+HqggAfDS2Ax04t7Ycf7P+FfiD8XfhhrXwn8feJPAPjDUdLHibwhCNJ1CPSpXmjdmgs9Vi+x6myx+chs9UtMmREw24YIUMf2/+Ff8AyRn4fDIIHw1thu/7YWw6HkdaVZe6jTLW5Vqras2nddnzar7z8Yv2VYDH+0f8DJhNat5nxDssRx3A3DufMjHKdPzI9a/dLc2T879f71fhh+yvBbD9oz4FyLfpJLJ8QrLzLYWzArj1lcbX5wOP72exr9zvX61OI3XzNMn2qesf1PkL/gqIPM/Zw01XZCP+FnWmPPbj5l1dDv8AMyAm1jnjoTXkf/BI6LytQ+PAL2rk6TpbM9oRj7/xDUbjDgGTaoH4CvXf+CoKo37OOnB5RCv/AAs20zIUJxldWB+SLJbC5OB1xXkn/BI+KCG++PEdvdpeINJ0s+ckDL1k+Iu75bjBOOOenzfWkv4TLqf7/D/D/wC2yP0XyQDhmH0b/Cvx3/4KMW/n/taeMSZ7VCmk2DH7VOBn9yg+XdnceB+Yr9iD0Nfj1/wUUgt5P2tfGTT38doV0uwZUa1Zs4hhHW3BC9vz9qmh8XyN81/gr/GvyZ+mX7KZYfsz/AQb2x/wqax43f8ATK3rsviL/wAk+8ec/wDMl3fJPrDqHUmuM/ZU/wCTZ/gJ/wBkmsf/AEVB/jXZ/ETn4feO+cD/AIQu7yf+2Oodh1rKXxfM9Cl/Aj/gX/pJ+Pf7CUJj/as+C8olgYya7wkU3zDFj4sz5iD7lfoX/wAFGFEv7LPiSOTa6P4x01GWU5B3XNkG8xX4KYJ61+e37CkMCftU/BWRLxJZZNd/eW4gYFcWPi0/NJINsnPHy561+n37W/wk8V/G74Jax8PvBT6Mmv33iC01S3bXtQMMW3QpYNTu/OvLdZmicwwkDCHlhXVV0nF/1ufP4GLlhqySu3ey+R8g/wDBJaEQ+JvjJzauzeD7Jnezxg/6R4qQZMOAz7EQf8AFV/8AgrVB5/jH4RIJYIs+DLs755cD5Z/Dvdv4sH9DW78C/C9//wAE5B4j8VfH9rK60b4kWkPhPw2fh3dteuJdAbXvEV8dVgvEtDaWxsb47Sm/m3bO3ivEv28P2ifhp+0drnw/1TwNda7p9l4f8P3Gk3zeI9DaNi95Lol/F9ljt/M82IQWzZJIwXHBprWaktu/yJlJU8G6U3ape/K9/iT29D7Y/wCCbg2/svaQuVIHjnUBlDkcTMPlI6rX56ftxQK/7U/xul3WK7fEp3LPjedlp4cePyQ4LMQ5YjB6k1+hX/BN1VX9l/Sdrh1HjrUMOFIziZgPlflcgA8+tfnv+3FFA/7UvxtkkvEhmj8St5dubdjuzaeG/uyxAqnPHzelKH8SX9disV/udH1X5SP2G+Hlwlr8MvA1xNKY4bbwJbTyybjgLBDZyyHC9VEaMePSvNh+27+yuQCPjd4UGRkAySd+eVK/KfrXoXgm2ku/hP4StIdvm3fw6gtot7YGbm3t4It7fwrvda/K7x3/AME7v2gfh74L8TePde1XwANF8FeF313Vk0rxnK8nl6DH5l39gsJIY1uLkwwMQjSKCTjcOtYxjGTd3bU9PEVqtKEHTjzLlvK6btZLtbzP0x8B/tNfAv4oeIoPCXgH4l6H4p8RXNq99DpOmlyxTTwJrskygKqLGQeSK9Nr8jv+Ca8C2/7UWiQ/2l9vki8Iaikh8phtMaaSjANc43chun933FfrjU1YKLVjTA4mWIg5SSTUraX7J9fUKKKKxPSCiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD//W+5aKKK8c/SwooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooA8X/bP/5NX+OXJ/5ER+g/2rHH4V+Wv7Kf7Qfhv9m74rar47vtC1zxTBL4cuvDz6dbTxwkNrknh65Rhc3TMrRJ/YTjHU/aB0wa/Yf4q/DzTPiz8O/F3w31m/v9M0rxjpB0a/v9LC+aiymCZzaC8DJ537kD5gR81fJz/wDBKL4Mu0jt8SfiazStukJtLPnPznOIf72fzrqpTiotS6nh43D1p1YzpL4UtbrdNvqZH/D2bwL5Jn/4U/4u8pZfJLf8JVb4ywaQZ752o35U5v8AgrL4EWGKY/B/xcI5mKxufFVvz5Hl+Zj0I82Pr/erV/4dR/BsRGEfEn4m+UZfOKfZrPqoaMceT12MR+NK3/BKT4NtFFC3xJ+JpihYtGn2Wz4M/l+Zj9z1PlR/981X7r+rmf8At/l/5IfSn7P/AMZ7D4/fDPTviTpmhX3hu01LVJ9KTStRvFkdToUkumzF7iz+Rw0kTEBenqa+XPjf/wAE2/EHxg+LHjv4j2/xW8O6HD4z1xtTt9MuvCEsrwi9jstLcPeW8saXDhLQNnZ1fvX1V8C/g1ofwF+Hen/Dfw9q+sa5penanPqkWo64qCUtrryaldCVdMEcYjFxM+NqjivQQcEHuG3DP+zg8/lWHPyybj/SPSdD21KMayvJWb1t71rdD4PuP+CnfgzwDcP4GvvhX4nvrvwfK3hKe/t/EkCrK3hhpfD8720V1h4rd7nTZWAcAgMKWH9uLwx+1lBqX7OOheA9e8Ial8ZNIn8B2nivVNZimitW1WLU7jfd6bpuJL1Ft7C4wilckAbhnNdF4j/4JefCPxN4g1rxHe/ET4jw3euazNrc8EFtaFUbWJLvVrgWzXMTv9nW5vZsbiTjHJrd+Ef/AATr+GPwd+IvhT4kaD468e6lqfhLVP7WtNO1S3thFIxTUNNxeHTY45Ngg1K4PysOcda2vT36/Pc85QxjfLK3s9n8Pw7Pz2+Zl/sv/sH65+z58WY/iVf/ABH0LxPb/wBiXWlyaTpvheSBi3iIWILLdXsk67EaxT5cD/WHmsf/AIKtiE/Bz4bi4aVIf+FmP5jQoCf+PPxX9xJCoY59SK+2xwAPSvJv2jf2cvC/7SvhfQfCvivX/EHh+z8P+ID4htrnw6kZdmeO/wBHZbhNZWVDbfZtRnPC5yo5rONS81KR21MIo0Z06S+LWzfXTv6HzJ/wSYEA8E/GQW7TPF/wlVnsaeMA48iX7yxFgDu3dD6V95nofpXjn7N37MPhL9mXS/FWk+E/EXiTxDb+LNRi1K8k8RxxAodLSWxiFoNGWFfKMMi53A8x+5r2Q8gj1qakrybWxpgqUqVGMJaSV79erPxb/bzFmf2rPjSZpLtZxraeQsMIKn/QfCH+tkkIKDOegPFfrf8ACvH/AApn4e9SP+FZ23J/697XqOxxXhPxi/4J4fDH4z/EbxX8Ste8dePdJ1XxddLd3unaRDbmJDBFp2hf6HJqMckqK1ppkBOXPLHGK+lPDnhy38NeE9D8JWtzcXVroXh+Pw9BeXIG9109I9ORp1h2oLgxxgnaAMnoK1nNOKS3X+RyYTDVKdarOS92V7arrK6/A/CL4Q+ONF+GnxQ+Hnj26tdV1Q+E/ENt4gudKt0RfMGmhHkW3vJ2xCSG4Zx26en6AH/grZ8PySf+FReLeT/0NVv3rXH/AASh+DKlCPiR8TiY1CKzW1nnEYCJl2hJYhFHJpP+HT3wY/6KN8S//AWz/wDjNaynTlv0PPoYbGUb8llffWL2v3v3Oc1b4z6P/wAFJbGb4BeFNKvvhbqGigfE6fxH4jlS8jdPDT2ekSRR6fojRSR3T3PiS2beWwFtXHVhXtf7HX7Iepfstz/ECa/8baV4uXxraWlrBHpmgvb+T/wjjeI7iQzG+ec3RkOvAcFcfZu+eLP7O37D/wAPf2bvHGoePPCni3xhrupaj4Xk8KS2evwwCMJqMmj6pMyf2NHC5uhNotuBliMStx0I+ja55zVuWPws9XD4eTkqtdfvU9Hfpa2y06s+a/2mv22vDf7M/jHRfB+t+BNd8Tza14bHiKLUNM1iOJVDPc6cVkj1DlpQ9upyP+evsa/Mr9qH4xeH/jl8YdS+KMGla34ctdd0y2a30ido5WX+yEfTcy3luyq4drcsAo4D1+oX7Rn7FXgL9pTxdpHjDxZ4u8YaDeaN4eHhy2sfD8UBjKo9zqDNKNYSVvtJluAODjEQ4GTnyuX/AIJSfByYRCT4lfE1xDCLeINa2fATeygfufWR/wA60pyhFJ9epx4yjiqzcVZ073WsV0+/qzzv4U/8FLfBnwt+GHw/+HF38LvFOrXfgXwVB4en1GDxBAgm/siOBS8VnIXaCN4gG2kkjdjkjFffHji5W9+GHjC92NGl58P7i7EZOSPtVveTgE8BmAkx+FfJcv8AwSl+Ds7O8nxK+J5kki8lpPs9nnGFthhkhBX9yAOOeK+x9R0CDUfC994Wknnitb/w83h2S6jUbwtzG+lOyK/ym4ETlsEYyKzqOL1jvfXc68LHEJSjV+FRtH4fNdP1Pxv/AGExZj9qr4LGKS6a4Ou/v1lhAUf6D4tx5UiEl/m9QK/aQdB9K+U/hB/wTw+GXwa+I3hP4k6D478farqfhG8N5Z6fq8NsI5C0WoaIovH06OOVlFpqU+MP1AzmvqynWkpNWFl2HnRjJTVm3dap9PK54H+17+zNqX7Tnhbwh4c07xbpvhJvDPiCTWprnUtGacSC9iutI2pDZNCYWH2pm3bv4BX5m/tVfsryfsx6h4O0PWvGVr4oTxFpc+tw3Gh6A0Xl/Y30jTnWeHVZJPPZmuUYMrDHl4wc5H7XV4N+0j+x/wCCP2mtW8Mat4t8U+K/D8vhfS5NJtIPDsUJV11N7O+mN2NaSb94JbKHGzHQ+tFOpy2T+EWOwSqpzir1Xa2vouumxyv/AATdC/8ADL+keWWK/wDCc6gFMi4P+uYLuCZAbbjv+deefHj/AIJv698Z/i344+JNt8VfD+gweMdW+3waXd+EZZXhEkWmaK4e9t5Y0uG26eGHyf8ALTvivqP4D/BbQvgD8PbX4c+HNY1nXdMtdXm1hdQ15UEpbW2F5ch10tY4/KE27GFHBr0QHBDf3W3f984P9Kl1LSbj1NYYWM6EKdVfCtk+uq3XqfB5/wCClvg74azJ8NLz4W+J9Vv/AALKfAk2o2viKFEnfwo0nhid7W2uvngt5LrTZWCvyA4z61x3xd/4KZ+CfiP8MPiN8O7b4X+J9Ju/Gng658KxajP4hgcRHV0nsQ0trAQ1wiM5JVSCdteseJv+CYfwl8T+Kdd8V3fxE+I9tfa74gm8RSw21valY31mW71qcWr3UTubdbu8lxvJOAOtZR/4JQ/BouZD8SPiYXZizN9ls/48ls/ufVj+dbJ0t+u/U4JQxrTirctrfY22/I+af+Ca0llN+1LpNxZvdsJ/CupTut1ABgyppTgKYS24YY88dPy/XOvmb4C/sHfDr9n34hWXxF8MeNPG2s6lZaXNpSadrcNuIiutrDb3Jf8AsiOFzMBbwkfNj5Pc19M1lVmpNW2sdmX0J0YSU1ZuV909LJdPQKKKKwPVCiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD//1/uWiiivHP0sKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAP/Q+5aKKK8c/SwooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooA/9H7looorxz9LCiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD/0vuWiiivHP0sKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAP/T+5aKKK8c/SwooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooA/9T7looorxz9LCiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD/1fuWiiivHP0sKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAP/W+5aKKK8c/SwooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooA/9f7looorxz9LCiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD/2Q=='], { height: 450 })
            .then((src) => setSrc(src))
            .catch(error => console.log(error))
    }, []);

    // downloads merged image as png upon button click
    const downloadImage = () => {
        saveAs(src, "artist-art.png");
    }
    return (
        <div>
            <Header />
            <Navigation />
            <img className="art" src={src} alt=""></img>
            <button className="btn2" type="button" onClick={downloadImage}>Download Image</button>
            <Footer></Footer>
        </div>
    );
}

export default Artist;