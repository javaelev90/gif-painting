let videotag = undefined;
let imagetag = undefined;
let config = undefined;
let videoDuration = undefined;
let listOfFileNames = [];

startPresenter = async () =>
{
    console.log("Started");
    imagetag = document.getElementById("imagetag");
    videotag = document.getElementById("videotag");
    config = await getFile("js/config.json");
    listOfFileNames = await populateNameArray('js/filenames.json');

    videotag.onloadedmetadata = function() {
        videoDuration = videotag.duration;
    }

    runPresenter();
}

runPresenter = async () => {
    let filename = "./downloads/" + listOfFileNames.random();
    let configDuration = config["loop_timer"];
    let duration = configDuration;
    let postfix = filename.split(".");

    postfix = postfix[postfix.length - 1];

    if(postfix === "gif"){
        toggleTag(filename, imagetag, videotag);
        duration = await getMediaDuration(filename);    
    } else {
        toggleTag(filename, videotag, imagetag);
        duration = videoDuration;
    }

    let nextTimeout = configDuration;
    if(duration * 1000 > configDuration) {
        nextTimeout = duration * 1000;
    }

    setTimeout(runPresenter, nextTimeout);
}   

getMediaDuration = (filename) => {
    return fetch(filename)
        .then(res => res.arrayBuffer())
        .then(ab => isGifAnimated(new Uint8Array(ab)));
}

toggleTag = (src, showTag, hideTag) => {
    hideTag.style.display = "none";
    showTag.style.display = "block";
    showTag.src = src;
}

populateNameArray = async (filename) => {
    return $.getJSON(filename)
    .then((json) => {
        array = [];
        json["contents"].forEach((element) => {
            array.push(element["name"]);
        });
        return array;
    });
}

getFile = async (filename) => {
    response = await fetch(filename);
    json = await response.json();
    return json;
}

/** @param {Uint8Array} uint8 */
function isGifAnimated (uint8) {
  let duration = 0
  for (let i = 0, len = uint8.length; i < len; i++) {
    if (uint8[i] == 0x21
      && uint8[i + 1] == 0xF9
      && uint8[i + 2] == 0x04
      && uint8[i + 7] == 0x00) 
    {
      const delay = (uint8[i + 5] << 8) | (uint8[i + 4] & 0xFF)
      duration += delay < 2 ? 10 : delay
    }
  }
  return duration / 100
}