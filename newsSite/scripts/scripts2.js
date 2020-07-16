$(document).ready(function () {
  var home = "https://content.guardianapis.com/search?section=uk-news&show-fields=headline,thumbnail,body&api-key=cf7bb976-9217-42bb-9cda-5804a5426c25";
  displayHeadlines(home);
  displayWeather();
  var latestNews = {};

  //current weather feature using openWeatherMap API
  function displayWeather() {
    //displays weather data for Belfast as default
    fetch("https://api.openweathermap.org/data/2.5/weather?q=Belfast,uk&units=metric&APPID=e293496d1d443a35892e8aa1a44ba9fb")
      .then(response => response.json())
      .then(data => {
        var nameValue = data['name'];
        var tempValue = data['main']['temp'];
        var minValue = data['main']['temp_min'];
        var maxValue = data['main']['temp_max'];
        var descValue = data['weather'][0]['description'];
        var iconValue = data['weather'][0]['icon'];
        var iconUrl = "https://openweathermap.org/img/w/" + iconValue + ".png";
        var description = string = descValue.charAt(0).toUpperCase() + descValue.substr(1, descValue.length).toLowerCase();

        $("#name").empty();
        $("#temp").empty();
        $("#min").empty();
        $("#max").empty();
        $("#desc").empty();
        $(".inputValue").val('');
        $("#name").append(nameValue);
        $("#temp").append("It is currently " + tempValue + "&#8451; in " + nameValue + ". |");
        $("#min").append(" The minimum temperature today is " + minValue + "&#8451;. |");
        $("#max").append(" The maximum temperature today is " + maxValue + "&#8451;. |");
        $("#desc").append(" Weather description: " + description + ".");
        $("#icon").attr('src', iconUrl);
      })

    //takes city user input's and adds it to api fetch request
    $("#submitCity").on("click", function () {
      var inputValue = document.querySelector(".inputValue");
      fetch("https://api.openweathermap.org/data/2.5/weather?q=" + inputValue.value + "&units=metric&APPID=e293496d1d443a35892e8aa1a44ba9fb")
        .then(response => response.json())
        // .then(data => console.log(data))
        .then(data => {
          var nameValue = data['name'];
          var tempValue = data['main']['temp'];
          var minValue = data['main']['temp_min'];
          var maxValue = data['main']['temp_max'];
          var descValue = data['weather'][0]['description'];
          var iconValue = data['weather'][0]['icon'];
          var iconUrl = "https://openweathermap.org/img/w/" + iconValue + ".png";
          var description = string = descValue.charAt(0).toUpperCase() + descValue.substr(1, descValue.length).toLowerCase();

          $("#name").empty();
          $("#temp").empty();
          $("#min").empty();
          $("#max").empty();
          $("#desc").empty();
          $(".inputValue").val('');
          $("#name").append(nameValue);
          $("#temp").append("It is currently " + tempValue + "&#8451; in " + nameValue + ". |");
          $("#min").append(" The minimum temperature today is " + minValue + "&#8451;. |");
          $("#max").append(" The maximum temperature today is " + maxValue + "&#8451;. |");
          $("#desc").append(" Weather description: " + description + ".");
          $("#icon").attr('src', iconUrl);
        })

        .catch(err => alert("Error: city not found"))
    })

  }

  //display news articles
  function displayHeadlines(url) {
    $.ajax({
      url: url,
      method: "GET",
      dataType: "json",
      success: function (data) {
        var output = "";
        latestNews = data.response.results;
        //loops through returned news articles and outputs them into Boostrap cards
        for (var i in latestNews) {
          date = moment(latestNews[i].webPublicationDate).format('MMM Do YYYY, h:mm a');
          $(".container .row").append(output += `
            <div class='col-md-4'> <div class='card mb-3' style='width:22rem; height:27rem;'> <img class='card-img-top' src="${latestNews[i].fields.thumbnail}" alt='Article thumbnail'></img><div class='card-body d-flex flex-column'><h5 class='card-title'>${latestNews[i].fields.headline}</h5><h6 class='card-subtitle mb-2 text-muted'>` + date + `</h6><a href='${latestNews[i].webUrl}' class='mt-auto btn btn-primary viewArticle'>View article</a></div></div></div>
            `);
        }
        //store JSON in localStorage
        localStorage.setItem('offline', JSON.stringify(latestNews));

        //if data was found, it gets displayed. if not then user is shown message that no articles were found.
        if (output !== "") {
          $(".container .row").html(output);
        } else {
          $('.container .row').empty();
          let newsNotFound = "Sorry, no articles could be found.";
          $(".container .row").append(newsNotFound);
        }
      },
      error: function () {
        $(".container .row").append("Error");
      }
    })
  }

  //click function for the search button
  $("#searchbtn").on('click', function (e) {
    //prevents the page from reloading
    e.preventDefault();
    //takes input from search bar and stores it in a variable
    let query = $("#searchquery").val();
    //checks if the user is online or not
    if (navigator.onLine === true) {
      //adds users search query to the api url
      let url = 'https://content.guardianapis.com/search?q=' + query + '&show-fields=headline,thumbnail,body&api-key=cf7bb976-9217-42bb-9cda-5804a5426c25';
      //searches the API to find content matching query variable
      if (query !== "") {
        $.ajax({
          url: url,
          method: "GET",
          dataType: "jsonp",
          success: function (data) {
            var output = "";
            latestNews = data.response.results;
            //loops through returned news articles and outputs them into Boostrap cards
            for (var i = 0; i < latestNews.length; i++) {
              date = moment(latestNews[i].webPublicationDate).format('MMM Do YYYY, h:mm a');
              $(".container .returns").empty();
              $(".container .row").append(output += `
                <div class='col-sm-4 col-md-4 col-xs-12'> <div class='card mb-3' style='width:22rem; height:27rem;'> <img class='card-img-top img-responsive' src="${latestNews[i].fields.thumbnail}" alt='Article thumbnail'></img><div class='card-body d-flex flex-column'><h5 class='card-title'>${latestNews[i].fields.headline}</h5><h6 class='card-subtitle mb-2 text-muted'>` + date + `</h6><a href='${latestNews[i].webUrl}' class='mt-auto btn btn-primary viewArticle'>View article</a></div></div></div></div>
                `);
            }
            //if data was found, it gets displayed + a count of how many articles were returned. if not then user is shown message that no articles were found matching their search.
            if (output !== "") {
              $(".container .returns").empty();
              $('.container .row').empty();
              var returns = $(output).length;
              $(".container .row").html(output);
              $(".container .returns").append("Your search returned " + returns + " articles.")
              // $(".container .row").append(output);
            } else {
              $('.container .row').empty();
              let newsNotFound = "Sorry, no articles match your search. Try searching for something else.";
              $(".container .row").append(newsNotFound);
            }
          },
          error: function () {
            $(".container .row").append("Error");
          }
        });
        //if user tries to search with no keywords they are shown message asking to enter a valid search.
      } else {
        $('.container .row').empty();
        $(".container .row").append("Please enter a valid search.");
      }
    } else {
      //get data from localStorage
      data = JSON.parse(localStorage.getItem('offline'));
      offline = [];
      let output = "";
      var resultCounter = 0;
      //ensures query is a string to avoid errors
      query = query.toUpperCase();
      //loops through returned data and checks if the index of the query is more than or equal to zero. if it is, data gets appended to the output.
      for (var i in data) {
        check = data[i].fields.headline.toUpperCase();
        if (check.indexOf(query) >= 0) {
          j = 0;
          //adds each returned article to array
          offline.push(data[i]);
          j++;
          oDate = moment(data[i].webPublicationDate).format('MMM Do YYYY, h:mm a');
          oHeadline = data[i].fields.headline;
          // alert(oHeadline);
          oThumbnail = data[i].fields.thumbnail;
          oUrl = data[i].webUrl;
          oBody = data[i].fields.body;
          output += `<div class='col-md-4'> <div class='card mb-3' style='width:22rem; height:27rem;'> <img class='card-img-top' src="${oThumbnail}" alt='Article thumbnail'></img><div class='card-body d-flex flex-column'><h5 class='card-title'>${oHeadline}</h5><h6 class='card-subtitle mb-2 text-muted'>` + oDate + `</h6><a href='${oUrl}' class='mt-auto btn btn-primary viewArticle'>View article</a></div></div></div>
        `
          resultCounter++;
        } if (output !== "") {
          $(".container .returns").empty();
          $('.container .row').empty();
          $(".container .row").html(output);
          $(".container .returns").append("Your offline search returned " + resultCounter + " articles.")
        } else {
          $('.container .row').empty();
          let newsNotFound = "Sorry, no articles match your search. Try searching for something else.";
          $(".container .row").append(newsNotFound);
        }
        //sets latest news variable to = offline if user is offline, so that they can view the articles
        latestNews = offline;
      }
    }
    //empty the search once it has been completed
    $("#searchquery").val('');
  });
  //sets active class to respond to user click, changes API link to correspond to chosen category
  $(".nav-link").on("click", function () {
    $(".nav-link").parent('li').removeClass('active');
    $(this).parent('li').addClass('active');
    var category = $(this).attr("href").slice(1);
    var link = "https://content.guardianapis.com/search?section=" + category + "&show-fields=headline,thumbnail,body&api-key=cf7bb976-9217-42bb-9cda-5804a5426c25";
    $(".container .returns").empty();
    displayHeadlines(link);

  });

  //links back to home from navbar-brand
  $(".navbar-brand").on("click", function () {
    $(".container .returns").empty();
    displayHeadlines(home);
  });

  //open full article
  $(document).on("click", ".viewArticle", function (e) {
    e.preventDefault();
    var contentIndex = $(this).index(".viewArticle");
    title = latestNews[contentIndex].fields.headline;
    content = latestNews[contentIndex].fields.body;
    image = latestNews[contentIndex].fields.thumbnail;
    $('#myModal').modal('show');
    $(".modal-title").html(title);
    $(".modal-body img").attr("src", image);
    $(".modal-body p").html(content);
  });


  //Bootstrap Tour/tooltips (base taken from https://bootstraptour.com/)
  var tour = new Tour({
    smartPlacement: true,
    keyboard: true,
    autoscroll: true,
    backdrop: true,
    storage: false,
    template: "<div class='popover tour'> <div class='arrow'></div><h3 class='popover-title'></h3><div class='popover-content'></div><div class='popover-navigation'><button class='btn btn-light' data-role='prev'>« Prev</button><span data-role='separator'>|</span><button class='btn btn-light' data-role='next'>Next »</button></div><button class='btn btn-default btn-primary' style='background-color:#32a852; color:#fff; float: right;' data-role='end'>End tour</button></div>",
    steps: [
      {
        element: ".navbar-brand",
        title: "Home",
        content: "Clicking here will take you back to the homepage."
      },
      {
        element: ".nav-tabs",
        title: "Categories",
        content: "Clicking on any of these tabs will show you news articles related to their title."
      },
      {
        element: "#searchquery",
        title: "Search",
        content: "Use this to search for a particular topic or keyword."
      },

    ]
  });
  // Initialize the tour
  tour.init();
  $("#help").on("click", function () {
    tour.start();
  })
  $("#topHeadlinesCarousel").carousel({
    interval: 7000
  });

  //top headlines carousel
  $.get('https://content.guardianapis.com/search?show-fields=thumbnail,headline,body,lastModified,trailText&api-key=cf7bb976-9217-42bb-9cda-5804a5426c25', function (data) {
    // console.log(data);
    for (var i = 0; i < 5; i++) {
      cThumbnail = data.response.results[i]['fields']['thumbnail'];
      cHeadline = data.response.results[i]['fields']['headline'];
      cBlurb = data.response.results[i]['fields']['trailText'];
      cLastModified = data.response.results[i]['fields']['lastModified'];
      cBody = data.response.results[i]['fields']['lastModified'];
      $(".headline:eq(" + i + ")").text(cHeadline);
      $(".blurb:eq(" + i + ")").text(cBlurb);
      $(".carousel-item img:eq(" + i + ")").attr("src", cThumbnail);

    }

    //open full article
    $(document).on("click", ".readArticle", function (e) {
      e.preventDefault();
      topNews = data.response.results;
      var contentIndexCarousel = $(this).index(".readArticle");
      title = topNews[contentIndexCarousel].fields.headline;
      content = topNews[contentIndexCarousel].fields.body;
      image = topNews[contentIndexCarousel].fields.thumbnail;
      $('#myModal').modal('show');
      $(".modal-title").html(title);
      $(".modal-body img").attr("src", image);
      $(".modal-body p").html(content);
    });
  });

  //load third party content asynchronously
  var script = document.createElement('script'),
    scripts = document.getElementsByTagName('script')[0];
script.async = true;
script.src = url;
scripts.parentNode.insertBefore(script, scripts);
});