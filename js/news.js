// ce0ad27bc417447c835519893424de47
// https://newsapi.org/v2/top-headlines?country=ru&apiKey=ce0ad27bc417447c835519893424de47
const url = 'http://www.lemonde.fr/rss/une.xml';

/* minutes */
const updateInterval = 30;
const newsNumber = 4;
const titleSize = 30;
const descriptionSize = 130;

function getNews(url, successHandler, errorHandler) {

    $.ajax({
        url: url,
        type: 'GET',
        success: function (html) {
            successHandler(html);
        },
        error: errorHandler
    });
}

function trimNewsElement(text, size){
    text = text.substring(0, size);
    /* trim until space */
    var uncutSize = Math.min(text.length, text.lastIndexOf(" "));
    return text.substring(0, uncutSize) + " ...";
}

function parseNews(html){
    var jHtml = $.parseHTML(html),
        items = $(html).find('item'),
        news = [];

    for(var i = 0; i < newsNumber; i++){
        var title = $(items[i]).find('title').text().trim();
        var description = $(items[i]).find('description').text().trim();

        if(title.length > titleSize){
           title = trimNewsElement(title, titleSize);
        }

        if(description.length > descriptionSize){
            description = description.substring(0, descriptionSize);
            description = trimNewsElement(description, descriptionSize);
        }

        news[i] = { title : title, description : description };
    }

    return news;
}

function displayNews(html){
    var data;
    var settings = {
      "async": true,
      "crossDomain": true,
      "url": "https://newsapi.org/v2/top-headlines?apiKey=ce0ad27bc417447c835519893424de47&country=ru",
      "method": "GET",
      "headers": {}
    }

    $.ajax(settings).done(function (response) {
      console.log(response);
      var html = '';
      data = response
      for(var i = 8; i < 11; i++){
          var content = '';
          if(data.articles[i].content !== null){
            content = data.articles[i].content
          }
          var item = '<div class="news-panel">' +
              '<i class="fa fa-newspaper-o" aria-hidden="true"></i>' +
              '<span class="sub-title"> ' + data.articles[i].title + '</span>' +
              '<div class="news-field">' +
              '<p class="news-short">'+ content + '</p></div></div><br><br>';
          html += item;
      }

      $('#news-panel').html(html);
    });

    // var data = [
    //   {
    //     title: "qwe",
    //     description: "asdasdasd"
    //   },
    //   {
    //     title: "qwe",
    //     description: "asdasdasd"
    //   },
    //   {
    //     title: "qwe",
    //     description: "asdasdasd"
    //   }
    // ]
    // articles
}

displayNews()

// getNews(url, displayNews);
//
// /* update  */
// setInterval(function(){
//     getNews(url, displayNews);
//     console.log('hey');
// }, updateInterval * 60 * 1000);
