


//change font
//1) make code unique add comments 

//3) HighCharts has spacing on left and right of the chart, fix that

//Process news on javascript if python makes it slow upon deployment

//Make navbar tabs thicker and font bigger

var symbol;

var company, exchangecode, ipo, category, img_url;

var strong_buy,strong_sell, sell_stock, buy_stock, hold_stock;

$(document).ready(function() {

    // let autocompleteOn = true;

    // function resetInput() {
    //     $('#symbol_input').val(''); 
    //     $('#symbol_input').prop('autocomplete', 'off'); 
    //     autocompleteOn = false;
    // }

 
    // $('#search-button').click(function() {
    //     // Turn on autocomplete when search button is clicked again
        //     $('#symbol_input').prop('autocomplete', 'on');
    //     autocompleteOn = true;

    // });

    // $('#clear-button').click(function() {
    //     resetInput();
    // });



    $('#search-form').submit(function(event) {
        event.preventDefault();

        symbol = $('#symbol_input').val();
        console.log(symbol);

        //SUMMARY TAB
        $.ajax({
            type: 'GET',
            url: '/summary?symbol=' + symbol,
            success: function(response) {
                console.log(response)
                if ($.isEmptyObject(response)) {
                    symbolNotFound();
                } else {
                    showNavBar();
                    $('#error-box').hide(); 
                    makeSummary(response);
                    showSummary();
                    //RECOMMENDATION fetch values
                    $.ajax({
                        type: 'GET',
                        url: '/recommendation?symbol=' + symbol,
                        success: function(response) {
                            //console.log(response)
                            // if ($.isEmptyObject(response)) {
                            //     buy_stock=0;
                            //     sell_stock=0;
                            //     hold_stock=0;
                            //     strong_buy=0;
                            //     strong_sell=0;
                            //     console.log(sell_stock, hold_stock, buy_stock, strong_buy, strong_sell);
                            // } else {
                            var rec=response[0];
                            buy_stock = rec.buy;
                            sell_stock=rec.sell;
                            hold_stock=rec.hold;
                            strong_buy=rec.strongBuy;
                            strong_sell=rec.strongSell;
                            console.log(sell_stock, hold_stock, buy_stock, strong_buy, strong_sell);
                            $.ajax({
                                type: 'GET',
                                url: '/stock?symbol=' + symbol,
                                success: function(response) {
                                    // if($.isEmptyObject(response))
                                    // {
                                    //     symbolNotFound();
                                    // }
                                    // else{
                                    makeStock(response);
                                    // }
                                },
                                error: function(error) {
                                    console.error('Error fetching stock:', error);
                                }
                            });   
                            // }
                        },
                    error: function(error) {
                        console.error('Error fetching recommendation:', error);
                    }
                  });

                    //CHART TAB CONTENT LOAD
                    $.ajax({
                        type: 'GET',
                        url: '/chart?symbol=' + symbol,
                        success: function(response) {
                            // if($.isEmptyObject(response))
                            // {
                            //     symbolNotFound();
                            // }
                            // else{
                            makeChart(response);
                            // }
                        },
                        error: function(error) {
                            console.error('Error fetching chart:', error);
                        }
                    });   
                    
                    //NEWS TAB CONTENT LOAD
                    $.ajax({
                        type: 'GET',
                        url: '/news?symbol=' + symbol,
                        success: function(response) {
                            // if($.isEmptyObject(response))
                            // {
                            //     symbolNotFound();
                            // }
                            // else{
                                makeNews(response);
                            // }
                        },
                        error: function(error) {
                            console.error('Error fetching news:', error);
                        }
                    });  

            }
            },
            error: function(error) {
                console.error('Error fetching summary:', error);
            }
        });

        
        //STOCK TAB CONTENT LOAD
        // $.ajax({
        //     type: 'GET',
        //     url: '/stock?symbol=' + symbol,
        //     success: function(response) {
        //         if($.isEmptyObject(response))
        //         {
        //             symbolNotFound();
        //         }
        //         else{
        //         makeStock(response);
        //         }
        //     },
        //     error: function(error) {
        //         console.error('Error fetching stock:', error);
        //     }
        // });    
  

        //--------------------- UPON BUTTON CLICKS ------------------------------ //
        //summary-tab
        $('#summary-tab').click(function() {
            showSummary();
        });
        //stock-tab
        $('#stock-tab').click(function() {
            showStock();
        });
         //chart-tab
         $('#chart-tab').click(function() {
            showChart();
        });
        //news-tab
        $('#news-tab').click(function() {
            showNews();
        });
         //reset-button
         $('#cancel-button').click(function() {
            reset();
        });        



    });
});

