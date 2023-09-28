let videotag = undefined;
let imagetag = undefined;
let config = undefined;
let listOfFileNames = [];

startPresenter = async () =>
{
    console.log("init");
    videotag = document.getElementById("videotag");
    imagetag = document.getElementById("imagetag");
    config = await getFile("js/config.json")
    listOfFileNames = await populateNameArray('js/filenames.json');
    setInterval(runPresenter, config["loop_timer"]);
}

runPresenter = () => {
    let filename = "./downloads/" + listOfFileNames.random();
    let postfix = filename.split(".");
    postfix = postfix[postfix.length - 1];

    if(postfix === "gif"){
        toggleTag(filename, imagetag, videotag);
    } else {
        toggleTag(filename, videotag, imagetag);
    }
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