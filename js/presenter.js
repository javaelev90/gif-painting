let videotag = undefined;
let imagetag = undefined;
let listOfFileNames = [];

let toggle = 0;
// Loop timer 
let loopTimer = 4000;

startPresenter = async () =>
{
    console.log("init");
    videotag = document.getElementById("videotag");
    imagetag = document.getElementById("imagetag");

    listOfFileNames = await populateNameArray('js/filenames.json');
    setInterval(runPresenter, loopTimer);
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


