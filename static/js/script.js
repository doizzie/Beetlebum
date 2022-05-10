const gallery = document.querySelector('.gallery');
const galleryMovie = document.querySelector('.galleryMovie');
const loader = document.querySelector('.loader');
const activeArticle = document.querySelector('.activeArticle');
let currentPage = 1;
let totalArticles = 0;
let currentUrl = "/arc";
let defaultUserState = "offline";
let defaultGenre = "";

$(document).ready(function () {

  // loadArticles(currentUrl);
  $('.first-button').on('click', function () {
    $('.animated-icon1').toggleClass('open');
  });
  $('.second-button').on('click', function () {
    $('.animated-icon2').toggleClass('open');
  });
  $('.third-button').on('click', function () {
    $('.animated-icon3').toggleClass('open');
  });
});


window.addEventListener('scroll', () => {
  const {
      scrollTop,
      scrollHeight,
      clientHeight
  } = document.documentElement;
  if (scrollTop + clientHeight >= scrollHeight && currentPage <= 500) {
      // currentPage++;
      // loadArticles(currentUrl);

      // console.log(currentPage);
  }
}, {
  passive: true
});

const hasMoreArticles = (page, total) => {
  const startIndex = (page - 1) * 20 + 1;
  return total === 0 || startIndex < total;
};



// function searchForArticles(){

//   url = "/arc"; // + genre + "/";
//   currentUrl = url;
//   loadArticles(url);
// }

function searchForArticles(genre){
  // if (genre == "movie")
  //   url ="/moviearc";
  // if (genre == "music")
  //   url ="/arc";
  defaultGenre = genre;
  url = "/" + genre + "arc";
  currentUrl = url;
  loadArticles(url);
}

function searchForPopular(){
  url = "/getPopular/";
  console.log("searching");
  currentUrl = url;
  loadPopArticles(url);
}

function searchForRandom(){
  url = "/getRandom/";
   // console.log("searching");
  currentUrl = url;
  loadRandomArticles(url);
}



function topPicks(id){
  console.log("Top picks - " + id);
  document.getElementById("indexPageContent").innerHTML = "";
  loadOneArticle(id);
}
// function openRecommended(id){
//     // transitionToPage('articles.html');
//     // document.getElementById("activeArticle").innerHTML = "";
//     // document.getElementById("gallery").innerHTML = "";
//     loadOneArticle(id);
// }


// SIMILAR ARTICLES

const addSimilarArticles = (articles1) => {
  mv = JSON.parse(articles1);
  mv.forEach(addSimilarArticle);
};

const loadSimilarArticles = async (ratio, value) =>{
  try {
          url = "/getSimilarArticles/" + ratio + "/" + value;
          console.log(url);
          const response = await $.get(url);
          console.log(response);
          if (response !== null){
            prefix = "<div class=afterarctext>If you liked this, you might also enjoy:</div>";
            $("#activeArticle").append(prefix);
          }
          addSimilarArticles(response);
          totalArticles = response.totalArticles;
  } catch (error) {
      console.log(error.message);
  } finally {
  }
};


function addSimilarArticle(value){

    mytitle = value.title;
    id = value.articleId;
    console.log(id);

    // var imageUrl = urlCreator.createObjectURL(value.img);
    // img ;
    imageUrl = value.img;
    summary = value.summary;
    articleGenre = defaultGenre;
    article = "<div  class=\"oneArc col-2\" onClick=\"loadOneArticle(" + value.articleId + ")\" >" + "<p class=arcGenre>" + articleGenre + "</p> <p class=\"arcTitle\">" + mytitle + "<p id=\"articleImgId_" + value.articleId + "\" class=image></p> <p class=\"summaryArc\">" + summary + "</p> </div>";
    // }
    // if (defaultGenre == "music")
    //   $("#galleryMusic").append(article);
    // else if (defaultGenre == "movie")
    //   $("#galleryMovie").append(article);
    // else if (defaultGenre == "book")
    //   $("#galleryBook").append(article);
    // else 
    // if (lastId !=  value.articleId)
      $("#activeArticle").append(article);
      loadImages(id);
}



// ONE ARTICLE

const addMainArticles = (articles1) => {
  mv = JSON.parse(articles1);
  mv.forEach(addOneArticle);
};


const loadOneArticle = async (id) => {
  try {
          // $("#gallery").removeChild();
          // window.location.reload();
          url = "/getOneArticle/" + id;
          // closeActiveWindow();
          console.log(url);
          const response = await $.get(url);
          console.log(response);
          addMainArticles(response);
          totalArticles = response.totalArticles;
  } catch (error) {
      console.log(error.message);
  } finally {
  }
};

