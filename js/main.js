$(document).ready(function(){
  "use strict";
  /******* Global variable *******/
  var search;
  var message = '';

  /******* LOCKR is library for localStorage *******/
  // Ako zelite da obrisete knjige iz localStorage-a(one koje ste dodali pomocu forme na sajtu), u konzoli ukucajte : Lockr.flush()
  // If you want to delete localStorage object, in console type: Lockr.flush()
  var noveUneteKnjige = Lockr.getAll();
  Array.prototype.push.apply(arr, noveUneteKnjige);

  /******* JQuery variable wrapping DOM Elements *******/
  var $dodaj = $('#dodaj');
  var $pretrazi = $('#pretrazi');
  var $izlistaj = $('#izlistaj');
  var $pomoc = $('#pomoc');
  var $overlay = $('#overlay');
  var $body = $('body');
  var $form = $('#form-div');
  var $inputFile = $('[type=file]');
  var $textarea = $('textarea');
  var $popup = $('form span.popup');

  // proverava ukoliko nova dodata knjiga nema sliku, ne prikazuje img sa praznim poljem.
  // check if new entered book don't have img, and don't show empty img field, just hide it. 
  function hasImage() { 

    var $images = $('img');
    $images.each(function() {
      if($(this).attr('src') === "") {
        $(this).css('display', 'none');
      }
    });

  }

  // funkcija koja uvecava prvo slovo svake reci.
  // function which capitalize first letter of every word.
  function capitalizeEachWord(str) {

    return str.replace(/\w\S*/g, function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });

  }

  // funkcija koja uvecava prvo slovo prve reci.
  // function which capitalize first letter of first word.
  function capitalizeFirstLetter(str){

    str.toLowerCase();
    var capitalized = str.charAt(0).toUpperCase() + str.substring(1);
    return capitalized;

  }

  /******* Eventlistener koji pokrece funkciju koja pamti nove knjige koje su unete *******/
  /******* Eventlistener which on click starting function which save all new books *******/
  $('#snimi').click(function(){

    var $book_input = $('#book').val().toLowerCase();
    var $writer_input = $('#writer').val().toLowerCase();
    var $about_input = $('#about').val();
    // when upload img from local computer without webserver, browser make some fakepath to your img, so you need to replace that.
    // kada uploudejete sliku sa vaseg kompijutera bez web servera, pretrazivac pravi laznu putanju do vase slike, pa morate da je zamenite.
    var $picture_input = $('#picture').val().replace("C:\\fakepath\\", "img/");

    // LOCKR je biblioteka za lokalno skladistenje podataka. Pamti sve knjige unete pomocu forme na vasem kompijuteru
    // LOCKR is library used for local storage. Save new books which you input in form on local storage on your computer
    var newArr = {};

    newArr.book = $book_input;
    newArr.writer = $writer_input;
    newArr.about = $about_input;
    newArr.picture = $picture_input;

    Lockr.set(arr, {  'book' : newArr.book, 
                      'writer' : newArr.writer,
                      'about' : newArr.about,
                      'picture' : newArr.picture
                    });

    arr.push(newArr);

    resetForm();

  });

  /******* Eventlistener koji pokrece funkciju koja resetuje formu *******/
  /******* Eventlistener which on click starting function which reset form *******/
  $('#obrisi').click(function(){

    resetForm();

  });

  /******* Funkcija koja formira HTML output kako ce se lista sa postojecim knjigama prikazati u browser-u  *******/
  /******* Function which form HTML output of book list, how it will look in browser  *******/ 
  function getBookReport(name) {

    var report = "<li class='flex-item'><h2 class='naslov'>" + name.book + "</h2>";
    report += "<div class='left'><span style='display: inline-block'><h3>Knjiga : </h3>" + "<h4>" + capitalizeFirstLetter(name.book) + "</h4>";
    report += "<h3>Pisac : </h3>" + "<h4>" + capitalizeEachWord(name.writer) + "</h4></span>";
    report += "<img class='slika-naslov right' src='"+ name.picture +"' width='175' height='270'><h3>O knjizi : </h3><p>" + name.about + "</p></div>";
    report += "</li>";
    return report;

  }

  /******* Eventlistener koji na klik dugmeta prikazuje formu koja snima knjige na tvom kompijuteru(LOCKR), i proverava da li forma moze biti submitovana *******/
  /******* Eventlistener which on click starting function which save new books on your computer(LOCKR), and check if form can be submitted *******/
  $dodaj.click(function(){

    enableSubmit();
    $('#welcome').hide();
    $('#output').hide();
    $form.fadeIn('slow');

  });

  /******* Eventlistener koji na klik dugmeta pokrece funkciju koja pretrazuje knjige koje postoje u bazi *******/
  /******* Eventlistener which on click starting function which search for books that exist in the database *******/

  $pretrazi.click(function(){
  search = prompt('Pretrazi knjige koje imamo - Ukucaj ime (ili prezime) pisca, ili ime knjige.');

    for (var i = 0; i < arr.length; i += 1) {
      var arrayBook = arr[i];
      
      if( search === "" || search === null) {
        return null;
      } else if (search.toLowerCase() === arrayBook.writer || search.toLowerCase() === arrayBook.book ) {
        message += getBookReport(arrayBook);
      } else if (i === arr.length -1 && message === '') {
        message += '<h2 class="error">Knjiga(Pisac) "' + search + '" - ne postoji u nasoj arhivi</h2>';
      } else {
        for (var w = 0; w < arrayBook.writer.length; w++) {
          if ( search.toLowerCase() === arrayBook.writer.split(" ")[w] ) {
            message += getBookReport(arrayBook);
          }
        }
        for (var b = 0; b < arrayBook.book.length; b++) {
          if ( search.toLowerCase() === arrayBook.book.split(" ")[b] ) {
            message += getBookReport(arrayBook);
          }
        }
      }
    }

    $('#welcome').hide();
    $form.hide();
    $('#output').fadeIn('slow');
    $('#output').html(message);
    hasImage();
    message = '';

  });

  /******* Eventlistener koji na klik dugmeta pokrece funkciju koja izlistava sve knjige koje postoje u bazi *******/
  /******* Eventlistener which on click starting function which list all books that exist in the database *******/

  $izlistaj.click(function(){
  for (var i = 0; i < arr.length; i++) {
    message += getBookReport(arr[i]);
  }

  $('#welcome').hide();
  $form.hide();
  $('#output').fadeIn('slow');
  $('#output').html(message);
  hasImage();
  message = '';
  });

  /******* Event listener koji na klik dugmeta pokrece funkciju koja pruza pomoc i informacije na koji nacin da vrsite pretragu knjiga u biblioteci *******/
  /******* Eventlistener which on click starting function which display layer with information how to search for books in the library *******/
  $pomoc.click(function(){

    $body.css('overflow', 'hidden');
    $overlay.fadeIn('slow');
    $overlay.on('click', function(){
      $body.removeAttr('style');
      $overlay.fadeOut('slow');
    });

  });

  /******* Dugme za dodavanje slike u formi, koje takodje prikazuje naziv fajla(slike) koji(u) aploadujete *******/
  /******* Button for upload img in form, button also show name of the file(picture) which you uploading *******/
  $inputFile.on('change', function(){

    var file = this.files[0].name;
    var dflt = $(this).attr("placeholder");
    if ($(this).val()!=="") {
      $(this).next().text(file);
    } else {
      $(this).next().text(dflt);
    }

  });

  /******* Funkcija koja resetuje formu *******/
  /******* Funkcija which reset form *******/
  function resetForm(){

    var dflt = $inputFile.attr("placeholder");
    $inputFile.next().text(dflt);
    $knjiga.next().hide();
    $pisac.next().hide();
    $('input').val('');
    $textarea.val('');
    enableSubmit();

  }

  /******* Funkcije koje proveravaju unete parametre, i da li forma moze biti submitovana *******/
  /******* Functions which cheking entered parameters, and check if that form can be submit *******/
  var $knjiga = $('#book');
  var $pisac = $('#writer');
  var $save = $('#snimi');

  $popup.hide();

  function isBook() {
    return $knjiga.val().length > 0;
  }

  function isWriter() {
    return $pisac.val().length > 0;
  }

  function canSubmit(){
    return isBook() && isWriter();
  }

  function confirmBook() {
    if(isBook()) {
      $knjiga.next().hide();
    } else {
      $knjiga.next().fadeIn();
    }
  }

  function confirmWriter() {
    if(isWriter()) {
      $pisac.next().hide();
    } else {
      $pisac.next().fadeIn();
    }
  }

  function enableSubmit() {
    $save.prop('disabled', !canSubmit());
  }

  $knjiga.focusin(confirmBook).keyup(confirmBook).keyup(enableSubmit);
  $pisac.focusin(confirmWriter).keyup(confirmWriter).keyup(enableSubmit);

});