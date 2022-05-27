const gallery = document.querySelector('.gallery');
const galleryMovie = document.querySelector('.galleryMovie');
const loader = document.querySelector('.loader');
const activeArticle = document.querySelector('.activeArticle');
let currentPage = 1;
let totalArticles = 0;
let currentUrl = "/arc";
let defaultUserState = "offline";
let defaultGenre = "";

var wasClickedLike = 0;
var wasClickedHappy = 0;
var wasClickedThink = 0;

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
    if (document.getElementById("searching").classList.contains("dontshow"))
      $("#activeArticle").append(article);
    else $("#activeArticle1").append(article);
      // $("#activeArticle").append(article);
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
    if (document.getElementById("activeArticle") != null)
      document.getElementById("activeArticle").innerHTML = "";
    if (document.getElementById("activeArticle1") != null)
      document.getElementById("activeArticle1").innerHTML = "";
    if (document.getElementById("gallery") != null)
        document.getElementById("gallery").innerHTML = "";
    if (document.getElementById("gallery1") != null)
        document.getElementById("gallery1").innerHTML = "";
    if (document.getElementById("biggerSearch") != null)
        document.getElementById("biggerSearch").classList.add("dontshow");
    mytitle = value.title;
    id = value.articleId;

    console.log(id);


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

    if (document.getElementById("searching").classList.contains("dontshow"))
      $("#activeArticle").append(article1);
    else $("#activeArticle1").append(article1);

    ratings = "<div id=\"rating\"> <p>Tell us what you think about this article:</p><i id=\"thumbsUp\" class=\"fa-solid fa-thumbs-up\" onclick=\"likeArticle(" + value.articleId + ")\"></i><i id=\"thumbsDown\" class=\"fa-solid fa-thumbs-down fa-flip-horizontal\" onclick=\"dislikeArticle(" + value.articleId + ")\"></i> <p>This article made you:</p> <div id=\"happy\" onclick=\"happyArticle(" + value.articleId + ")\" class=\"moodbuttn\">Feel Good</div> <div id=\"think\" onclick=\"thinkArticle(" + value.articleId + ")\" class=\"moodbuttn\">Think Deeper</div> <p id=\"smallerComm\">(you can select both if apply)</p></div>";

    if (document.getElementById("searching").classList.contains("dontshow"))
      $("#activeArticle").append(ratings);
    else $("#activeArticle1").append(ratings);
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
    mytitle = value.title;
    id = value.articleId;
    console.log(id);
    if (id) 
      document.getElementById("foundNothing").classList.add("dontshow");
    summary = value.summary;
    articleGenre = defaultGenre;
    article = "<div class=\"oneArc col-2\" onClick=\"loadOneArticle(" + value.articleId + ")\" >" + "<p class=arcGenre>" + articleGenre + "</p> <p class=\"arcTitle\">" + mytitle + "</p> <p id=\"articleImgId_" + value.articleId + "\" class=image></p> <p class=\"summaryArc\">" + summary + "</p> </div>";
    

    if (document.getElementById("searching").classList.contains("dontshow"))
      $("#gallery").append(article);
    else $("#gallery1").append(article);
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
          // addImageByLink(id, response);
          // totalArticles = response.totalArticles;
  } catch (error) {
      console.log(error.message);
  } finally {
  }
};


function addImageByLink(id, value){
  photo ="<img class=\"arcImg col-12\" src=\" " + value + "\"/>";
  $("#articleImgId_" + id).append(photo);
}

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


const goGet = async (url) => {
  try {
          console.log(url);
          const response = await $.get(url);
          console.log(response);
          // addArticles(response);
          // totalArticles = response.totalArticles;
  } catch (error) {
      console.log(error.message);
  } finally {
  }
};



function likeArticle(articleId){
  var thumbs = document.getElementById("thumbsUp");
  var thumbs2 = document.getElementById("thumbsDown");
  if (wasClickedLike == 0){
      if(thumbs.classList.contains("itsBeenClicked")){
          // carousels.classList.remove("dontshow");
          if (thumbs.classList.contains("itHasntBeenClicked"))
            thumbs.classList.remove("itHasntBeenClicked");
      } else {
        url = "/addLike/" + articleId;
        goGet(url);
        thumbs.classList.add("itsBeenClicked");
        thumbs.classList.remove("itHasntBeenClicked");
        thumbs2.classList.remove("itsBeenClicked");
        thumbs2.classList.add("itHasntBeenClicked");
        wasClickedLike++;
      }
  }
}

