
var usrTrackerDay = 0;
var usrTrackerMonth = 0;
var usrTrackerYear = 0;
var myChartPrev = 0;
var myChartPrevN = 0;
var myLatestVal = 0;
var detailChartPrev = 0;
var detailLatestVal = 0;
var latestVal = 0;
var stockTime = false;

var user = {
  name: 'Craig O\'Connor',
  portfolioValue: 0,
  buyingPower: 0,
  ticker: 'DOV',
  myTickers: ['MDXG','AMD','AMDA','AAPL'],
  watching: ['DOV','AAPL','GOOGL','AMD','PMTS','AMDA','MDXG','HALO','FIG','GPRO','FIT','TWTR','NFLX'],
  updates: [
    {
      label: 'down',
      top: 'PRICE MOVEMENT',
      time: 0,
      content: 'AMDA is down 3.96% to $0.73.',
      ticker: 'AMDA',
      click: 'VIEW AMDA'
    },
    {
      label: 'up',
      top: 'TOP GAINERS',
      time: 0,
      content: `Today's top S&P 500 gainers are DVA (+6.27%), L(+4.89%), and NEM (+4.73%).`,
      ticker: 'GAINER',
      click: 'SEE MORE'
    },
    {
      label: 'down',
      top: 'TOP LOSERS',
      time: 0,
      content: `Today's top S&P 500 losers are ZBH (-14.02%), CTL(-12.54%), and BHI (-6.29%).`,
      ticker: 'LOSERS',
      click: 'SEE MORE'
    }
  ]
};
var currentUpdates = user.updates;


//You're all caught up!
// New cards will be added here as
// they become available.

// START OVER

function updateMoney(div,latest,previ) {
  //Money setup:
  let moneyVal = latest;
  moneyVal = Math.round(moneyVal * 100) / 100;
  moneyVal = moneyVal.toString();
  let moneyVal2 = moneyVal.split('.');
  let dollarVal = moneyVal2[0];
  let changeVal = moneyVal2[1];
  if (changeVal != undefined){
    changeVal = changeVal.toString();
    let changeVal2 = changeVal[1];
    changeVal = changeVal[0];
    if (changeVal2 == undefined){
      changeVal2 = '0';
    }
    //int change:
    let difval = moneyVal - previ;
    difval = Math.round(difval * 10000) / 10000;
    let difperc = (moneyVal/previ)*100 - 100;
    difperc = Math.round(difperc * 100) / 100;
    let pos = (difval >= 0) ? '+' : '';
    if (div == '#myChart'){
      $('#top-dollar').text(dollarVal);
      $('#top-change-f').text(changeVal);
      $('#top-change-s').text(changeVal2);
      $('#top-inc-val').text(`${pos}${difval}`);
      $('#top-inc-perc').text(`(${difperc}%)`);
    }
    else if (div == '#myChart-detail'){
      $('#top-dollar-detail').text(dollarVal);
      $('#top-change-f-detail').text(changeVal);
      $('#top-change-s-detail').text(changeVal2);
      $('#top-inc-val-detail').text(`${pos}${difval}`);
      $('#top-inc-perc-detail').text(`(${difperc}%)`);
    }
  }

}

let optionsNoPlugins = {
  targetLine: {
    value: 0,
    class: 'ct-target-line'
  },
  showPoint: true,
  showLine: true,
  showArea: false,
  fullWidth: true,
  showLabel: false,
  axisX: {
    showGrid: false,
    showLabel: false,
    offset: 0,
    type: Chartist.FixedScaleAxis,
    divisor: 5,
    labelInterpolationFnc: function(value) {
      return moment(value).format('MMM D');
    }
  },
  axisY: {
    onlyInteger: false,
    allowDecimals: true,
    showGrid: false,
    showLabel: false,
    offset: 0,
  },
  chartPadding: 0,
  lineSmooth: Chartist.Interpolation.none({
    postpone: true,
    fillHoles: false
  })
};

let options = {
  series: {
    'line': {

    }
  },
  targetLine: {
    value: 0,
    class: 'ct-target-line'
  },
  plugins:[Chartist.plugins.ctCrosshair({})],
  showPoint: true,
  showLine: true,
  showArea: false,
  fullWidth: true,
  showLabel: false,
  axisX: {
    showGrid: false,
    showLabel: false,
    offset: 0,
    type: Chartist.FixedScaleAxis,
    divisor: 5,
    labelInterpolationFnc: function(value) {
      return moment(value).format('MMM D');
    }
  },
  axisY: {
    onlyInteger: false,
    allowDecimals: true,
    showGrid: false,
    showLabel: false,
    offset: 0,
  },
  chartPadding: 0,
  lineSmooth: Chartist.Interpolation.none({
    postpone: true,
    fillHoles: false
  })
};


$(document).on('click', ".container-watching", function(e) {
  if (e.target.id == "dlt"){
    let id = e.currentTarget.id.split('-')[2];
    let index = user.watching.indexOf(id);
    user.watching.splice(index,1);
    $(e.currentTarget).animate({height:"0"}, 200, function(){$(e.currentTarget).remove();});
  }
  $('#buy-sell').css({'width': 'calc(100vw - 20px)'});
  setTimeout(() => {
    let color = $('.objects').css('stroke');
    $('#svg-add-detail').css({'stroke':`${color}`,'fill':`${color}`,'cursor':'pointer'});
    $('#svg-added-detail').css({'stroke':`${color}`,'fill':`${color}`,'cursor':'pointer'});
  },1000);
});

$(document).on('click', ".stock-info", function(e) {
  let id = this.id;
  let idTicker = id.split('-');
  idTicker = idTicker[1];
  if (e.target.id == 'svg-add'){
    $(`#${this.id} .stock-add`).css({'display':'none'});
    $(`#${this.id} .stock-added`).css({'display':'block'});
    user.watching.push(idTicker);
    $('.container-watching').remove();
    addMainStocks(user.watching, updateMainValues,'watching');
    let color = $('.just-back').css('background-color');
    $('.stock-main-info').css({'background-color':`${color}`});
  }
  else if (e.target.id == 'svg-added'){
    $(`#${this.id} .stock-add`).css({'display':'block'});
    $(`#${this.id} .stock-added`).css({'display':'none'});
    let index = user.watching.indexOf(idTicker);
    user.watching.splice(index,1);
    $('.container-watching').remove();
    addMainStocks(user.watching,updateMainValues,'watching');
    let color = $('.just-back').css('background-color');
    $('.stock-main-info').css({'background-color':`${color}`});
  }
  else {
    $('.stock-detail').css({
      'transform': 'translateY(0)',
      'opacity': '1'
    });
    $('#ticker-detail').text(`${idTicker}`);
    stockDetailing(idTicker,'myChart-detail');
  }
});

