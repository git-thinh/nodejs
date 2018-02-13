/*================================================================*/
/*=== INDICATOR POPUP ===*/
/*================================================================*/

/**
* show infinite indicator
*/
function showInfiniteIndicator() {
    var msg1 = "設定しています。";
    var msg2 = "しばらくお待ちください。";
    var html = '<div class="loading">' +
        '<div class="infinite-indicator">' +
        '<div class="indicatorMsg">' + msg1 + '<br>' + msg2 + '</div>' +
             '<div class="uil-default-css" style="transform:scale(0.63);">' +
                  '<div class="stick stick1"></div>' +
                  '<div class="stick stick2"></div>' +
                  '<div class="stick stick3"></div>' +
                  '<div class="stick stick4"></div>' +
                  '<div class="stick stick5"></div>' +
                  '<div class="stick stick6"></div>' +
                  '<div class="stick stick7"></div>' +
                  '<div class="stick stick8"></div>' +
                  '<div class="stick stick9"></div>' +
                  '<div class="stick stick10"></div>' +
                  '<div class="stick stick11"></div>' +
                  '<div class="stick stick12"></div>' +
            '</div>' +
        '</div>' +
        '</div>'    
    //window.scrollTo(($(document).width() - $(window).width()) / 2, ($(document).height() - $(window).height()) / 2);    
    $('body').append(html);
    $(window).keydown(function(event){
    if(event.keyCode == 13) {
      event.preventDefault();
      return false;
    }
  });
}

/**
* close indicator
*/
function closeInfiniteIndicator() {
    if ($('.loading').length > 0) {       
        $('.loading').remove();
    }   
}


