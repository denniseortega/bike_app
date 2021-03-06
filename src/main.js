import $ from 'jquery';
import 'bootstrap';
import 'es6';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css';
import { bike } from './bike.js';
var Promise = require('es6-promise').Promise;
var moment = require('moment');


$(document).ready(function() {
  $('#bike').submit(function(event) {
    event.preventDefault();
    let startDate = $('#startDate').val();
    let endDate = $('#endDate').val();
    let location = $('#location').val();
    $('#location').val("");
    $('#startDate').val("");
    $('#endDate').val("");


    let promise = new Promise(function(resolve, reject) {
      let request = new XMLHttpRequest();
      let url = `https://bikeindex.org:443/api/v3/search?page=1&per_page=100&location=${location}&distance=20&stolenness=proximity`;
      request.onload = function() {
        if (this.status === 200) {
          resolve(request.response);
        } else {
          reject(Error(request.statusText));
        }
      }
      request.open("GET", url, true);
      request.send();
    });
    console.log(promise);
    let rangeDate = 604800;
    let newStartDate = parseInt((new Date(startDate).getTime() / 1000).toFixed(0));
    let newEndDate = parseInt((new Date(endDate).getTime() / 1000).toFixed(0));
    console.log(newStartDate);

    promise.then(function(response) {
      let body = JSON.parse(response);
      let counter = 0;
      $('#output').hide();
      $('.showOutput').empty();
      $('.showHowMany').empty();
      body.bikes.forEach(function(bike) {
        let formatedDate = timeConverter(bike.date_stolen);
        if (newStartDate < bike.date_stolen && newEndDate > bike.date_stolen) {
          counter++;
          $('.showOutput').append('<p>' + 'Brand: ' +  '<span class="big">' + `${bike.manufacturer_name}.` + '</span>' + '</p>');
          $('.showOutput').append('<p>' + `Serial number: ${bike.serial}.` + '</p>');
          $('.showOutput').append('<p>' + `Frame colors: ${bike.frame_colors}.` + '</p>');
          $('.showOutput').append('<p>' + `Date stolen: ${formatedDate}.` + '</p>');
        }
      })
      if (counter === 0) {
        $('.showOutput').text(`No bikes were stolen between ${startDate} and ${endDate} in ${location} area.`);
      } else {
        $('.showHowMany').text(`There were ${counter} bikes stolen between ${startDate} and ${endDate} in ${location} area.`);
      }
    }, function(error) {
      $('.showErrors').text(`There was an error processing your request: ${error.message}`);
    });
    $('#output').show();


    function timeConverter(UNIX_timestamp){
      var a = new Date(UNIX_timestamp * 1000);
      var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      var year = a.getFullYear();
      var month = months[a.getMonth()];
      var startDate = a.getDate();
      var hour = a.getHours();
      var min = a.getMinutes();
      var sec = a.getSeconds();
      var time = startDate + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
      return time;
    }

    //   function(error) {
    //   $('.showErrors').text(`There was an error processing your request: ${error.message}`);
    // }

  // $.get(`https://bikeindex.org:443/api/v3/search?page=1&per_page=25&location=${location}&distance=10&stolenness=proximity`).then(function(response) {
  //   $('.showOutput').append('<p>' + `The brand of the bike is ${response.bikes[0].manufacturer_name}.` + '</p>');
  //   $('.showOutput').append('<p>' + `The serial number is ${response.bikes[0].serial}.` + '</p>');
  //   $('.showOutput').append('<p>' + `The color of the bike is ${response.bikes[0].frame_colors}.` + '</p>');
  //   $('.showOutput').append('<p>' + `Date stolen: ${response.bikes[0].startDate_stolen}.` + '</p>');
  // }).fail(function(error) {
  //      $('.showErrors').text(`There was an error processing your request: ${error.responseText}. Please try again.`);
  //    });

  });
});