$(document).on('click', ".container-myTickers", function(e) {
  $('#buy-sell').css({'width': 'calc(50vw - 20px)'});
  $('#svg-add-detail').css({'stroke':'grey','fill':'grey','cursor':'default'});
  $('#svg-added-detail').css({'stroke':'grey','fill':'grey','cursor':'default'});
});

$(document).on('scroll', function(e) {
  if ($(document).scrollTop() < 50) {
    $('.middle-bar').css({'opacity': '0'});
  }
  else {
    $('.middle-bar').css({'opacity': '1'});
  }
});

var pos1, pos2, vertical = false, clickerSet = false, divy;
var num = 0; nar = 0;
var color, opac;
var changedd = false;

// $(document).on('mousemove',".stock-main-info", function(e) {
//   $(this).on('mousewheel', function(event){
//     console.log(`x: ${event.deltaX}, y: ${event.deltaY}, dF: ${event.deltaFactor}`);
//   });
// });

$(document).on('mousedown', ".stock-main-info", function(e) {
  // let looper = this.currentTarget.offsetParent.nextSibling;
  $(document).one('mousemove',".containment-wrapper", function(e) {
    let diver = this;
    if (vertical == true) {

      vertical = false;
      $(`#my-stock`).trigger('sortupdate'); // Trigger the update event manually

      $(`#${this.id}`).css({
        'opacity': '0.7',
      });
      let whichof = $(`#${this.id}`).parent().get(0).id;
      let widget;
      if (whichof.includes('myTickers')){
        widget = $(`#my-stock-myTickers`).sortable();
      }
      else {
        widget = $(`#my-stock-watching`).sortable();
      }
      widget = widget.data('ui-sortable');

      widget.refresh();
      widget._mouseDown(e);


      $(document).bind('mouseup', diver, function(e){
        widget._mouseUp(e);

        $(`#${diver.id}`).css({
          'opacity': '1',
        });
        color = $(`.just-back`).css('background-color');
        $(`.stock-main-info`).css({
          'background-color': `${color}`
        });
        $(`.stock-main-info`).draggable();
        $(`.stock-main-info`).draggable( 'enable' );
        $(document).unbind('mousemove');
        $(document).unbind('mouseup');
      });
    }

  });


  divy = this.id;
  pos1 = this.id;
  clickerSet = true;
  pos1T = $(`#${pos1}`).offset().top;
  pos1 = $(`#${pos1}`).position().left;

  var timer1 = setTimeout((pos1) => {
    //vertical drag
    posT = this.id;
    posTT = $(`#${posT}`).offset().top;
    posT = $(`#${posT}`).position().left;

    let polla;
    if($(`#containment-wrapper-${divy} .delete`).css('display') == 'none') {
      polla = 150;
    }
    else {
      polla = 225;
    }
    if (posT == pos1 && posTT == pos1T && posT == polla && clickerSet && !vertical){
      color = $(`.border`).css('background-color');
      $(`#${this.id}`).css({'background-color': `${color}`});
      let widget = $(`#${this.id}`).draggable( 'disable' );
      widget = widget.data('ui-draggable');
      widget._mouseUp(e);
      $(document).unbind('mouseup');
      vertical = true;

    }
  },900,pos1);

  $(document).bind('mousemove', divy, function(e){
    clearTimeout(timer1);
  });

  $(document).bind('mouseup', divy, function(e){
    // $(document).off('mousedown', divy);
    $(document).unbind('mousemove');
    let classy = $(`#${divy}`).draggable().get(0);
    classy = $(classy).attr("class");
    clickerSet = false;
    if (typeof divy == 'number'){
      divy = divySave;
    }
    divySave = divy;
    $(`#${divy}`).css({'background-color': `${color}`});
    divyLeft = $(`#${divy}`).position().left;
    if (pos1 != divyLeft){
      //move left or right:
      if($(`#containment-wrapper-${divy} .delete`).css('display') == 'none'){
        if (divyLeft > 75){
          //move back
          $(`#${divySave}`).css({'transition': '0.3s'});
          $(`#${divySave}`).css({'left': '150px'});
          setTimeout(() => {$(`#${divySave}`).css({'transition': '0s'});},350);
        }
        else {
          //move to position left
          // $('html').one('mousedown',function() {
          //   $(`#${divySave}`).css({'transition': '0.3s'});
          //   $(`#${divySave}`).css({'left': '150px'});
          //   setTimeout(() => {$(`#${divySave}`).css({'transition': '0s'});},350);
          // });
          // e.stopPropagation();
          $(`#${divySave}`).css({'transition': '0.3s'});
          $(`#${divySave}`).css({'left': '0px'});
          setTimeout(() => {$(`#${divySave}`).css({'transition': '0s'});},350);
        }
      }
      else {
        if (divyLeft > 100){
          //move back
          $(`#${divySave}`).css({'transition': '0.3s'});
          $(`#${divySave}`).css({'left': '225px'});
          setTimeout(() => {$(`#${divySave}`).css({'transition': '0s'});},350);
        }
        else {
          //move to position left
          // $('html').one('mousedown',function() {
          //   $(`#${divySave}`).css({'transition': '0.3s'});
          //   $(`#${divySave}`).css({'left': '150px'});
          //   setTimeout(() => {$(`#${divySave}`).css({'transition': '0s'});},350);
          // });
          // e.stopPropagation();
          $(`#${divySave}`).css({'transition': '0.3s'});
          $(`#${divySave}`).css({'left': '0px'});
          setTimeout(() => {$(`#${divySave}`).css({'transition': '0s'});},350);
        }
      }
    }
    else {
      //if position is NOT 150, set it to 150
      if($(`#containment-wrapper-${divy} .delete`).css('display') == 'none'){
        if (divyLeft != 150){
          $(`#${divySave}`).css({'transition': '0.3s'});
          $(`#${divySave}`).css({'left': '150px'});
          setTimeout(() => {$(`#${divySave}`).css({'transition': '0s'});},350);
        }
        else {
          //open the tickers info:
          let id = divySave;
          $('.stock-detail').css({
            'transform': 'translateY(0)',
            'opacity': '1'
          });
          $('body').addClass('stop-scrolling');
          $('#ticker-detail').text(`${id}`);
          $(document).unbind('mouseup');
          stockDetailing(id,'myChart-detail');
        }
      }
      else {
        if (divyLeft != 225){
          $(`#${divySave}`).css({'transition': '0.3s'});
          $(`#${divySave}`).css({'left': '225px'});
          setTimeout(() => {$(`#${divySave}`).css({'transition': '0s'});},350);
        }
        else {
          //open the tickers info:
          let id = divySave;
          $('.stock-detail').css({
            'transform': 'translateY(0)',
            'opacity': '1'
          });
          $('body').addClass('stop-scrolling');
          $('#ticker-detail').text(`${id}`);
          $(document).unbind('mouseup');
          stockDetailing(id,'myChart-detail');
        }
      }
    }
    $(document).unbind('mouseup');
    return;
  });
  //$(document).off('mousedown', ".stock-main-info", function(e) {});
  return;
});