function addOneArticle(value){
    // $("#activeArticle").innerHTML= "";
    document.getElementById("activeArticle").innerHTML = "";
    if (document.getElementById("gallery") != null)
        document.getElementById("gallery").innerHTML = "";
    mytitle = value.title;
    id = value.articleId;

    console.log(id);

    // var imageUrl = urlCreator.createObjectURL(value.img);
    // img ;
    // imageUrl = value.img;

    var genres = "";
    if (value.movieTag == 1) genres = genres + "  movies; ";
    if (value.musicTag  == 1) genres = genres + "  music;  ";
    if (value.bookTag  == 1) genres = genres + "  books;  ";
    if (value.theBestOfAll  == 1) genres = genres + "  the best of all;  ";
    if (value.hiddenGems  == 1) genres = genres + "  hidden gems;  ";
    if (value.newReleases  == 1) genres = genres + "  new releases;  ";

    summary = value.summary;
    articleGenre = defaultGenre;
    article1 = "<div id=\"actArc\" class=\"oneArc mainArc col-10\" >" + "<p class=arcGenre>" + genres + "</p> <p class=\"arcTitle\">" + mytitle + "<p id=\"articleImgId_" + value.articleId + "\" class=\"col-12 image\"></p> <p class=\"summaryArc\">" + summary + ". " + summary + ". " + summary + ". " + summary + ". " + summary + ". " + summary + ". " + summary + "</p> <div id=actsim></div> </div>";

    

    var ratio = value.feelGood - value.deepThinking;

    // var otherArticles = document.getElementById("gallery");
    var carousels = document.getElementById("smallCarousels");
    // if(otherArticles.classList.contains("dontshow")){
    //   otherArticles.classList.remove("dontshow");
    // }
    if (carousels !== null){
      if(carousels.classList.contains("dontshow")){
        carousels.classList.remove("dontshow");
      }
      // otherArticles.classList.add("dontshow");
      carousels.classList.add("dontshow");
  }
    

    visits = value.visits + 1;
    // addVisits(id, )
    $("#activeArticle").append(article1);
    // loadImages(value.articleId);
    loadBigImages(value.articleId);
    loadBigImages(value.articleId);
    loadBigImages(value.articleId);
    loadSimilarArticles(ratio, value.articleId);

}


// All articles
const addArticles = (articles) => {
  mv = JSON.parse(articles);
  mv.forEach(addArticle);
};


const loadArticles = async (url) => {
  try {
          console.log(url);
          const response = await $.get(url);
          console.log(response);
          addArticles(response);
          totalArticles = response.totalArticles;
  } catch (error) {
      console.log(error.message);
  } finally {
  }
};


function addArticle(value){
    // $("#actArc").remove();
    mytitle = value.title;
    id = value.articleId;
    console.log(id);

    // var imageUrl = urlCreator.createObjectURL(value.img);
    // img ;
    // imageUrl = value.img;
    summary = value.summary;
    articleGenre = defaultGenre;
    article = "<div class=\"oneArc col-2\" onClick=\"loadOneArticle(" + value.articleId + ")\" >" + "<p class=arcGenre>" + articleGenre + "</p> <p class=\"arcTitle\">" + mytitle + "</p> <p id=\"articleImgId_" + value.articleId + "\" class=image></p> <p class=\"summaryArc\">" + summary + "</p> </div>";
   // <img class=\"arcImg col-12\" src=\" data:image/png;base64," + imageUrl + "\"/> 
    // }
    // if (defaultGenre == "music")
    //   $("#galleryMusic").append(article);
    // else if (defaultGenre == "movie")
    //   $("#galleryMovie").append(article);
    // else if (defaultGenre == "book")
    //   $("#galleryBook").append(article);
    // else 
      $("#gallery").append(article);
    loadImages(id);
}


// Get images
const addImg = (id, images) => {
  mv = JSON.parse(id, images);
  // mv.forEach(addImages);
  addImages(mv.id, mv.images);
};


const loadImages = async (id) => {
  try {
          url = "/getImg/" + id;
          console.log(url);
          const response = await $.get(url);
          // console.log(response);
          console.log(id);
          // mv = JSON.parse(response);
          // mv = JSON.stringify(response);
          addImages(id, response);
          // totalArticles = response.totalArticles;
  } catch (error) {
      console.log(error.message);
  } finally {
  }
};


function addImages(id, value){
    // console.log(value);
    // var pht = document.getElementById("articleId_" + id);
    photo ="<img class=\"arcImg col-12\" src=\" data:image/jpeg;base64, " + value + "\"/>";
    $("#articleImgId_" + id).append(photo);
}