function reset()
{
    hideNavBar();
    $('#summary').hide();
    $('#stock').hide();
    $('#news').hide();
    $('#chart').hide();
    document.getElementById("symbol_input").value = "";  
    $('#error-box').hide();

}

function symbolNotFound()
{
    hideNavBar();
    $('#error-box').show();
    $('#summary').hide();
    $('#stock').hide();
    $('#news').hide();
    $('#chart').hide();
}

function showStock()
{
    showNavBar();
    $('#error-box').hide();
    $('#summary').hide();
    $('#stock').show();
    $('#news').hide();
    $('#chart').hide();
    $('.tabStatus').removeClass('active');
    $('#stock-tab').addClass('active'); 
}

function showSummary()
{
    showNavBar();
    $('#error-box').hide();
    $('#summary').show();
    $('#stock').hide();
    $('#news').hide();
    $('#chart').hide();
    $('.tabStatus').removeClass('active');
    $('#summary-tab').addClass('active'); 
}

function showChart()
{
    showNavBar();
    $('#error-box').hide();
    $('#summary').hide();
    $('#stock').hide();
    $('#news').hide();
    $('#chart').show();
    $('.tabStatus').removeClass('active');
    $('#chart-tab').addClass('active'); 
}

function showNews()
{
    showNavBar();
    $('#error-box').hide();
    $('#summary').hide();
    $('#stock').hide();
    $('#news').show();
    $('#chart').hide();
    $('.tabStatus').removeClass('active');
    $('#news-tab').addClass('active'); 
}

window.addEventListener('load', function() {

    var symbolInput = document.getElementById('symbol_input');
    symbolInput.value = "";
});



function makeSummary(data) {
        var { exchange, finnhubIndustry, ipo, logo, name, ticker } = data;
        var summaryHTML = `
            <div class="summary">
                <img src="${logo}" alt="Company Logo" style="width: 120px; height:120px; display: block; margin: 0 auto; padding-top: 20px; padding-bottom: 20px;">
                <div style="margin 0 auto; align-items: center; margin-left: 29%;">
                <table id="company-table">
                    <tr><td>Company Name</td><td>${name}</td></tr>
                    <tr><td>Stock Ticker Symbol</td><td>${ticker}</td></tr>
                    <tr><td>Stock Exchange Code</td><td>${exchange}</td></tr>
                    <tr><td>Company Start Date</td><td>${ipo}</td></tr>
                    <tr><td>Category</td><td>${finnhubIndustry}</td></tr>
                </table>
                <div>
            </div>
        `;
     
        document.getElementById("summary").innerHTML = summaryHTML;
       document.getElementById("summary").style.display="none";
        console.log("here2")
}

function makeStock(data)
 {
    var { t, pc, o, h, l, d, dp } = data;
    var date_human = convertUnixTime(t);
    var ticker_symbol_image;
    if(dp>=0)
        ticker_symbol_image="static/GreenArrowUp.png";
    else
        ticker_symbol_image="static/RedArrowDown.png";
    var stockHTML = `
    <div class="stock-div-content" style="margin-left: 29%;">
        <table id="company-table">
            <tr><td></tr></td>
            <tr><td>Stock Ticker Symbol</td><td>${symbol.toUpperCase()}</td></tr>
            <tr><td>Trading Day</td><td>${date_human}</td></tr>
            <tr><td>Previous Closing Price</td><td>${pc}</td></tr>
            <tr><td>Opening Price</td><td>${o}</td></tr>
            <tr><td>High Price</td><td>${h}</td></tr>
            <tr><td>Low Price</td><td>${l}</td></tr>
            <tr><td>Change</td><td>${d} <img src=${ticker_symbol_image} style="height: 17px; width: 17px; margin-bottom: -3px;"></td></tr>
            <tr><td>Change Percent</td><td>${dp} <img src=${ticker_symbol_image} style="height: 17px; width: 17px; margin-bottom: -3px;"> </td></tr>
        </table>
     
     <div class="container">
     <span style="color: red; margin-right: 15px; text-align:center; font-family: 'Roboto', sans-serif;">Strong <br> Sell</span>
     <div class="box box1">${strong_sell}</div>
     <div class="box box2">${sell_stock}</div>
     <div class="box box3">${hold_stock}</div>
     <div class="box box4">${buy_stock}</div>
     <div class="box box5">${strong_buy}</div>
     <span style="color: green; margin-left: 15px; text-align:center;font-family: 'Roboto', sans-serif;">Strong <br> Buy</span>
     </div>
     <span style="margin-left:140px; font-family: 'Roboto', sans-serif; font-size: 18px; text-align: center;">Recommendation Trends</span>
    </div>
    `;


    document.getElementById("stock").innerHTML = stockHTML;

}