function bindMouseToUpdates (count) {
  for (let i = 0; i < count; i++) {
    $(document).on('mousedown', `#updates-inner-${i}`, function(e) {

      $(document).bind('mouseup', `#updates-inner-${i}`, function(e){
        $(`#updates-inner-${i}`).css({'transition':'0.25s'});
        $(`#updates-inner-${i+1}`).css({'transition':'0.25s'});
        $('#update-circle-text').css({'transition':`0.5s`});
        //console.log(`opac: ${opac}`);
        if (opac <= 0.75){
          //finish the movement
          if (parseInt($('#update-circle-text').text()) <= 1){
            $('#update-circle').css({'transition':`1s`});
            $('#update-circle').css({
              'transform':`scale(120)`
            });
            $('#update-circle-text').css({
              'opacity':`0`,
              'transform':`scale(1)`
            });
            setTimeout(() => {
              $('#svg-cat').css({
                'display':`block`,
                'opacity':`1`,
              });
            },450);
            setTimeout(() => {
              $('#svg-cat').css({
                'display':`none`,
                'opacity':`0`,
              });
              $('#start-over').css({
                'display':'block'
              })
              $('#update-circle').css({
                'transition':`0.5s`,
              });
              $('#update-circle').css({
                'transform':`scale(0)`
              });
            },1000);
          }
          else {
            $('#update-circle-text').css({
              'opacity':`1`,
              'transform':`scale(1)`
            });
          }
          dragPos = $( `#updates-inner-${i}` ).offset().left;
          let windowWidth = $( document ).width();
          if (dragPos > 0){
            //move right
            dragPos = $( `#updates-inner-${i}` ).offset();
            dragPos.left = windowWidth;
            $(`#updates-inner-${i}`).offset(dragPos);
            let circleText = parseInt($('#update-circle-text').text());
            circleText--;
            $('#update-circle-text').text(circleText);
            setTimeout(() => {
              $(`#updates-inner-${i}`).remove();
              $(document).off('mousedown',`#updates-inner-${i}`);
            },300);
          }
          else {
            //move left
            dragPos = $( `#updates-inner-${i}` ).offset();
            dragPos.left = -windowWidth;
            $(`#updates-inner-${i}`).offset(dragPos);
            let circleText = parseInt($('#update-circle-text').text());
            circleText--;
            $('#update-circle-text').text(circleText);
            setTimeout(() => {
              $(`#updates-inner-${i}`).remove();
              $(document).off('mousedown',`#updates-inner-${i}`);
            },300);
          }
          $( `#updates-inner-${i+1}` ).css({
            'opacity':'1',
            'transform':'scale(1)'
          });
        }
        else {
          //put it back
          changedd = false;
          $('#update-circle').css({'transition':`0.3s`});
          $('#update-circle-text').css({'transition':`0.3s`});
          $('#update-circle').css({
            'opacity':`1`,
            'transform':`scale(1)`
          });
          $('#update-circle-text').css({'opacity':`1`,'transform':'scale(1)'});
          $(`#updates-inner-${i}`).css({
            'transition-timing-function': 'cubic-bezier(.17,-.41,.19,1.44)'
          });
          dragPos = $( `#updates-inner-${i}` ).offset();
          dragPos.left = 7.5;
          $(`#updates-inner-${i}`).offset(dragPos);
          //$(`#updates-inner-${i}`).offset(0);
          $('#update-circle').css({'transition':`0s`});
          $('#update-circle-text').css({'transition':`0s`});
        }
        setTimeout(() => {
          $(`#updates-inner-${i}`).css({
            'transition':'0s',
            'transition-timing-function': 'none'
          });
          $(`#updates-inner-${i+1}`).css({'transition':'0s'});
          $('#update-circle-text').css({'transition':`0s`});
          $(document).unbind('mouseup');
        },300);
      });
    });
  }
}