function dislikeArticle(articleId){
  var thumbs = document.getElementById("thumbsUp");
  var thumbs2 = document.getElementById("thumbsDown");
  if (wasClickedLike == 0){
    if(thumbs2.classList.contains("itsBeenClicked")){
        // carousels.classList.remove("dontshow");
        if (thumbs2.classList.contains("itHasntBeenClicked"))
          thumbs2.classList.remove("itHasntBeenClicked");
    } else {
      url = "/addDislike/" + articleId;
      goGet(url);
      thumbs2.classList.add("itsBeenClicked");
      thumbs2.classList.remove("itHasntBeenClicked");
      thumbs.classList.remove("itsBeenClicked");
      thumbs.classList.add("itHasntBeenClicked");
      wasClickedLike++;
    }
  }
}

function happyArticle(articleId){
  var happy = document.getElementById("happy");
  // var thumbs2 = document.getElementById("think");
  if (wasClickedHappy == 0){
    if(happy.classList.contains("itsBeenClicked")){
        // carousels.classList.remove("dontshow");
        if (happy.classList.contains("itHasntBeenClicked"))
          happy.classList.remove("itHasntBeenClicked");
    } else {
      url = "/addHappy/" + articleId;
        goGet(url);
      happy.classList.add("itsBeenClicked");
      happy.classList.remove("itHasntBeenClicked");
      // thumbs.classList.remove("itsBeenClicked");
      // thumbs.classList.add("itHasntBeenClicked");
      wasClickedHappy++;
    }
  }
  
}
function thinkArticle(articleId){
  var think = document.getElementById("think");
  // var thumbs2 = document.getElementById("think");
  if (wasClickedThink == 0){
    if(think.classList.contains("itsBeenClicked")){
        // carousels.classList.remove("dontshow");
        if (think.classList.contains("itHasntBeenClicked"))
          think.classList.remove("itHasntBeenClicked");
    } else {
      url = "/addThink/" + articleId;
        goGet(url);
      think.classList.add("itsBeenClicked");
      think.classList.remove("itHasntBeenClicked");
      // thumbs.classList.remove("itsBeenClicked");
      // thumbs.classList.add("itHasntBeenClicked");
      wasClickedThink++;
    }
  }
}


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



function getValueSearch(numb){
  var inputValue = 1;
  if (numb == 1)
    inputValue = document.getElementById("searchWord").value;
    // document.getElementById("searchWord").value = "";
  else if (numb == 2)
    inputValue = document.getElementById("searchWord1").value;
  // document.getElementById("searchWord").value;
  // inputValue = search;
  document.getElementById("PageWrapper").innerHTML = "";
  document.getElementById("gallery1").innerHTML = "";
  document.getElementById("activeArticle1").innerHTML = "";
  document.getElementById("searchWord1").value = "";
  document.getElementById("searchWord").value = "";
  search = document.getElementById("searching");
  searchBox = document.getElementById("biggerSearch");
  foundNothing = document.getElementById("foundNothing");
  if (search.classList.contains("dontshow")){
    search.classList.remove("dontshow");
    searchBox.classList.remove("dontshow");
  }
  if (foundNothing.classList.contains("dontshow"))
    foundNothing.classList.remove("dontshow");
  gogetSearch(inputValue);
}

const gogetSearch = async (word) => {
  try {
          // transitionToPage('/search.html');
          url = "/getByWord/" + word;
          console.log(url);
          const response = await $.get(url);
          console.log(response);
          // window.location.href = '/search.html';
          // if (response == "[]"){
          // prefix = "<div class=afterarctext>Unfortunately we found nothing</div>";
            // $("#searching").append(prefix);
          addArticles(response);
          totalArticles = response.totalArticles;
  } catch (error) {
      console.log(error.message);
  } finally {
  }
};