function addBigImages(id, value){
    // console.log(value);
    // var pht = document.getElementById("articleId_" + id);
    photo ="<img class=\"arcImg col-4\" src=\" data:image/jpeg;base64, " + value + "\"/>";
    $("#articleImgId_" + id).append(photo);
}

const loadBigImages = async (id) => {
  try {
          url = "/getBigImg/" + id;
          console.log(url);
          const response = await $.get(url);
          // console.log(response);
          console.log(id);
          // mv = JSON.parse(response);
          // mv = JSON.stringify(response);
          addBigImages(id, response);
          // totalArticles = response.totalArticles;
  } catch (error) {
      console.log(error.message);
  } finally {
  }
};

// Popular articles

const addPopArticles = (articles) => {
  mv = JSON.parse(articles);
  mv.forEach(addArticle);
};


const loadPopArticles = async (url) => {
  try {
          // url = "/getPopular/";
          console.log(url);
          const response = await $.get(url);
          console.log(response);
          addPopArticles(response);
          totalArticles = response.totalArticles;
  } catch (error) {
      console.log(error.message);
  } finally {
  }
};


//RANDOM Article
const addRandomArticles = (articles) => {
  mv = JSON.parse(articles);
  mv.forEach(addArticle);
};


const loadRandomArticles = async (url) => {
  try {
          // url = "/getPopular/";
          console.log(url);
          const response = await $.get(url);
          console.log(response);
          addRandomArticles(response);
          totalArticles = response.totalArticles;
  } catch (error) {
      console.log(error.message);
  } finally {
  }
};




function closeActiveWindow(){
  $("#activeArticle").innerHTML=``;
}

window.transitionToPage = function(href) {
    document.querySelector('body').style.opacity = 0
    setTimeout(function() { 
        window.location.href = href
    }, 0)
}
document.addEventListener('DOMContentLoaded', function(event) {
    document.querySelector('body').style.opacity = 1
})

 // function randomovie(){
 //    var ltit = document.getElementsByClassName("ltitle");
 //    var lpi = document.getElementsByClassName("lpic");
 //    var lem = document.getElementById("lemon");
 //    var lem2 = document.getElementById("lemon2");
 //     for (var i=0; i < ltit.length; i++){
 //        if(ltit[i].classList.contains('closed')) {
 //           ltit[i].classList.remove('closed');
 //        }
 //        if(ltit[i].classList.contains('openli')) {
 //           ltit[i].classList.remove('openli');
 //        }
 //        if(lpi[i].classList.contains('openph'))
 //          lpi[i].classList.remove('openph');
 //      }
 //     var ran;
 //     ran = Math.floor(Math.random() * ltit.length);
 //     lem.classList.add("closed");
 //  lem2.classList.add("oplem");
 //   for(var i=0; i < ltit.length; i++){
 //        if (i != ran)
 //          ltit[i].classList.add('closed');
 //      if (i == ran){
 //        lpi[i].classList.add('openph');
 //        ltit[i].classList.add('openli');
 //      }
//    }
// }

function openLogin(){
  var logButton = document.getElementById("loginButton");
  var logForm = document.getElementById("loginForm");
  var regForm = document.getElementById("registerForm");
  var regButton = document.getElementById("registerButton");
  if(logForm.classList.contains("dontshow")){
    logForm.classList.remove("dontshow");
  }
  regForm.classList.add("dontshow");
  logButton.classList.add("dontshow");
  regButton.classList.add("dontshow");
}

function openRegister(){
  var logButton = document.getElementById("loginButton");
  var regForm = document.getElementById("registerForm");
  var regButton = document.getElementById("registerButton");
  var logForm = document.getElementById("loginForm");
  if(regForm.classList.contains("dontshow")){
    regForm.classList.remove("dontshow");
  }
  logButton.classList.add("dontshow");
  logForm.classList.add("dontshow");
  regButton.classList.add("dontshow");
}

function checkWatchlist(){
  var checkButton = document.getElementById("checkedWatchlist");
  var uncheckButton = document.getElementById("uncheckedWatchlist");
  if(checkButton.classList.contains("dontshow")){
    checkButton.classList.remove("dontshow");
  }
  uncheckButton.classList.add("dontshow");
}

function uncheckWatchlist(){
  var checkButton = document.getElementById("checkedWatchlist");
  var uncheckButton = document.getElementById("uncheckedWatchlist");
  if(uncheckButton.classList.contains("dontshow")){
    uncheckButton.classList.remove("dontshow");
  }
  checkButton.classList.add("dontshow");
}
function checkSeen(){
  var checkButton = document.getElementById("checkedSeen");
  var uncheckButton = document.getElementById("uncheckedSeen");
  if(checkButton.classList.contains("dontshow")){
    checkButton.classList.remove("dontshow");
  }
  uncheckButton.classList.add("dontshow");
}

