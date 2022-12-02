$(document).ready(function(){
     console.log('connected')
     $('#head')
     $('#head-container')
     $('#calendar-holder')
     $('#head-tittle')
     $('#main-container')
     $('#search')
     $('#submit-btn').on('click', function(){
               console.log('yeah!!')   
               const input = $('#input');
               const inputValue = input[0].value;
               $('#input').val("");//clean input space         
               console.log(inputValue);
               currecncyExchangeRate(inputValue);
               wikipediaBlurb(inputValue);
          })
     $('#content')
     $('#country-name')
     $('#history')
     $('#currency')

     // CURRENCY EXCHANGE RATE
     function currecncyExchangeRate(input){
     //call restcountries.com api
     //to get country data, currency code and currency name
          $("#today-rate").siblings("h6").text("Today Exchange Rate");
          var exchangeInfo = document.querySelector('#today-rate');
          exchangeInfo.innerHTML=""; //to make sure there is no data from previous search

          var currencyCode = "";
          var currencyName = "";
          var compareCurrency = "CAD";
          var compareName = "Canadian dollar";
          var capitalName = ""; // Capital name of country to link weather

          if (input=="canada"){
               compareCurrency = "USD";
               compareName = "United State dollar";
          }

          var country= "https://restcountries.com/v3.1/name/"+input+"?fullText=true"; //API link to get country information
               fetch(country)
                    .then(function(response){
                         if(response.ok){
                              response.json().then(function(data){
                                   console.log(data);//JSON data to show in console
                                   capitalName = data[0].capital[0]; // Result of Capital Name
                                   console.log(capitalName);
                                   currencyCode = (Object.keys(data[0].currencies))[0];
                                   // console.log(currencyCode);
                                   currencyName = (Object.values(data[0].currencies))[0].name;
                                   // console.log(currencyName);
                                   $('#currency').attr('style','border-color:grey')
                                   currency()
                              })
                         } else {
                              $('#country-name').text("Please try again");
                              }      
                    })
                    .catch(function (error) {
                         $('#country-name').val("Please try again");
                    })
               
          //Currency exchange rate with USD
          function currency(){          
              
               var myHeaders = new Headers();
               myHeaders.append("apikey", "eEuvQv8ee37GzlxcoBm83o8xeRzhO4b4");

               var requestOptions = {
                    method: 'GET',
                    redirect: 'follow',
                    headers: myHeaders
                    };
                    //Another API to get exchange information
               fetch("https://api.apilayer.com/exchangerates_data/convert?to="+compareCurrency+"&from="+currencyCode+"&amount=1", requestOptions) 
               .then(function(response){
                    if(response.ok){
                         response.json().then(function(data){
                              // console.log(data);
                              var resultLocalUsd = data.result;
                              // console.log(resultLocalUsd);
                              var showResult = document.createElement("p");
                              showResult.textContent="1 "+currencyName+" = "+resultLocalUsd+" "+compareName;
                              exchangeInfo.appendChild(showResult);
                         })
                    }
                    fetch("https://api.apilayer.com/exchangerates_data/convert?to="+currencyCode+"&from="+compareCurrency+"&amount=1", requestOptions)
                    .then(function(response){
                    if(response.ok){
                         response.json().then(function(data){
                              // console.log(data);
                              var resultUsdLocal = data.result;
                              // console.log(resultUsdLocal);
                              var showResult = document.createElement("p");
                              showResult.textContent="1 "+compareName+" = "+resultUsdLocal+" "+currencyName;
                              exchangeInfo.appendChild(showResult);
                              
                         })
                    }
                    })  
                    .catch(error => console.log('error', error));
               })          
               .catch(error => console.log('error', error));               
          }
     }
     // END OF CURRENCY EXCHANGE RATE

     // Wikipedia blurbs
     function wikipediaBlurb(input){
          var wikiUrl = "https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&prop=extracts&exintro&explaintext&exsentences=5&titles="+input;
          var wikiInfo = document.querySelector('#history');
          wikiInfo.innerHTML=""; //to make sure there is no data from previous search

          fetch(wikiUrl)
               .then(function(response){
                    if(response.ok){
                         response.json().then(function(data){
                              console.log(data);//JSON data to show in console
                              var page = data.query.pages;
                              var pageId = Object.keys(page)[0];
                              var blurb = page[pageId].extract;
                              $('#country-name').text(page[pageId].title);//Format country name to formal
                              console.log(blurb);
                              var showResult = document.createElement("p");
                              showResult.textContent=blurb;
                              wikiInfo.appendChild(showResult);
                         })
                    }
               })
               .catch(error => console.log('error', error));
     }
     // END OF Wikipedia blurbs
})