function stockDetailing (id,div) {
  let chartDate = [];
  let prevClose = 0;

  //lets get some data:
  let xmlHttpChart = new XMLHttpRequest();
  xmlHttpChart.onreadystatechange = function() {
      if (xmlHttpChart.readyState == 4 && xmlHttpChart.status == 200){
        currentOpen = xmlHttpChart.responseText;
        currentOpen = currentOpen.split('\n');
        prevClose = currentOpen[8];
        $('#stock-prev-close').text(`${prevClose}`);
        prevClose = parseFloat(prevClose.slice(15,21));
        startDate = currentOpen[9];
        startDate = startDate.split(':');
        startDate = startDate[1].split(',');
        endDate = startDate[1];
        startDate = startDate[0];
        startDate = new Date(parseInt(startDate)*1000);
        endDate = new Date(parseInt(endDate)*1000);
        lastPoint = currentOpen[currentOpen.length-2];
        lastPoint = lastPoint.split(',');
        lastPoint = lastPoint[4];
        latestVal = lastPoint;
        latestVal = Math.round(latestVal * 100) / 100;
        if (div == 'myChart'){
          myChartPrev = prevClose;
          myChartPrevN = currentOpen[8];
          myLatestVal = latestVal;
          $('.middle-bar').text(`$${myLatestVal}`);
        }
        else if (div == 'myChart-detail'){
          detailChartPrev = prevClose;
          detailLatestVal = latestVal;
        }
        if (lastPoint < prevClose){
          $('.fonts').css({"color":"#f1563a"});
          $('.objects').css({"stroke":"#f1563a","color":"#222"});
          $('.objects-fill').css({"fill":"#f1563a"});
          $('.backgrounding').css({"background-color":"#f1563a","color":"#222"});
          $(`#${div}`).css({"stroke": "#f1563a"});
        }
        else {
          $('.fonts').css({"color":"#30cd9a"});
          $('.objects').css({"stroke":"#30cd9a","color":"#ededed"});
          $('.objects-fill').css({"fill":"#30cd9a"});
          $('.backgrounding').css({"background-color":"#30cd9a","color":"#ededed"});
          $(`#${div}`).css({"stroke": "#30cd9a"});
        }
        currentOpen = currentOpen.slice(17,currentOpen.length-1);
        currentOpen.forEach((value,i) => {
          if (i % 5 == 0){
            value = value.split(',');
            obj = {'x':0,'y':0};
            obj.x = new Date(parseInt(value[0])*1000);
            obj.y = parseFloat(value[1]);
            chartDate.push(obj);
          }
        });

        startDate = chartDate[0].x;
        //endDate = chartDate[chartDate.length-1].x;

        let chart = new Chartist.Line(`#${div}`, {
          labels: ['W1'],
          series: [
            {
              name: 'line',
              data: [{'x':startDate,'y':prevClose},{'x':endDate,'y':prevClose}],
            },
            {
              name: 'series',
              data: chartDate,
            }
          ]
        }, options);

        chart.on('draw', function(data) {
          if(data.type === 'point') {
                    data.element.attr({
                    style: 'stroke-width: 2px'
                    });
            };
        });

        chart.on('created', function(data) {
          checkCollision();
        });


      }
      // if (div == 'myChart'){
      //   myChartPrev = prevClose;
      //   myLatestVal = latestVal;
      //   $('.middle-bar').text(`$${myLatestVal}`);
      // }
      // else if (div == 'myChart-detail'){
      //   detailChartPrev = prevClose;
      //   detailLatestVal = latestVal;
      // }
      //update money:
      if (div == 'myChart'){
        updateMoney(`#${div}`,myLatestVal,myChartPrev);
      }
      else {
        updateMoney(`#${div}`,detailLatestVal,detailChartPrev);
      }
  }
  xmlHttpChart.open("GET", `http://chartapi.finance.yahoo.com/instrument/2.0/${id}/chartdata;type=quote;range=1d/csv`, true); // true for asynchronous
  xmlHttpChart.setRequestHeader( 'Access-Control-Allow-Origin', '*');
  xmlHttpChart.send();
}

function flashCards () {
  $('#update-circle-text').text(`${currentUpdates.length}`);
  currentUpdates.forEach((update,i) => {
    let updateSVG;
    if (update.label == 'up'){
      updateSVG =  `<svg version="1.1" class="label-svg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
      width="17.1px" height="17.1px" viewBox="0 0 17.1 17.1" style="enable-background:new 0 0 17.1 17.1;" xml:space="preserve">
        <circle id="circle" style="fill:none;stroke:#757575;stroke-miterlimit:10;" cx="8.6" cy="8.6" r="8.1"/>
        <g id="arrow">

            <line style="fill:none;stroke:#757575;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;" x1="4.8" y1="4.7" x2="12.4" y2="4.7"/>

            <line style="fill:none;stroke:#757575;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;" x1="12.4" y1="12.4" x2="12.4" y2="4.9"/>

            <line style="fill:none;stroke:#757575;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;" x1="4.8" y1="12.3" x2="12.4" y2="4.7"/>
        </g>
      </svg>`;
    }
    else {
      updateSVG = `<svg version="1.1" class="label-svg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
      width="17.1px" height="17.1px" viewBox="0 0 17.1 17.1" style="enable-background:new 0 0 17.1 17.1;" xml:space="preserve">
        <circle id="circle" style="fill:none;stroke:#757575;stroke-miterlimit:10;" cx="8.6" cy="8.6" r="8.1"/>
        <g id="arrow">

            <line style="fill:none;stroke:#757575;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;" x1="12.4" y1="4.8" x2="12.4" y2="12.4"/>

            <line style="fill:none;stroke:#757575;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;" x1="4.7" y1="12.4" x2="12.2" y2="12.4"/>

            <line style="fill:none;stroke:#757575;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;" x1="4.8" y1="4.8" x2="12.4" y2="12.4"/>
        </g>
      </svg>`;
    }
    $( "#main-holder" ).prepend( `
      <div class="main" id="updates-inner-${i}">

        <div class="update-label-svg">
          ${updateSVG}
        </div>

        <div class="update-info">
          <span class="update-label-type">${update.top}</span>
          <span class="update-label-time">${update.time}</span>
        </div>

        <div class="update-content">${update.content}</div>

        <div class="update-click">
          <div class="fonts" id="update-clicker">
            <span class="fonts" id="update-clicker-words">${update.click}</span>
          </div>

          <div id="update-clicker-svg">
            <svg version="1.1" id="arrow-right" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px"
            y="0px" width="7.6px" height="13.2px" viewBox="0 0 7.6 13.2" style="enable-background:new 0 0 7.6 13.2;" xml:space="preserve">
              <g class="objects" id="arrow-right_1_">

                  <line style="fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;" x1="1" y1="1" x2="6.6" y2="6.6"/>

                  <line style="fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;" x1="1" y1="12.2" x2="6.6" y2="6.6"/>
              </g>
            </svg>
          </div>
        </div>

      </div>
      ` );
      let color = $('.just-back').css('background-color');
      let svgColor = $('.fonts').css('color');
      $('.main').css({'background-color':`${color}`});
      $('#update-clicker-words').css({'color':`${svgColor}`});
      $('#update-clicker-svg').css({'stroke':`${svgColor}`});
      if (i != 0){
        $( `#updates-inner-${i}` ).css({
          'opacity':'0',
          'transform':'scale(0.8)'
        });
      }
      $( `#updates-inner-${i}` ).draggable({
        containment: "#main-holder",
        scroll: false,
        drag: () => {
          let dragPos = $( `#updates-inner-${i}` ).offset().left;
          dragPos = Math.abs(dragPos);
          opac = ( ($( document ).width() - dragPos) / $( document ).width() );
          opac = Math.round(opac * 100) / 100;
          opac2 = 1 - opac;
          let scale2 = 0.75;
          scale2 += opac2 / 5;
          scale2 = Math.round(scale2 * 100) / 100;
          let scaleCircle = 1;
          scaleCircle = scaleCircle*(Math.pow((1+opac2),6));
          if (parseInt($('#update-circle-text').text()) < 2){
            $('#update-circle').css({'transform':`scale(${scaleCircle})`});
          }
          let textOpacity = 1;
          textOpacity -= (1 - opac)*2;
          let textScale = 1;
          textScale +=(1 - opac)*2;
          $('#update-circle-text').css({
            'opacity':`${textOpacity}`,
            'transform':`scale(${textScale})`
          });

          $( `#updates-inner-${i+1}` ).css({
            'opacity':`${opac2}`,
            'transform':`scale(${scale2})`
          });

        }
      });
  });
  bindMouseToUpdates(currentUpdates.length);
}


