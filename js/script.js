/*
Copyright Milad Mobini May 2nd, 2021
Shopify UX Developer Intern & Web Developer Intern Challenge - Fall 2021

Link to Github code: https://github.com/milad2281/Shoppies
Link to deployed website: https://milads-shoppies.netlify.app/

Github: https://github.com/milad2281
Website: https://www.ecocyrus.com/
*/

//window event listener to remove preloader
$(window).on("load", function () {
    document.querySelector('.preloader').style.display = 'none';
});
//when the document is ready
$(document).ready(function () {
    let nominatedMovies = (localStorage.getItem('storageMovies')) ? JSON.parse(localStorage.getItem('storageMovies')) : [];
    //check if list is not empty
    if (nominatedMovies.length > 0) {
        //add every movie to nomination
        nominatedMovies.forEach(movie => {
            //add the movie
            addNominateMovie(movie);
        });
    }
    //listener on search input
    $('#search-input').on("keyup", function () {
        //get, trim, and lowercase the value
        let input = $('#search-input').val().trim().toLowerCase();
        //act if not empty
        if (input != "") {
            //apply input to title
            $('#search-word').text(input);
            //clear search result
            $(".search-results-container").html("");
            //link to API
            let url = `https://www.omdbapi.com/?s=${input}&apikey=1557ab70&type=movie`;
            //send XMLHTTP request
            $.ajax({
                url: url,
                type: "GET",
                success: function (data) {
                    //if recieved data
                    if (!data.error) {
                        //if there was no result
                        if (data['Response'] == "False" && data['Error'] == "Movie not found!") {
                            //create an error message
                            let noResult = $("<p>");
                            noResult.addClass('no-result');
                            noResult.text('No Result');
                            //display error message
                            $(".search-results-container").append(noResult);
                        } else if (data['Response'] == "False" && data['Error'] == "Too many results."){
                            //create an error message
                            let noResult = $("<p>");
                            noResult.addClass('no-result');
                            noResult.text('Please be more specific');
                            //display error message
                            $(".search-results-container").append(noResult);
                        } else {
                            //going through all results
                            data['Search'].forEach(movie=>{
                                //get movie data
                                let title = movie['Title'];
                                let year = movie['Year'];
                                let poster = (movie['Poster'] == "N/A") ? "img/posterPlaceHolder.svg" : movie['Poster'];
                                let movieText = `${title} (${year})`;
                                //create div container
                                let resultMovie = $('<div>');
                                resultMovie.addClass('search-result');
                                //create poster image
                                let resultImg = $('<img>');
                                resultImg.addClass('search-result-photo');
                                resultImg.attr('src',poster);
                                resultImg.attr('alt',"No Movie Poster");
                                //create info container
                                let resultInfo = $('<div>');
                                resultInfo.addClass('search-result-info');
                                //create title
                                let movieTitle = $('<h4>');
                                movieTitle.addClass('search-result-title');
                                movieTitle.text(movieText);
                                //create button
                                let movieBtn = $('<button>');
                                movieBtn.addClass('all-btn');
                                movieBtn.addClass('search-result-btn');
                                movieBtn.text("Nominate");
                                //appending elements
                                resultInfo.append(movieTitle);
                                resultInfo.append(movieBtn);
                                resultMovie.append(resultImg);
                                resultMovie.append(resultInfo);
                                //append to result container
                                $(".search-results-container").append(resultMovie);
                                //check if the movie is already nominated
                                //add event listener to button
                                movieBtn.click(function () {
                                    if(nominateMovie(movieText)){
                                        disableBtn(this);
                                    }
                                });
                                if (nominatedMovies.includes(movieText)) {
                                    disableBtn(movieBtn);
                                }
                            })
                        }
                    }
                },
            });
        } else {
            //apply input to title
            $('#search-word').text(input);
            //clear search result
            $(".search-results-container").html("");
        }
    });

    /**
     * check for existence and then add the movie to nomitation list
     * @param {*} movieText name and year of the movie
     */
    function nominateMovie(movieText) {
        let succeed = true;
        if (nominatedMovies.length < 5) {
            if (nominatedMovies.includes(movieText)) {
                showFeedback('error', "This Moive is already added");
                succeed =  false;
            } else {
                //add to array list
                nominatedMovies.push(movieText);
                //update the storage
                updateStorage(nominatedMovies);
                //add movie
                addNominateMovie(movieText);
                if (nominatedMovies.length == 5) {
                    //show feedback on 5 movies nomitated
                    showFeedback('success', "Congratulation,You have nominated all your 5 movies.");
                } else {
                    //show feedback on movied added
                    showFeedback('success', "Movie has been added");
                }
            }
        } else {
            showFeedback('error', "Maximum 5 movies can be nominated");
            succeed =  false;
        }
        return succeed;
    }
    /**
     * add the given movie to the list
     * @param {*} movieText the name and year of the movie
     */
    function addNominateMovie(movieText) {
        //create div container
        let resultMovie = $('<div>');
        resultMovie.addClass('search-result');
        resultMovie.addClass('noWidth');
        //create title
        let movieTitle = $('<h4>');
        movieTitle.addClass('search-result-title');
        movieTitle.text(movieText);
        //create button
        let movieBtn = $('<a>');
        movieBtn.addClass('search-result-btn');
        movieBtn.text("remove");
        //appending elements
        resultMovie.append(movieTitle);
        resultMovie.append(movieBtn);
        //append to result container
        $(".nominations-container").append(resultMovie);
        $(resultMovie).hide();
        $(resultMovie).slideDown(500);
        //add event listener to button
        movieBtn.click(function () {
            //get all the search result buttons
            document.querySelectorAll(".all-btn").forEach(btn => {
                //check if the title was added to list
                if (btn.previousSibling.textContent == movieText) {
                    //undo the disable on the button
                    ableBtn(btn);
                }
            });
            //remove movie from list
            removeMovie(this, movieText);
        });
    }
    /**
     * remove the moive from the nominated list
     * @param {*} movie the nominated moive
     * @param {*} movieText the name and year of the movie
     */
    function removeMovie(movie, movieText) {
        $(movie.parentElement).fadeOut(700, function () {
            document.querySelector(".nominations-container").removeChild(movie.parentElement);
        });
        nominatedMovies = nominatedMovies.filter(item => item !== movieText);
        updateStorage(nominatedMovies);
    }
    /**
     * Show a notification to user
     * @param {*} status 'success' for green and 'error' for red
     * @param {*} msg message to be display
     */
    function showFeedback(status, msg) {
        //create feedback
        let fb = $("<p>");
        fb.addClass('feedback');
        fb.addClass(status);
        fb.text(msg);
        $('body').append(fb);
        setTimeout(function () {
            //fading the movie
            $(fb).fadeOut(400, function () {
                //deleting the movie
                $(fb).removeClass(status);
            });
        }, 3000);
    }
    /**
     * Update the movies at the local broweser storage
     * @param {*} movies a list of nominated movies
     */
    function updateStorage(movies) {
        localStorage.setItem('storageMovies', JSON.stringify(movies));
    }
    /**
     * this function ables a button
     * @param {*} btn button to be abled
     */
    function ableBtn(btn) {
        $(btn).removeClass('disabled');
        $(btn).prop('disabled', false);
        $(btn).text('nominate');
    }
    /**
     * this function disables a button
     * @param {*} btn button to be disabled
     */
    function disableBtn(btn) {
        $(btn).addClass('disabled');
        $(btn).prop('disabled', true);
        $(btn).text('nominated');
    }

});
/*
Copyright Milad Mobini May 2nd, 2021
Shopify UX Developer Intern & Web Developer Intern Challenge - Fall 2021

Link to Github code: https://github.com/milad2281/Shoppies
Link to deployed website: https://milads-shoppies.netlify.app/

Github: https://github.com/milad2281
Website: https://www.ecocyrus.com/

*/