function uncheckSeen(){
  var checkButton = document.getElementById("checkedSeen");
  var uncheckButton = document.getElementById("uncheckedSeen");
  if(uncheckButton.classList.contains("dontshow")){
    uncheckButton.classList.remove("dontshow");
  }
  checkButton.classList.add("dontshow");
}

function showTheFooter(){
  var foot1 = document.getElementById("footerInfo1");
  var foot2 = document.getElementById("footerInfo2");
  var cred = document.getElementById("creatorNames");
  if(foot2.classList.contains("dontshow")){
    foot2.classList.remove("dontshow");
    cred.classList.remove("dontshow");
    foot1.classList.add("dontshow");
  } else if (foot1.classList.contains("dontshow")){
    foot1.classList.remove("dontshow");
    foot2.classList.add("dontshow");
    cred.classList.add("dontshow");
  }
}

function changeUserState(){
  var onlineState = document.getElementById("userStateOnline");
  var offlineState = document.getElementById("userStateOffline");

  var accountOnline = document.getElementById("onlineUser");
  var accountOffline = document.getElementById("offlineUser");
  if(onlineState.classList.contains("dontshow")){
    onlineState.classList.remove("dontshow");
    accountOnline.classList.remove("dontshow");
    offlineState.classList.add("dontshow");
    accountOffline.classList.add("dontshow");
  } else if (offlineState.classList.contains("dontshow")){
    onlineState.classList.add("dontshow");
    accountOnline.classList.add("dontshow");
    offlineState.classList.remove("dontshow");
    accountOffline.classList.remove("dontshow");
  } 
}

// $(document).ready(function(){
//   $.ajax ({
//     url: "http://127.0.0.1:5000/getNames/",
//     type: "GET",
//     success: function(name){
//       console.log(name);
//     },
//     error: function(error){
//       console.log(error);
//     }
//   })
// })

// $(document).ready(function(){
//     var selectvalue = document.getElementById("selectvalue"), test = {{ name | tojson }};
//       //The increment operator (++) increments (adds one to) its operand and returns a value.
//       for(var i = 0; i < test.length; i++) // This line checks for the length of the data you feeding in i.e the no of items
//            {
//   var selection = document.createElement("OPTION"), // This line creates a variable to store the different values fed in from the JSON object "TEST"
//   txt = document.createTextNode(test[i]); // This just reads each value from the test JSON variable above
//   selection.appendChild(txt); // This line appends each value as it is read.
//   selection.setAttribute("value",test[i]); // This line sets each value read in as a value for the drop down
//   selectvalue.insertBefore(selection,selectvalue.lastChild); //This reads eah value into the dropdown based on the order in the "TEST" above.
//    }
//  });

// var selectvalue = document.getElementById("selectvalue"), test = {{ name | tojson }};
//       //The increment operator (++) increments (adds one to) its operand and returns a value.
//       for(var i = 0; i < test.length; i++) // This line checks for the length of the data you feeding in i.e the no of items
//            {
//   var selection = document.createElement("OPTION"), // This line creates a variable to store the different values fed in from the JSON object "TEST"
//   txt = document.createTextNode(test[i]); // This just reads each value from the test JSON variable above
//   selection.appendChild(txt); // This line appends each value as it is read.
//   selection.setAttribute("value",test[i]); // This line sets each value read in as a value for the drop down
//   selectvalue.insertBefore(selection,selectvalue.lastChild); //This reads eah value into the dropdown based on the order in the "TEST" above.
//    }

// const response = JSON.parse(json_data) => {//JSON response from server
//     var table = document.getElementById("table");
//     table.innerHTML = ""; //making sure we don't present corrupt data
//     response.forEach((result, index) => {
//         const content = `    <tr>
// <td>${result['col1']}</td>
// <td>${result['col2']}</td> </tr>}`;
//         table.innerHTML += content;
//     })
// }

 // function registerValidation() {
 //        var name = document.forms["RegForm"]["Username"];
 //        var email = document.forms["RegForm"]["email"];
 //        var password = document.forms["RegForm"]["Password"];
  
 //        if (name.value == "") {
 //            window.alert("Please enter your username.");
 //            name.focus();
 //            return false;
 //        }
  
 //        if (email.value == "") {
 //            window.alert(
 //              "Please enter a valid e-mail address.");
 //            email.focus();
 //            return false;
 //        }
 //        if (password.value == "") {
 //            window.alert("Please enter your password");
 //            password.focus();
 //            return false;
 //        }
  
 //        return true;
 //    }