function updateUnderTow (id) {
  //get id width and left-pos:
  let width = $(`#${id}`).width();
  let leftPos = $(`#${id}`).offset().left;
  //set those to updateUnderTow:
  $(`#choose-time-undertow`).css({
    'transform': `translateX(${leftPos-5}px)`,
    'width': `${width+10}`,
  });
};

function updateUnderTowDetail (id) {
  //get id width and left-pos:
  let width = $(`#${id}`).width();
  let leftPos = $(`#${id}`).offset().left;
  //set those to updateUnderTow:
  $(`#choose-time-undertow-detail`).css({
    'transform': `translateX(${leftPos-5}px)`,
    'width': `${width+10}`,
  });
};

function collision($div1, $div2) {
  let x1 = $div1.offset().left;
  let y1 = $div1.offset().top;
  let h1 = $div1.outerHeight(true);
  let w1 = $div1.outerWidth(true);
  let b1 = y1 + h1;
  let r1 = x1 + w1;
  let x2 = $div2.offset().left;
  let y2 = $div2.offset().top;
  let h2 = $div2.outerHeight(true);
  let w2 = $div2.outerWidth(true);
  let b2 = y2 + h2;
  let r2 = x2 + w2;

  if (b1 < y2 || y1 > b2 || r1 < x2 || x1 > r2) return false;
  return true;
}

function checkCollision() {
  let collisiont = false;
  $.each( $('.containment-wrapper'), function(i, div) {
     if (collision($(`#${div.id} .stock-name`),$(`#${div.id} .stock-data`))){
       collisiont = true;
     }
  });
  if (collisiont){
    $('.stock-name').css({'opacity':'0'});
  }
  else {
    $('.stock-name').css({'opacity':'1'});
  }
}