function makeChart(data) {
    if (data && data.timestamps && data.close_prices && data.volumes) {
        const timestamps = data.timestamps.map(timestamp => new Date(timestamp));
        const closePrices = data.close_prices;
        const volumes = data.volumes;
        const maxVolume = Math.max(...volumes);
        let close = [];
        let volume = [];
        timestamps.forEach((timestamp, index) => {
            close.push([
                timestamp.getTime(), // the date
                closePrices[index]   // close price
            ]);
            volume.push([
                timestamp.getTime(), // the date
                volumes[index]       // volume
            ]);
        });

        if (timestamps.length === closePrices.length && timestamps.length === volumes.length) {

            Highcharts.stockChart('chart', {
                chart: {
                    height: 500,
                  //  alignTicks: true
                },
                // stockTools: {
                //     gui: {
                //         enabled: false // disable the built-in toolbar
                //     }
                // },
                rangeSelector: {
                    inputEnabled: false,
                    selected: 0,
                    buttons: [
                        {
                            type: 'day',
                            count: 7,
                            text: '7d'
                        }, {
                            type: 'day',
                            count: 15,
                            text: '15d'
                        }, {
                            type: 'month',
                            count: 1,
                            text: '1m'
                        }, {
                            type: 'month',
                            count: 3,
                            text: '3m'
                        }, {
                            type: 'month',
                            count: 6,
                            text: '6m'
                        }
                    ]
                },
                title: {
                    text: 'Stock Price ' + symbol.toUpperCase() + ' ' + new Date().toISOString().split('T')[0],
                    style: {
                        fontSize: '18px',
                        fontFamily: 'sans-serif'
                    }
                },
                subtitle: {
                    text: '<a href="https://polygon.io" target="_blank">Source: Polygon.io</a>',
                    useHTML: true,
                    style:{
                        fontSize: '14px',
                        marginTop: '40px',
                        marginBottom: '40px',
                        fontFamily: 'sans-serif'
                    }
                },
                xAxis: {
                    type: 'datetime',
                    dateTimeLabelFormats: {
                        day: '%e %b'
                    },
                    // offset:10
                },
                yAxis: [
                    {
                        labels: {
                            align: 'right'
                            // x: 0
                        },
                        title: {
                            text: 'Stock Price'
                        },
                        height: '100%',
                        // offset: 10,
                        opposite: false, 
                        //offset: 0
                       // min: 0
                    },
                    {
                        
                        title: {
                            text: 'Volume'
                        },
                        height: '100%',
                        offset: 0,
                        opposite: true,
                        max: maxVolume,
                        labels: {  
                            align: 'left',
                            // x: 0,
                            formatter: function () {
                                return Highcharts.numberFormat(this.value / 1000000, 0) + 'M';
                            }
                        },
                        tickInterval: 60 * 1000000,
                        //min:0
                        // alignTicks: true
                        //left: '10%'
                    }
                ],
                navigator: {
                    series: {
                        accessibility: {
                            exposeAsGroupOnly: true
                        }
                    }
                },
                plotOptions: {
                    column: {
                        pointWidth: 4,
                        color: '#404040'
                    }
                },
                series: [
                    {
                        type: 'area',
                        name: 'Stock Price',
                        // data: timestamps.map((timestamp, index) => [timestamp.getTime(), closePrices[index]]),
                        data: close,
                        threshold: null,
                        yAxis: 0,
                       // showInNavigator: true,
                        tooltip: {
                            valueDecimals: 2
                        },
                        fillColor: {
                            linearGradient: {
                                x1: 0,
                                y1: 0,
                                x2: 0,
                                y2: 1
                            },
                            stops: [
                                [0, Highcharts.getOptions().colors[0]],
                                [1, Highcharts.color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                            ]
                        }
                    },
                    {
                        type: 'column',
                        name: 'Volume',
                        // data: timestamps.map((timestamp, index) => [timestamp.getTime(), volumes[index]]),
                        data: volume,
                        pointPlacement: 'on',
                        yAxis: 1,
                        // min:0,
                        threshold:null,
                        tooltip: {
                            valueDecimals: 0
                        },
                        // pointWidth: 4,
                       // showInNavigator: false,
                        
                    }
                ],
                tooltip: {
                    split: true
                }
            });
        } else {
            console.error('Length mismatch between timestamps, close prices, and volumes');
        }
    } else {
        console.error('Invalid or missing data format:', data);
    }
}




function makeNews(data) {
    const newsContainer = document.getElementById("news");
    newsContainer.innerHTML = "";
    if (Array.isArray(data) && data.length > 0) {
        data.forEach(newsItem => {
            const newsDiv = document.createElement("div");
            newsDiv.classList.add("news-details");
            var date_human_2 = convertUnixTime(newsItem.datetime);

            const newsHTML = `
                <img class="news-image" src="${newsItem.image}">
                <div class="news-text">
                    <span class="news-headline">${newsItem.headline}</span>
                    <span class="news-date">${date_human_2}</span>
                    <a class="news-link" href="${newsItem.url}" target="_blank">See Original Post</a>
                </div>
            `;

            newsDiv.innerHTML = newsHTML;
            newsContainer.appendChild(newsDiv);
            const blankDiv = document.createElement("div");
            blankDiv.classList.add("news-blank");
            newsContainer.appendChild(blankDiv);
        });
    } else {
        console.error('Invalid or empty response:', data);
    }
}

/*
function makeNews(data) {
    const newsContainer = document.getElementById("news");
    newsContainer.innerHTML = "";
    if(Array.isArray(data) && data.length>0){
    data.forEach(newsItem => {
    
        const newsDiv = document.createElement("div");
        newsDiv.classList.add("news-details");
        var date_human_2=convertUnixTime(newsItem.datetime)
       
        const newsHTML = `
            
            <div class="news-details">
                <img class="news-image" src="${newsItem.image}" style="width: 90px; height: 100px; padding-top:15px; padding-left:15px; padding-bottom: 10px; padding-right: 15px;">
                <div class="news-text">
                    <span class="news-headline">${newsItem.headline}</span>
                    <span class="news-date">${date_human_2}</span>
                    <a class="news-link" href="${newsItem.url}" target="_blank">See Orignial Post</a>
                </div>
                <div class="news-blank" style="height:20px; background-color: white;"> </div>                 
            </div>   
        `;

        newsDiv.innerHTML = newsHTML;
        newsContainer.appendChild(newsDiv);
    });
    }
    else{
        console.error('Invalid or empty response:', data);
    }
}
*/
/*
function showSummary()
{
    document.getElementById("summary").style.display="block";
    document.getElementById("stock").style.display="none";
    document.getElementById("chart").style.display="none";
    document.getElementById("news").style.display="none";
    document.getElementById("error-box").style.display="none";

}
function showStock()
{
    document.getElementById("summary").style.display="none";
    document.getElementById("stock").style.display="block";
    document.getElementById("chart").style.display="none";
    document.getElementById("news").style.display="none";
    document.getElementById("error-box").style.display="none";
}
function showChart()
{
    document.getElementById("summary").style.display="none";
    document.getElementById("stock").style.display="none";
    document.getElementById("chart").style.display="block";
    document.getElementById("news").style.display="none";
    document.getElementById("error-box").style.display="none";
}
function showNews()
{
    document.getElementById("summary").style.display="none";
    document.getElementById("stock").style.display="none";
    document.getElementById("chart").style.display="none";
    document.getElementById("news").style.display="block";
    document.getElementById("error-box").style.display="none";
}
*/

function showErrorDiv()
{
    document.getElementById("error-box").style.display="block";
}


function hideNavBar() {
    var elements = document.getElementsByClassName("topnav-bar");
    for (var i = 0; i < elements.length; i++) {
        elements[i].style.display = "none";
    }
}

function showNavBar() {
    var elements = document.getElementsByClassName("topnav-bar");
    for (var i = 0; i < elements.length; i++) {
        elements[i].style.display = "block";
    }
}


function convertUnixTime(unixtime)
{

var unixMilliseconds = unixtime * 1000;
var dateObject = new Date(unixMilliseconds);
var year = dateObject.getFullYear();
var day = ('0' + dateObject.getDate()).slice(-2);
var monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
var month = monthNames[dateObject.getMonth()];
var dateString = day + ' ' + month + ', ' + year;
return dateString;

}

function adjustTimebyOneDay(minTimestamp, maxTimestamp)
{
    let minDate = new Date(minTimestamp);
    let maxDate = new Date(maxTimestamp);

    // Add one day to minDate
    minDate.setDate(minDate.getDate() + 1);

    // Subtract one day from maxDate
    maxDate.setDate(maxDate.getDate() - 1);

    // Convert the adjusted dates back to timestamps
    let adjustedMinTimestamp = minDate.getTime();
    let adjustedMaxTimestamp = maxDate.getTime();
    return [adjustedMinTimestamp, adjustedMaxTimestamp];
}
