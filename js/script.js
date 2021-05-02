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
        //get and trim the value
        let input = $('#search-input').val().trim();
        //act if not empty
        if (input != "") {
            //apply input to title
            $('#search-word').text(input);
            //clear search result
            $(".search-results-container").html("");
            //link to API
            let url = `http://www.omdbapi.com/?t=${input}&apikey=1557ab70`;
            //send XMLHTTP request
            $.ajax({
                url: url,
                type: "GET",
                success: function (data) {
                    //if recieved data
                    if (!data.error) {
                        //if there was no result
                        if (data['Response'] == "False") {
                            //create an error message
                            let noResult = $("<p>");
                            noResult.addClass('no-result');
                            noResult.text('No Result');
                            //display error message
                            $(".search-results-container").append(noResult);
                        } else {
                            console.log(data);
                            //get data
                            let title = data['Title'];
                            let year = data['Year'];
                            let movieText = `${title} (${year})`;
                            //create div container
                            let resultMovie = $('<div>');
                            resultMovie.addClass('search-result');
                            //create title
                            let movieTitle = $('<h4>');
                            movieTitle.addClass('search-result-title');
                            movieTitle.text(movieText);
                            //create button
                            let movieBtn = $('<a>');
                            movieBtn.addClass('search-result-btn');
                            movieBtn.text("Nominate");
                            //appending elements
                            resultMovie.append(movieTitle);
                            resultMovie.append(movieBtn);
                            //append to result container
                            $(".search-results-container").append(resultMovie);

                            //add event listener to button
                            movieBtn.click(function () {
                                nominateMovie(movieText);
                            });



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
        if (nominatedMovies.length < 5) {
            if (nominatedMovies.includes(movieText)) {
                showFeedback('error', "This Moive is already added");
            } else {
                //add to array list
                nominatedMovies.push(movieText);
                //update the storage
                updateStorage(nominatedMovies);
                //show feedback
                showFeedback('success', "Movie has been added");
                //add movie
                addNominateMovie(movieText);
            }
        } else {
            showFeedback('error', "Maximum 5 movies can be nominated");
        }
    }
    /**
     * add the given movie to the list
     * @param {*} movieText the name and year of the movie
     */
    function addNominateMovie(movieText){
        //create div container
        let resultMovie = $('<div>');
        resultMovie.addClass('search-result');
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
        //add event listener to button
        movieBtn.click(function () {
            removeMovie(this, movieText);
        });
    }
    /**
     * remove the moive from the nominated list
     * @param {*} movie the nominated moive
     * @param {*} movieText the name and year of the movie
     */
    function removeMovie(movie, movieText) {
        document.querySelector(".nominations-container").removeChild(movie.parentElement)
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
            $(".feedback").fadeOut(400);
            $(".feedback").removeClass(status);
        }, 3000);
    }
    /**
     * Update the movies at the local broweser storage
     * @param {*} movies a list of nominated movies
     */
    function updateStorage(movies) {
        localStorage.setItem('storageMovies', JSON.stringify(movies));
    }

});