$(document).ready(function(){


  od = new Odometer({
    el: document.querySelector("#top-dollar"),
    theme: 'default',
    format: '(,ddd)',
  });

  od2 = new Odometer({
    el: document.querySelector("#top-change-f"),
    theme: 'default',
    format: '(dd)',
  });

  od3 = new Odometer({
    el: document.querySelector("#top-change-s"),
    theme: 'default',
    format: '(dd)',
  });

  detailOd = new Odometer({
    el: document.querySelector("#top-dollar-detail"),
    theme: 'default',
    format: '(,ddd)',
  });

  detailOd2 = new Odometer({
    el: document.querySelector("#top-change-f-detail"),
    theme: 'default',
    format: '(dd)',
  });

  detailOd3 = new Odometer({
    el: document.querySelector("#top-change-s-detail"),
    theme: 'default',
    format: '(dd)',
  });

  updateUnderTow("OD");
  updateUnderTowDetail("OD-detail");

  flashCards();

  stockDetailing(user.ticker,'myChart');



  //set all main page stocks:
  //myStock
  addMainStocks(user.myTickers,updateMainValues,'myTickers');
  //add a watching seperator:
  // $("#my-stock").append('<div class="watchlist"><span id="watchlist-text">WATCHLIST</span></div>');
  //add watchting:
  addMainStocks(user.watching,updateMainValues,'watching');
  $( `#my-stock-myTickers` ).sortable({
    axis: "y",
    containment: "parent",
    tolerance: 'pointer'
  });
  $( `#my-stock-watching` ).sortable({
    axis: "y",
    containment: "parent",
    tolerance: 'pointer'
  });



  //mouse in and out for mychart:
  $('#myChart').mouseenter(() => {
    $('#myChart .ct-cross-line').css({'stroke': 'grey'});
  });

  $('#myChart').mouseleave(() => {
    $('#line-date').css({'left':'-50px'});
    $('#myChart .ct-cross-line').css({'stroke': 'none'});

    //set latest money close
    updateMoney('#myChart',myLatestVal, myChartPrev);
  });

  //mouse in and out for mychart:
  $('#myChart-detail').mouseenter(() => {
    $('#myChart-detail .ct-cross-line').css({'stroke': 'grey'});
  });

  $('#myChart-detail').mouseleave(() => {
    $('#line-date-detail').css({'left':'-50px'});
    $('#myChart-detail .ct-cross-line').css({'stroke': 'none'});

    //set latest money close
    updateMoney('#myChart-detail',detailLatestVal,detailChartPrev);
  });


  let date = new Date();
  let day = date.getDay();
  let hour = date.getHours();
  let min = date.getMinutes();
  if (day < 1 || day > 5 || hour > 16 || hour < 9 || (hour == 9 && min < 30)) {
    stockTime = false;
    $("html, body").css({
      "background-color": "#222",
      "color": "#ededed"
    });
    $(".border").css({
      "background-color": "#303030",
      "color": "#ededed"
    });
    $(".main").css({
      "background-color": "#222",
      "color": "#ededed"
    });
    $('.just-back').css({
      "background-color": "#222",
    });
    $('.just-color').css({
      "color": "#ededed",
    });
    $('.back-font').css({
      "background-color": "#222",
      "color": "#ededed",
      "-webkit-text-fill-color": "#ededed"
    });
  }
  else {
    stockTime = true;
    $("html, body").css({
      "background-color": "#ededed",
      "color": "#222"
    });
    $(".border").css({
      "background-color": "#b4bcbf",
      "color": "#222"
    });
    $(".main").css({
      "background-color": "#ededed",
      "color": "#222"
    });
    $(".just-back").css({
      "background-color": "#ededed",
    });
    $('.just-color').css({
      "color": "#222",
    });
    $('.back-font').css({
      "background-color": "#ededed",
      "color": "#222",
      "-webkit-text-fill-color": "#222"
    });
  }
  let color = $(`.just-color`).css('color');
  $(`#OD`).css({'color':`${color}`});
  $(`#OD-detail`).css({'color':`${color}`});

  var savePos = 0;
  //Start Over's functionality:
  $('#start-over').draggable({
    containment: "#main-holder",
    scroll: false,
    start: function (event, ui) {
      savePos = ui.position.left;
    },
    drag: function(event, ui) {
      let something = 1/Math.pow((1 - 0.00028),-Math.abs(ui.originalPosition.left - ui.position.left));
      //console.log(0.5 + (1 - something));
      // console.log(something);
      // console.log(savePos - ui.position.left);
      // console.log(`opl: ${ui.originalPosition.left}`);
      // console.log(`pl: ${ui.position.left}`);
      // console.log(`opl - pl: ${ui.originalPosition.left - ui.position.left}`);
      // console.log(`full: ${(ui.originalPosition.left - ui.position.left) * (0.5 + (1 - something))}`);
      ui.position.left += ((ui.originalPosition.left - ui.position.left) * (0.5 + (1 - something)));
      savePos = ui.position.left;
      // if ((mult / percent) < 0.77) {
      //   ui.position.left += ((ui.originalPosition.left - ui.position.left) * (0.5 + (1 - something)));
      //   savePos = ui.position.left;
      // }
      // else {
      //   ui.position.left = savePos;
      // }
    }
  });

  $('#start-over').mouseup(() => {
    $('#start-over').css({
      'transition': '0.3s',
      'transition-timing-function': 'cubic-bezier(.17,-.41,.19,1.44)'
    });
    let startTop = $('#start-over').offset().top;
    $('#start-over').offset({left: 7.5,top:startTop});
    setTimeout(() => {
      $('#start-over').css({
        'transition': '0s',
        'transition-timing-function': 'none'
      });
    }, 350);
  });


  //USER INTERACTIONS:

  $( window ).resize(() => {
    //collision($div1, $div2)
    checkCollision();
    let arr = ['#OD','#OW','#OM','#TM','#OY','#ALL'];
    let id;
    arr.forEach((v) => {
      if ($(`${v}`).css('color') == 'rgb(237, 237, 237)'){
        id = v;
      }
    });
    let leftPos = $(`${id}`).offset().left;
    //set those to updateUnderTow:
    $(`#choose-time-undertow`).css({
      'transform': `translateX(${leftPos-5}px)`,
    });

  });




  //CLICKS

  $(".user").click(() => {
    $(".navigation").css({"left": "-20px"});
    $(".ADD").css({"display":"block"});
  });

  $(".ADD").click(() => {
    $(".ADD").css({"display":"none"});
    $(".navigation").css({"left": "-300px"});
  });

  $(".search").click(() => {
    $('body').addClass('stop-scrolling');
    $(".searches").css({
      "transform": "translateY(0px)",
      "opacity": "1"
    });
    setTimeout(() => { $("#stockSearch").focus(); }, 650);
  });

  $(".exit-in").click(() => {
    $(".searches").css({
      "transform": "translateY(100vh)",
      "opacity": "0"
    });
    $("#stockSearch").val('');
    $('.stock-info').remove();
    $('body').removeClass('stop-scrolling');
    $('#stock-prev-close').text(`${myChartPrevN}`);
    updateMoney(`#myChart`,myLatestVal,myChartPrev);
  });

  $(".exit-in-2").click(() => {
    $('#stock-prev-close').text(`${myChartPrevN}`);
    updateMoney(`#myChart`,myLatestVal,myChartPrev);
    if ( $('.searches').css('opacity') == 0 ) {
      $('body').removeClass('stop-scrolling');
    }
    if (myLatestVal < myChartPrev){
      $('.fonts').css({"color":"#f1563a"});
      $('.objects').css({"stroke":"#f1563a","color":"#222"});
      $('.backgrounding').css({"background-color":"#f1563a","color":"#222"});
      $(`#myChart`).css({"stroke": "#f1563a"});
    }
    else {
      $('.fonts').css({"color":"#30cd9a"});
      $('.objects').css({"stroke":"#30cd9a","color":"#ededed"});
      $('.backgrounding').css({"background-color":"#30cd9a","color":"#ededed"});
      $(`#myChart`).css({"stroke": "#30cd9a"});
    }
    $(".stock-detail").css({
      "transform": "translateY(100vh)",
      "opacity": "0"
    });
  });


  $('#choose-time > span').click((e) => {
    let id = e.target.id;
    $(`#choose-time-undertow`).css({'transition': '0.6s'});
    $("#OD").css({'color':'inherit'});
    $("#OW").css({'color':'inherit'});
    $("#OM").css({'color':'inherit'});
    $("#TM").css({'color':'inherit'});
    $("#OY").css({'color':'inherit'});
    $("#ALL").css({'color':'inherit'});
    let color = $(`.just-color`).css('color');
    $(`#${id}`).css({'color':`${color}`});
    updateUnderTow(id);
  });

  $('#choose-time-detail > span').click((e) => {
    let id = e.target.id;
    $(`#choose-time-undertow-detail`).css({'transition': '0.6s'});
    $("#OD-detail").css({'color':'inherit'});
    $("#OW-detail").css({'color':'inherit'});
    $("#OM-detail").css({'color':'inherit'});
    $("#TM-detail").css({'color':'inherit'});
    $("#OY-detail").css({'color':'inherit'});
    $("#ALL-detail").css({'color':'inherit'});
    let color = $(`.just-color`).css('color');
    $(`#${id}`).css({'color':`${color}`});
    updateUnderTowDetail(id);
  });

  $('#redo-over').click(() => {
    $('.main').remove();
    $('#update-circle').css({
      'transform':`scale(1)`,
      'transition':'0s',
      'top': '0px',
    });
    $('#update-circle-text').css({
      'opacity':`1`,
      'transform':`scale(1)`
    });
    flashCards();
    $('#start-over').css({'display': 'none'});
  })

  //setInterval(function() { ObserveInputValue($('#input_id').val()); }, 100);

  $('#stockSearch').on("focus",function() {
   var elem = $(this);

   // Save current value of element
   elem.data('oldVal', elem.val());

   // Look for changes in the value
   elem.bind("propertychange change click keyup input paste", function(event){
      // If value has changed...
      if (elem.data('oldVal') != elem.val()) {
       // Updated stored value
       elem.data('oldVal', elem.val());

       // Do action
       updateSearch(elem.val(),addStocks);
     }
   });
 });


});

