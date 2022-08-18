var utubeObj;
var inputQuery = "";
var oReq;
var xac;
var countOfQuestions = 0;
var answerBody = [];
var questionIds = [];
var questionTitles = [];
var keywords = [];
var keySearch = "";
var qIds = "";
var category = "";
var input = document.getElementById("searchInput");
input.addEventListener("keyup", function(event) {
  if (event.keyCode === 13) {
    document.getElementById("scrollToTop").click();
    category = "" + document.getElementById("category").value;
    var parent = document.getElementById("content");
    while (parent.hasChildNodes()) {
      parent.removeChild(parent.firstChild);
    }
    parent.setAttribute("style", "display: none");
    document.getElementById("extraSpace").setAttribute("style", "display: none");
    parent = document.getElementById("video");
    while (parent.hasChildNodes()) {
      parent.removeChild(parent.firstChild);
    }
    parent.setAttribute("style", "display: none");
    inputQuery = "";
    countOfQuestions = 0;
    answerBody = [];
    questionIds = [];
    questionTitles = [];
    keywords = [];
    keySearch = "";
    qIds = "";
    document.getElementById("searchButton").click();
  }
});
function search() {
  inputQuery = document.getElementById("searchInput").value;
  if (category == "first") {
    oReq = new XMLHttpRequest();
    oReq.addEventListener("load", reqListener);
    oReq.open(
      "POST",
      `https://apis.paralleldots.com/v3/keywords?api_key=msHwZCkbUaNFDDBccyTtNLBdOmw7tQxf35w9lJU7sow&text=${inputQuery}`
    );
    oReq.send();
  } else {
    let recipeQuery = inputQuery.replace(/ /g, "+");
    oReq = new XMLHttpRequest();
    oReq.addEventListener("load", reqListener4);
    oReq.open(
      "GET",
      `https://api.edamam.com/search?q=${recipeQuery}&app_id=09078e75&app_key=c6041dc752216876b057b9f218247a63`
    );
    oReq.send();
    let utubeQuery = "how+to+cook+" + recipeQuery;
    var utubeReq = new XMLHttpRequest();
    utubeReq.open(
      "GET",
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${utubeQuery}&maxResults=10&type=video&videoCaption=closedCaption&key=AIzaSyCcF6P6u_VcX9RL72vB2KPVVV26EF68BIs`
    );
    utubeReq.addEventListener("load", ureqListener);
    utubeReq.send();
  }
}
function reqListener() {
  var obj = JSON.parse(this.responseText);
 // console.log(obj);
  // let i;
  // for (i in obj.keywords.keywords) {
  //    xac = obj.keywords.keywords[i];
    
  //   keySearch += "[" + xac.replace(/ /g, "-"); + "];";  
  // }
  keySearch=inputQuery.replace(/ /g, "-");
console.log(keySearch);
  let utubeQuery = inputQuery.replace(/ /g, "+");
  var utubeReq = new XMLHttpRequest();
  utubeReq.open(
    "GET",
    `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${utubeQuery}&maxResults=10&type=video&videoCaption=closedCaption&key=AIzaSyCcF6P6u_VcX9RL72vB2KPVVV26EF68BIs`
  );
  utubeReq.addEventListener("load", ureqListener);
  utubeReq.send();
  oReq = new XMLHttpRequest();
  oReq.addEventListener("load", reqListener1);
  oReq.open(
    "GET",
    `https://api.stackexchange.com/2.2/search/advanced?order=desc&sort=relevance&q=${inputQuery}&site=stackoverflow`
  );
  oReq.send();
}
function reqListener1() {
  var obj = JSON.parse(this.responseText);
  ///console.log(obj);
  let i;
  for (i in obj.items) {
    if (countOfQuestions >= 5) break;
    if (obj.items[i].is_answered === true) {
      questionIds[countOfQuestions] = obj.items[i].question_id;
      questionTitles[countOfQuestions] = obj.items[i].title;
      countOfQuestions++;
    }
  }
  oReq = new XMLHttpRequest();
  oReq.addEventListener("load", reqListener2);
  oReq.open(
    "GET",
    `https://api.stackexchange.com/2.2/search/advanced?order=desc&sort=relevance&q=${keySearch}&site=stackoverflow`
  );
  oReq.send();
}
function reqListener2() {
  var obj = JSON.parse(this.responseText);
  //console.log(obj);
  let i;
  for (i in obj.items) {
    if (countOfQuestions >= 10) break;
    let check = -1;
    for (let j = 0; j < countOfQuestions; j++) {
      if (questionIds[j] == obj.items[i].question_id) {
        check = 1;
        break;
      }
    }
    if (obj.items[i].is_answered === true && check == -1) {
      questionIds[countOfQuestions] = obj.items[i].question_id;
      questionTitles[countOfQuestions] = obj.items[i].title;
      countOfQuestions++;
    }
  }
  for (i = 0; i < countOfQuestions; i++) {
    qIds = qIds + questionIds[i] + ";";
  }
  qIds = qIds.substring(0, qIds.length - 1);
  console.log(qIds);
  var oReq1 = new XMLHttpRequest();
  oReq1.addEventListener("load", reqListener3);
  oReq1.open(
    "GET",
    `https://api.stackexchange.com/2.2/questions/${qIds}?order=desc&sort=votes&site=stackoverflow&filter=!-y(KwOdKR5Ga7mmruVArx2SJykc-M)3jKiDQBk1fq`
  );
  oReq1.send();
}
function reqListener3() {
  var obj = JSON.parse(this.responseText);
  console.log(obj);
  let i;
  for (i in obj.items) {
    let quid = obj.items[i].question_id;
    let j;
    for (j = 0; j < countOfQuestions; j++) {
      if (quid == questionIds[j]) {
        answerBody[j] = obj.items[i].answers[0].body;
        break;
      }
    }
  }
  var parent = document.getElementById("content");
  parent.setAttribute("style", "display:block");
  for (i = 0; i < countOfQuestions - 1; i++) {
    var newDiv = document.createElement("div");
    var newQuesDiv = document.createElement("div");
    newQuesDiv.setAttribute("class", "quesTitle");
    var newAnsDiv = document.createElement("div");
    newAnsDiv.setAttribute("class", "ansBody");
    newQuesDiv.innerHTML = "Ques. : " + questionTitles[i];
    newAnsDiv.innerHTML = "Answer :\n" + answerBody[i];
    newDiv.appendChild(newQuesDiv);
    newDiv.appendChild(document.createElement("br"));
    newDiv.appendChild(newAnsDiv);
    parent.appendChild(newDiv);
    parent.appendChild(document.createElement("br"));
    parent.appendChild(document.createElement("hr"));
    parent.appendChild(document.createElement("br"));
  }
  // var newDiv = document.createElement("div");
  // var newQuesDiv = document.createElement("div");
  // newQuesDiv.setAttribute("class", "quesTitle");
  // var newAnsDiv = document.createElement("div");
  // newAnsDiv.setAttribute("class", "ansBody");
  // newQuesDiv.innerHTML = "Ques. : " + questionTitles[i];
  // newAnsDiv.innerHTML = "Answer :\n" + answerBody[i];
  // newDiv.appendChild(newQuesDiv);
  // newDiv.appendChild(document.createElement("br"));
  // newDiv.appendChild(newAnsDiv);
  // parent.appendChild(newDiv);
  utubeDisplay();
  document.getElementById("scrollToResults").click();
}
function reqListener4() {
  var obj = JSON.parse(this.responseText);
  var parent = document.getElementById("content");
  parent.setAttribute("style", "display:block");
  var newDiv = document.createElement("div");
  let i;
  for (i in obj.hits) {
    if (i >= 10) break;
    var head = document.createElement("h3");
    var ingredientDiv = document.createElement("div");
    ingredientDiv.setAttribute("class", "recipe");
    var url = document.createElement("a");
    url.setAttribute("href", "" + obj.hits[i].recipe.url);
    url.setAttribute("target", "_blank");
    url.setAttribute("class", "toview");
    url.setAttribute("style", "color:blue");
    url.innerText = "View Recipe";
    var imageDiv = document.createElement("div");
    imageDiv.setAttribute("class", "image");
    var img = document.createElement("img");
    img.setAttribute("class", "pic");
    img.setAttribute("src", "" + obj.hits[i].recipe.image);
    var ul = document.createElement("ul");
    head.innerHTML = obj.hits[i].recipe.label;
    head.setAttribute("class", "quesTitle");
    let j;
    for (j in obj.hits[i].recipe.ingredients) {
      var li = document.createElement("li");
      li.innerHTML = obj.hits[i].recipe.ingredients[j].text;
      ul.appendChild(li);
    }
    var combinedDiv = document.createElement("div");
    imageDiv.appendChild(img);
    ingredientDiv.appendChild(ul);
    ingredientDiv.appendChild(url);
    combinedDiv.appendChild(ingredientDiv);
    combinedDiv.appendChild(imageDiv);
    combinedDiv.setAttribute("class", "ansBody");
    newDiv.appendChild(head);
    newDiv.appendChild(combinedDiv);
    parent.appendChild(newDiv);
  }
  utubeDisplay();
  document.getElementById("scrollToResults").click();
}
function ureqListener() {
  utubeObj = JSON.parse(this.responseText);
}
function utubeDisplay() {
  document.getElementById("extraSpace").setAttribute("style", "display:block");
  let parent = document.getElementById("video");
  parent.setAttribute("style", "display:block");
  for (i = 0; i < 10; i++) {
    let videoId = utubeObj.items[i].id.videoId;
    let newDiv = document.createElement("div");
    newDiv.setAttribute("class", "vidcon");
    let heading = document.createElement("h5");
    heading.setAttribute("class", "videotitle");
    heading.innerHTML = utubeObj.items[i].snippet.title;
    let frame = document.createElement("iframe");
    frame.setAttribute("class", "embedvideo");
    frame.setAttribute("src", `https://www.youtube.com/embed/${videoId}`);
    frame.setAttribute("frameborder", "0");
    frame.setAttribute("allow", "autoplay;encrypted-media");
    frame.setAttribute("allowfullscreen", "true");
    newDiv.append(heading);
    newDiv.append(frame);
    parent.append(newDiv);
    parent.append(document.createElement("br"));
  }
}
