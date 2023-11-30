$(function () {
  // Function calls
  /**
   * Checks for input Validity and either reports failed validity or
   * adds data to the table.
   * @param {SubmitEvent} event Used to prevent page refresh on form submission
   */
  function onFormSubmit(event) {
    event.preventDefault();
    // Since rating uses a Range we only
    // need to validate the titleInput.
    if (validateTitleInput()) {
      addMovieRow($('#title-input').val(), Number($('#rating-input').val()));

      // Reset form to defaults
      $('#title-input').val('');
      $('#rating-input').val(5);
    } else {
      event.target.reportValidity();
    }
  }

  /**
   * Checks validity of #title-input and sets
   * customValidity accordingly.
   * @returns {Boolean}
   */
  function validateTitleInput() {
    const titleInput = $('#title-input').get(0);
    if (validateTitle(titleInput.value)) {
      titleInput.setCustomValidity('');
      return true;
    } else {
      titleInput.setCustomValidity('Title must be at least 2 characters long');
      return false;
    }
  }

  /**
   * Ensures that string isn't only whitespace and is at least 2 characters long.
   * @param {String} title String to validate
   * @returns {Boolean}
   */
  const validateTitle = (title) => title.trim().length >= 2;

  /**
   * Ensures that number is between 0 and 10. (Inclusive)
   * @param {Number} rating Number to validate
   * @returns {Boolean}
   */
  const validateRating = (rating) => rating >= 0 && rating <= 10;

  /**
   * Takes a title and rating and creates + appends a new <tr> to
   * '.movie-table__body'.
   * @param {String} title Title of movie
   * @param {Number} rating Rating of movie
   */
  function addMovieRow(title, rating) {
    $('<tr>')
      .append($('<td>').addClass('title-cell').text(title))
      .append(createRatingTd(rating))
      .append(
        $('<td>')
          .append(
            $('<button>')
              .text('Edit')
              .on('click', function () {
                editMovie($(this).closest('tr'));
              })
          )
          .append(
            $('<button>')
              .text('Remove')
              .on('click', function () {
                $(this).closest('tr').remove();
              })
          )
      )
      .appendTo('.movie-table__body');
  }

  /**
   * Takes a rating of 0-10 and converts it into a series of five
   * star icons. (7 = 3.5 stars, 10 = 5 stars, etc.)
   * @param {Number} rating Rating number to convert into stars. Added to \<td> as
   * data-rating if it needs to be retrieved later.
   * @returns {HTMLTableCellElement} Returns \<td> with star icons matching provided rating.
   */
  function createRatingTd(rating) {
    // Preserve rating if it needs to be referenced later.
    const $td = $('<td>').data('rating', rating).addClass('rating-cell');

    for (let i = 5; i > 0; i--) {
      switch (rating) {
        // Next star should be unfilled. -1 occurs on odd # ratings.
        // Easier to add -1 as case instead of adding additional logic to prevent it.
        case -1:
        case 0:
          $td.append(
            $('<span>').text('star').addClass('material-symbols-sharp')
          );
          break;
        // Next star should be half filled.
        case 1:
          $td.append(
            $('<span>')
              .text('star_half')
              .addClass('material-symbols-sharp filled')
          );
          break;
        // Next star should be a filled.
        default:
          $td.append(
            $('<span>').text('star').addClass('material-symbols-sharp filled')
          );
          break;
      }
      if (rating >= 1) rating -= 2;
    }
    return $td;
  }

  /**
   * Prompts the user to enter in a new title / rating, validates user input,
   * and then updates the \<tr> with the new information.
   * @param {HTMLTableRowElement} row \<tr> containing movie data to edit.
   */
  function editMovie(row) {
    let newTitle = '';
    // Null occurs when user clicks cancel on prompt
    while (newTitle !== null && !validateTitle(newTitle)) {
      newTitle = prompt(
        'New Title (2 characters minimum)',
        row.children('.title-cell').text()
      );
    }
    let newRating = -1;
    // Null occurs when user clicks cancel on prompt
    while (newRating !== null && !validateRating(newRating)) {
      newRating = prompt(
        'New Rating (0 - 10)',
        row.children('.rating-cell').data('rating')
      );
    }
    if (newTitle !== null) {
      row.children('.title-cell').text(newTitle);
    }
    if (newRating !== null) {
      row.children('.rating-cell').replaceWith(createRatingTd(newRating));
    }
  }

  // Events/Listeners
  $('.movie-form').on('submit', onFormSubmit);
  $('#title-input').on('blur', validateTitleInput);
});