function updateSearch (val,callback) {
  $('.stock-info').remove();
  let xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function() {
      if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
        callback(xmlHttp.responseText,updateValues);
      }
  }
  xmlHttp.open("GET", `http://d.yimg.com/aq/autoc?query=${val}&region=US&lang=en-US`, true); // true for asynchronous
  xmlHttp.setRequestHeader( 'Access-Control-Allow-Origin', '*');
  xmlHttp.send();

}

function addStocks (stocks,callback) {

  stocks = JSON.parse(stocks);
  stocks = stocks.ResultSet;
  stocks = stocks.Result;
  stocks.forEach((stock) => {
    if (stock.exchDisp == 'NYSE' || stock.exchDisp == 'NASDAQ'){
      $(".searches").append(`
      <div class="stock-info" id="info-${stock.symbol}">

        <div class="stock-left">
          <div class="stock-symbol just-color">${stock.symbol}</div>
          <div class="stock-name">${stock.name}</div>
          <div class="stock-exchange">${stock.exchDisp}</div>
        </div>

        <div class="stock-data"></div>
        <div class="stock-value"></div>

        <div class="stock-add">
          <svg version="1.1" id="svg-add" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
          width="19.7px" height="19.7px" viewBox="0 0 19.7 19.7" style="enable-background:new 0 0 19.7 19.7;" xml:space="preserve">
            <circle id="svg-add" style="fill:none;stroke-miterlimit:10;" cx="9.8" cy="9.8" r="9.3"/>
            <g id="svg-add">

              <line id="svg-add" style="fill:none;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;" x1="9.8" y1="5.2" x2="9.8" y2="14.5"/>

              <line id="svg-add" style="fill:none;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;" x1="5.2" y1="9.8" x2="14.5" y2="9.8"/>
            </g>
          </svg>
        </div>
        <div class="stock-added">
          <svg version="1.1" id="svg-added" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
          width="19.7px" height="19.7px" viewBox="0 0 19.7 19.7" style="enable-background:new 0 0 19.7 19.7;" xml:space="preserve">
            <path id="svg-added" style="stroke-miterlimit:10;" d="M9.8,0.5c-5.2,0-9.3,4.2-9.3,9.3s4.2,9.3,9.3,9.3
            c5.2,0,9.3-4.2,9.3-9.3S15,0.5,9.8,0.5z M16.1,7.3l-7.3,7.3c0,0,0,0,0,0c-0.3,0.3-0.7,0.4-1.1,0.4S7,14.9,6.7,14.6l-3.2-3.2
            C3,10.9,3,9.9,3.6,9.3c0.6-0.6,1.5-0.6,2.1,0l2.1,2.1L14,5.2c0.6-0.6,1.5-0.6,2.1,0C16.7,5.8,16.7,6.8,16.1,7.3z"/>
          </svg>
        </div>

        <div class="line"></div>

      </div>
      `);
      $(`#info-${stock.symbol} .stock-data`).css({
        'right':'160px',
        'width': '30vw'
      });
    }
  });
  callback();
}

function updateValues () {
  $('.stock-info').each(function(i, obj) {
    let idName = $(this);
    idName = idName[0].id;
    let currentOpen = 0;
    let idTicker = idName.split('-');
    idTicker = idTicker[1];

    //get money info:
    let xmlHttp2 = new XMLHttpRequest();
    xmlHttp2.onreadystatechange = function() {
        if (xmlHttp2.readyState == 4 && xmlHttp2.status == 200){
          currentOpen = xmlHttp2.responseText;
          currentOpen = currentOpen.split('\n');
          currentOpen = currentOpen[currentOpen.length-2];
          currentOpen = currentOpen.split(',');
          currentOpen = currentOpen[4];
          currentOpen = (Math.round(currentOpen * 100) / 100).toFixed(2);
          //set value
          if (isNaN(currentOpen)){
            $(`#${idName}`).remove();
            return;
          }
          $(`#${idName} .stock-value`).text(`$${currentOpen}`);

          //make a chart:
          currentOpen = xmlHttp2.responseText;
          currentOpen = currentOpen.split('\n');
          prevClose = currentOpen[8];
          prevClose = parseFloat(prevClose.slice(15,21));
          startDate = currentOpen[9];
          startDate = startDate.split(':');
          startDate = startDate[1].split(',');
          endDate = startDate[1];
          startDate = startDate[0];
          startDate = new Date(parseInt(startDate)*1000);
          endDate = new Date(parseInt(endDate)*1000);
          lastPoint = currentOpen[currentOpen.length-2];
          lastPoint = lastPoint.split(',');
          lastPoint = lastPoint[4];
          if (lastPoint < prevClose){
            $(`#${idName} .stock-data`).css({"stroke": "#f1563a"});
            $(`#${idName} .stock-value`).css({"background-color":"#f1563a"});
            $(`#${idName} .stock-add`).css({"stroke": "#f1563a"});
            $(`#${idName} .stock-added`).css({"fill": "#f1563a", "stroke":"#f1563a"});
          }
          else {
            $(`#${idName} .stock-data`).css({"stroke": "#30cd9a"});
            $(`#${idName} .stock-value`).css({"background-color":"#30cd9a"});
            $(`#${idName} .stock-add`).css({"stroke": "#30cd9a"});
            $(`#${idName} .stock-added`).css({"fill": "#30cd9a","stroke":"#30cd9a"});
          }
          if (user.watching.includes(idTicker)){
            $(`#${idName} .stock-add`).css({'display':'none'});
            $(`#${idName} .stock-added`).css({'display':'block'});
          }
          currentOpen = currentOpen.slice(17,currentOpen.length-1);
          chartDate = [];
          currentOpen.forEach((value,i) => {
            if (i % 5 == 0){
              value = value.split(',');
              obj = {'x':0,'y':0};
              obj.x = new Date(parseInt(value[0])*1000);
              obj.y = parseFloat(value[1]);
              chartDate.push(obj);
            }
          });

          startDate = chartDate[0].x;
          //endDate = chartDate[chartDate.length-1].x;
          let chart = new Chartist.Line(`#${idName} .stock-data`, {
            labels: ['W1'],
            series: [
              {
                name: 'line',
                data: [{'x':startDate,'y':prevClose},{'x':endDate,'y':prevClose}],
              },
              {
                name: 'series',
                data: chartDate,
              }
            ]
          }, optionsNoPlugins);

          chart.on('draw', function(data) {
            if(data.type === 'point') {
                      data.element.attr({
                      style: 'stroke-width: 2px'
                      });
              };
          });
        }
    }
    xmlHttp2.open("GET", `http://chartapi.finance.yahoo.com/instrument/2.0/${idTicker}/chartdata;type=quote;range=1d/csv`, true); // true for asynchronous
    xmlHttp2.setRequestHeader( 'Access-Control-Allow-Origin', '*');
    xmlHttp2.send();

  });
}

