(function () {
   'use strict';
}());

// The following two lines add html for the search box and pagination if the user is using a js enabled browser
$(".page-content").append('<div class="grid-container1" id"paging-container"><div class="pagination" id="page-box"></div></div>');
$(".page").append('<div class="page-header cf" id="page-header-box"><div class="student-search" id="search-box"><input type=text id="search-input" placeholder="Search for students..."><button id="button">Search</button></div><div class="search-message" id="search-message-box"></div>');

var pageClick = 1;   // Clicked on Pagination  
var students = document.getElementsByClassName ('student-item cf'); // total students
var pagesTotal = Math.ceil(students.length / 10); // rounds up     
var searchResults = 0;
var searchInput = "";

loadBeginPage();

function loadBeginPage() {
  pageClick = 1;
  loadPagination();        // Load paging buttons
  listenPagination();      // Listen to the paging buttons
  loadPage(pageClick);     // Load first 10 students
  // loadSearchField();       // Load the search box
  listenSearch();          // Listen to the search box
  document.getElementById("students")     // Reset our animation (list fade-in) to off
    .classList.toggle("animation1");
}

function loadPagination() {      // Paging buttons are added with Javascript supported browsers
  var html = '<ul>';
  for (var i = 1; i <= pagesTotal; i += 1) {      // Add a button for each page of students
    // pageClick = i;
    html += '<li class = "active new_page" id= "Button' + i + '">' + i + '</li>'; 
  }
  if (pagesTotal > 1) {
    html += '</ul>';
  } else {
    html = '';
  }

  html += '</ul>';
  document.getElementById('page-box').innerHTML = html;   //Load the button html onto the page
} 

function listenPagination(searchInput) {       // add event listener to each button
 if (pagesTotal > 1 ) {
    for (var i = 1; i <= pagesTotal; i += 1) {
      outerlistenPagination(i, searchInput);         // Outer function needed to pass i
    } // for end
  }
} // function end

function outerlistenPagination(i, searchInput) {  // We need outer function to use each i
  var buttonId = "Button" + i;
  document.getElementById(buttonId).addEventListener("click", function() {
    pageClick = i;    
    loadPage(pageClick, searchInput);            //Load Page that was clicked
  });
} // function end

function loadPage(pageClick, searchInput) {   // Checks for all students or search students will be loaded
  if (undefined === searchInput || null === searchInput || '' === searchInput) { // if search field is blank or null
    loadPageAll(pageClick); // load all of the students
  } else {
    loadPageSearch(pageClick, searchInput); // load the students found in search
  }
  var buttonId = "Button" + 1;
  for (var i = 1; i <= pagesTotal; i += 1) {
    buttonId = "Button" + i;
    if (pagesTotal > 1) {
      document.getElementById(buttonId)   
      .classList.remove("button-bright");  // Remove brighten styling on all pagination buttons
    }
  } // for end
  buttonId = "Button" + pageClick;
  if (pagesTotal > 1) {
    document.getElementById(buttonId)     //Brighten pagination button styling after load
    .classList.toggle("button-bright");
  }
  document.getElementById("students")     
    .classList.toggle("animation1");  //Reset Animation - use toggle not classlist.remove
  
  $('html,body').animate({ scrollTop: 0 }, 'slow');
  document.getElementById("students")     // This runs our animation - use toggle, not addClass 
    .classList.toggle("animation1");
} // function end

function loadPageAll(pageClick, searchInput) {         //Display 10 Students
  var studentBegin = 1;
  if (pageClick == 1) {
     studentBegin = pageClick - 1;     // First student index is zero, use (pageClick - 1)
    $('#students').children().css('display', 'none').slice(studentBegin, studentBegin + 10).css('display', 'block'); 
    
  } else {                                   // Slice gives us the first 10 or the next 10 depending on page clicked
     studentBegin = (pageClick * 10) - 10;
     $('#students').children().css('display', 'none').slice(studentBegin, studentBegin + 10).css('display', 'block'); 
  }
} // function end

function loadPageSearch(pageClick, searchInput) {           //Load results of search
  var studentBegin = 1;
  if (pageClick == 1) {           // For the first page of results
    studentBegin = pageClick - 1;   // First student index is zero, use (pageClick - 1)
    $(".student-details:not(:contains(" + searchInput + "))").parent().css({"display": "none"});
    $(".student-details:contains(" + searchInput + ")").parent().css({"display": "none"}).slice(studentBegin, studentBegin + 10).css('display', 'block').parent().css({"display": "block"});
  } else {
     studentBegin = (pageClick * 10) - 10;
     $(".student-details:not(:contains(" + searchInput + "))").parent().css({"display": "none"});
     $(".student-details:contains(" + searchInput + ")").parent().css({"display": "none"}).slice(studentBegin, studentBegin + 10).css('display', 'block').parent().css({"display": "block"});
  } //else end
} // function end

function listenSearch() {                           //Listen to search box
  $("#search-input").on('keyup', function() {      // If anything is entered in search field
    $('#search-message-box').css('display', 'none');
    searchInput = $(this).val().toLowerCase();
    searchInput = searchInput.trim();           // Trim beginning and ending spaces from search text
    searchResults = $(".student-details:contains(" + searchInput + ")").length;
    if (searchResults === 0){ // If search input is spaces or search characters not found - load no-search page
      pageClick = 1;                                   // Reset to beginning page
      pagesTotal = Math.ceil(students.length / 10);    // Reset to nosearch page 
      // loadBeginPage();                                 // Load beggining page of students - no search
      displayNoMatches();
    } else {                        // Load Search Result Studends page and pagination
      pageClick = 1; // When text is entered in search box always display first page of results
      searchResults = $(".student-details:contains(" + searchInput + ")").length;   //Find the students who match the searchInput
      pagesTotal = Math.ceil(searchResults / 10); // rounds up - we show 10 students per page
      loadPagination();                           // Load search page pagination
      listenPagination(searchInput);              // Listen search pagination
      loadPage(pageClick, searchInput);           // Sets up for load search
    } //end else
  
  }); // keyup function end
  
} // listen function end

function displayNoMatches(){
  document.getElementById('search-message-box').innerHTML = 'No Matches Found';   //Load the button html onto the page
  $('#students').children().css('display', 'none');
  $('#search-message-box').css('display', 'block');
  document.getElementById('page-box').innerHTML = '';   //Clear all paging buttons
}