function addMainStocks (stocks,callback,which) {
  stocks.forEach((stock,i) => {
    if (which == 'watching' && user.myTickers.includes(stock)) {

    }
    else {
      $(`#my-stock-${which}`).append(`
      <div class="containment-wrapper container-${which}" id="containment-wrapper-${stock}">
        <div class="buy" id="by">BUY</div>
        <div class="sell" id="sll">SELL</div>
        <div class="delete" id="dlt">DELETE</div>
        <div class="stock-main-info just-back" id="${stock}">

          <div class="stock-left">
            <div class="stock-symbol just-color">${stock}</div>
            <div class="stock-name"></div>
          </div>

          <div class="stock-data"></div>
          <div class="stock-main-value"></div>

          <div class="line"></div>

        </div>
      </div>
      `);

      if (which == 'watching'){
        $(`#my-stock-${which} .sell`).css({'display':'none'});
        $(`#my-stock-${which} .containment-wrapper`).css({
          'width': 'calc(100vw + 225px)',
          'transform': 'translateX(-225px)'
        });
      }
      if (which == 'myTickers'){
        $(`#my-stock-${which} .delete`).css({'display':'none'});
        $(`#my-stock-${which} .buy`).css({'right':'75px'});
      }

      $( `#${stock}` ).draggable({
        scroll: false,
        containment: `#containment-wrapper-${stock}`,
        stop: () => {

        },
        drag: function (event, ui) {
          var mult = 0.5;
          if (ui.position.left <= 0){
            ui.position.left -= ((1 + (ui.position.left)) * mult);
          }
        }
      });
      //$( `#containment-wrapper-${stock}` ).draggable({ axis: "y", handle: `#move-${stock}`, scroll: true });
      // $( `#containment-wrapper-${stock}` ).sortable({
      //   containment: '#my-stock'
      // });
      if (i == stocks.length - 1){
        $(`.container-${which} #${stock} .line`).css({
          'width':'100vw',
          'transform': 'translateX(0px)'
        });
      }
    }

  });
  callback();
}

function updateMainValues () {
  $('.stock-main-info').each(function(i, obj) {
    let idName = $(this);
    idName = idName[0].id;
    let currentOpen = 0;

    //get money info:
    let xmlHttp2 = new XMLHttpRequest();
    xmlHttp2.onreadystatechange = function() {
        if (xmlHttp2.readyState == 4 && xmlHttp2.status == 200){
          currentOpen = xmlHttp2.responseText;
          currentOpen = currentOpen.split('\n');
          currentOpen = currentOpen[currentOpen.length-2];
          currentOpen = currentOpen.split(',');
          currentOpen = currentOpen[4];
          currentOpen = (Math.round(currentOpen * 100) / 100).toFixed(2);
          //set value
          $(`#${idName} .stock-main-value`).text(`$${currentOpen}`);

          //make a chart:
          currentOpen = xmlHttp2.responseText;
          currentOpen = currentOpen.split('\n');
          let namee = currentOpen[2];
          namee = namee.split(':');
          namee = namee[1];
          $(`#${idName} .stock-name`).text(`${namee}`);
          prevClose = currentOpen[8];
          prevClose = parseFloat(prevClose.slice(15,21));
          startDate = currentOpen[9];
          startDate = startDate.split(':');
          startDate = startDate[1].split(',');
          endDate = startDate[1];
          startDate = startDate[0];
          startDate = new Date(parseInt(startDate)*1000);
          endDate = new Date(parseInt(endDate)*1000);
          lastPoint = currentOpen[currentOpen.length-2];
          lastPoint = lastPoint.split(',');
          lastPoint = lastPoint[4];
          if (lastPoint < prevClose){
            $(`#${idName} .stock-data`).css({"stroke": "#f1563a"});
            $(`#${idName} .stock-main-value`).css({"background-color":"#f1563a"});
            $(`#containment-wrapper-${idName} .buy`).css({"background-color":"#f1563a"});
          }
          else {
            $(`#${idName} .stock-data`).css({"stroke": "#30cd9a"});
            $(`#${idName} .stock-main-value`).css({"background-color":"#30cd9a"});
            $(`#containment-wrapper-${idName} .buy`).css({"background-color":"#30cd9a"});
          }
          currentOpen = currentOpen.slice(17,currentOpen.length-1);
          chartDate = [];
          currentOpen.forEach((value,i) => {
            if (i % 5 == 0){
              value = value.split(',');
              obj = {'x':0,'y':0};
              obj.x = new Date(parseInt(value[0])*1000);
              obj.y = parseFloat(value[1]);
              chartDate.push(obj);
            }
          });

          startDate = chartDate[0].x;
          //endDate = chartDate[chartDate.length-1].x;
          let chart = new Chartist.Line(`#containment-wrapper-${idName} .stock-data`, {
            labels: ['W1'],
            series: [
              {
                name: 'line',
                data: [{'x':startDate,'y':prevClose},{'x':endDate,'y':prevClose}],
              },
              {
                name: 'series',
                data: chartDate,
              }
            ]
          }, optionsNoPlugins);

          chart.on('draw', function(data) {
            if(data.type === 'point') {
                      data.element.attr({
                      style: 'stroke-width: 2px'
                      });
              };
          });
          chart.on('created', function(data) {
            checkCollision();
          });

        }
    }
    xmlHttp2.open("GET", `http://chartapi.finance.yahoo.com/instrument/2.0/${idName}/chartdata;type=quote;range=1d/csv`, true); // true for asynchronous
    xmlHttp2.setRequestHeader( 'Access-Control-Allow-Origin', '*');
    xmlHttp2.send();

  });
}
