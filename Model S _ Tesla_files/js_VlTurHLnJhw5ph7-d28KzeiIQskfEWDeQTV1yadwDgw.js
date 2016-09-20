(function (window, document, $, Drupal) {
    "use strict";

    Drupal.behaviors.range_calculator = {
        attach: function(context,settings){
            var configJson,
                configJsonPath = "/tesla_theme/js/models/data/config.json",
                rangeData = {},
                rangeSettings = {},
                Drupal = {},
                needIeFallback,
                thisLocale,
                drupalLocale = settings.tesla.locale || 'en_US';

            Drupal.settings = {};
            Drupal.settings.tesla = {};

            // lets find the locale class so we can properly switch the settings
            thisLocale = document.getElementsByTagName("body")[0].className.match(/i18n-\w*/)[0];

            switch (thisLocale) {
                case 'i18n-en_GB':
                    Drupal.settings.tesla.unit = 'hybrid';
                    break;
                case 'i18n-es_US':
                case 'i18n-en_EU':
                case 'i18n-en_AU':
                case 'i18n-en_HK':
                case 'i18n-zh_HK':
                case 'i18n-en_MO':
                case 'i18n-zh_MO':
                case 'i18n-en_CA':
                case 'i18n-fr_CA':
                case 'i18n-es_MX':
                case 'i18n-fr':
                case 'i18n-fr_BE':
                case 'i18n-fr_CH':
                case 'i18n-da':
                case 'i18n-de':
                case 'i18n-de_AT':
                case 'i18n-de_CH':
                case 'i18n-fi_FI':
                case 'i18n-it':
                case 'i18n-it_CH':
                case 'i18n-ja_JP':
                case 'i18n-nl':
                case 'i18n-nl_BE':
                case 'i18n-no':
                case 'i18n-sv_SE':
                case 'i18n-zh_CN':
                case 'i18n-de_LU':
                case 'i18n-fr_LU':
                case 'i18n-zh_TW':
                case 'i18n-ko_KR':
                    Drupal.settings.tesla.unit = 'metric';
                    break;
                default:
                    Drupal.settings.tesla.unit = 'imperial';
                    break;
            }

            $(document).ready(function() {

                needIeFallback = $('html').hasClass('lt-ie9');

                // get the configuration data based on locale
                $.getJSON( configJsonPath, function( data ) {
                    configJson = data[Drupal.settings.tesla.unit];
                })
                .done(function() {
                    initializeRangeData();

                    // default settings
                    rangeSettings.wheelFPS   = configJson.wheelFPS;
                    rangeSettings.speedIndex = configJson.speedIndex;
                    rangeSettings.speed      = configJson.speed;
                    rangeSettings.tempIndex  = configJson.temperatureIndex;
                    rangeSettings.temp       = configJson.temperature;
                    rangeSettings.ac         = configJson.ac.replace("ac","").toLowerCase();
                    rangeSettings.wheels     = configJson.wheels.replace("Wheels","");
                    rangeSettings.windows    = configJson.windows.replace("Windows","").toLowerCase();
                    rangeSettings.season     = configJson.season;
                    rangeSettings.road       = configJson.road;
                    rangeSettings.lights     = configJson.lights.replace("Lights","").toLowerCase();
                });
            });


            // ***********************
            // grab the range data JSON files and set into local obj
            function initializeRangeData() {
                var jsonDir = "/tesla_theme/js/models/data/";
                var region = Drupal.settings.tesla.unit;

                // grab the 4 json file data for imperial unit countries
                $.when( $.getJSON(jsonDir + region + '60Miles.json'),
                        $.getJSON(jsonDir + region + '60DMiles.json'),
                        $.getJSON(jsonDir + region + '75Miles.json'),
                        $.getJSON(jsonDir + region + '75DMiles.json'),
                        $.getJSON(jsonDir + region + '85Miles.json'),
                        $.getJSON(jsonDir + region + '90DMiles.json'),
                        $.getJSON(jsonDir + region + 'P90DMiles.json') )

                // set global data for later use
                .done(function( json1, json2, json3, json4, json5, json6, json7  ) {
                        rangeData.rangedata_60     = json1[0];
                        rangeData.rangedata_60D    = json2[0];
                        rangeData.rangedata_75     = json3[0];
                        rangeData.rangedata_75D    = json4[0];
                        rangeData.rangedata_85     = json5[0];
                        rangeData.rangedata_90D    = json6[0];
                        rangeData.rangedata_P90D   = json7[0];
                })
                // update the UI
                .then(function() {
                    initDefaultData();
                    updateUI();
                    initButtons();
                });
            }


            // ***********************
            // Update the UI elements after calculations
            function updateUI() {

                rangeSettings.speedIndex    = $(".range-controls--speed .spinner-number").data('oldvalue');
                rangeSettings.tempIndex     = $(".range-controls--climate .spinner-number").data('oldvalue');
                rangeSettings.ac            = $(".climate-controller .controls-data").data('value');

                rangeSettings.speed         = configJson.speedRange[rangeSettings.speedIndex];
                rangeSettings.temp          = configJson.outsideTemps[rangeSettings.tempIndex];
                rangeSettings.wheels        = $(".range-controls--wheels input:checked").val();

                $(".battery-option.BT60 .battery-range-content").html(getRangesForBatteries("60"));
                $(".battery-option.BT60D .battery-range-content").html(getRangesForBatteries("60D"));
                $(".battery-option.BT75 .battery-range-content").html(getRangesForBatteries("75"));
                $(".battery-option.BT75D .battery-range-content").html(getRangesForBatteries("75D"));
                $(".battery-option.BT90D .battery-range-content").html(getRangesForBatteries("90D"));
                $(".battery-option.P90D .battery-range-content").html(getRangesForBatteries("P90D"));
                $(".battery-option.BT60 .battery-range-units").html(configJson.speedLabel.toUpperCase());
                $(".battery-option.BT60D .battery-range-units").html(configJson.speedLabel.toUpperCase());
                $(".battery-option.BT75 .battery-range-units").html(configJson.speedLabel.toUpperCase());
                $(".battery-option.BT75D .battery-range-units").html(configJson.speedLabel.toUpperCase());
                $(".battery-option.BT90D .battery-range-units").html(configJson.speedLabel.toUpperCase());
                $(".battery-option.P90D .battery-range-units").html(configJson.speedLabel.toUpperCase());

                $(".range-controls--speed .spinner-number").text(rangeSettings.speed);

                var speed_measurement = configJson.measurement;

                if(configJson.measurement.hasOwnProperty(drupalLocale)) {
                    speed_measurement = configJson.measurement[drupalLocale];
                }
                else if (Drupal.settings.tesla.unit == "metric") {
                    speed_measurement = configJson.measurement['default'];
                }
                else {
                    speed_measurement = configJson.measurement;
                }

                $(".range-controls--speed .spinner-unit").text(speed_measurement);

                $(".range-controls--climate .spinner-number").text(rangeSettings.temp);

                if (rangeSettings.wheels == '19') {
                    $(".wheels-front").removeClass("wheels-twentyone").addClass("wheels-nineteen");
                    $(".wheels-rear").removeClass("wheels-twentyone").addClass("wheels-nineteen");
                } else {
                    $(".wheels-front").removeClass("wheels-nineteen").addClass("wheels-twentyone");
                    $(".wheels-rear").removeClass("wheels-nineteen").addClass("wheels-twentyone");
                }

                // speed spinner
                var increaseSpeedRangeSpinner = $(".range-controls--speed .spinner-controls--increase"),
                    decreaseSpeedRangeSpinner = $(".range-controls--speed .spinner-controls--decrease");

                if (parseInt(rangeSettings.speedIndex) === configJson.speedRange.length - 1) {
                    if(needIeFallback) {
                        increaseSpeedRangeSpinner.addClass("disabled");
                    } else {
                        increaseSpeedRangeSpinner.attr("disabled", "disabled");
                    }
                } else if (parseInt(rangeSettings.speedIndex) === 0) {
                    if(needIeFallback) {
                        decreaseSpeedRangeSpinner.addClass("disabled");
                    } else {
                        decreaseSpeedRangeSpinner.attr("disabled", "disabled");
                    }
                } else {
                    if(needIeFallback) {
                        increaseSpeedRangeSpinner.removeClass("disabled");
                        decreaseSpeedRangeSpinner.removeClass("disabled");
                    } else {
                        increaseSpeedRangeSpinner.removeAttr("disabled");
                        decreaseSpeedRangeSpinner.removeAttr("disabled");
                    }
                }

                // temperature spinner
                var increaseTemperatureRangeSpinner = $(".range-controls--climate .spinner-controls--increase"),
                    decreaseTemperatureRangeSpinner = $(".range-controls--climate .spinner-controls--decrease");

                if (parseInt(rangeSettings.tempIndex) === configJson.outsideTemps.length - 1) {
                    if(needIeFallback) {
                        decreaseTemperatureRangeSpinner.addClass("disabled");
                    } else {
                        decreaseTemperatureRangeSpinner.attr("disabled", "disabled");
                    }
                } else if (parseInt(rangeSettings.tempIndex) === 0) {
                    if(needIeFallback) {
                        increaseTemperatureRangeSpinner.addClass("disabled");
                    } else {
                        increaseTemperatureRangeSpinner.attr("disabled", "disabled");
                    }
                } else {
                    if(needIeFallback) {
                        increaseTemperatureRangeSpinner.removeClass("disabled");
                        decreaseTemperatureRangeSpinner.removeClass("disabled");
                    } else {
                        increaseTemperatureRangeSpinner.removeAttr("disabled");
                        decreaseTemperatureRangeSpinner.removeAttr("disabled");
                    }
                }

                setClimateLabel($(".climate-controller .controls-data").data('value'));

                $(".climate-controller .controls-text").text(rangeSettings.climateLabel);

                // air conditioning spinner
                if (rangeSettings.tempIndex >= 3) {

                    if(rangeSettings.ac === "on") {
                        $(".climate-controller").removeClass('climate-on climate-off climate-heat climate-ac').addClass('climate-on climate-heat');
                    } else {
                        $(".climate-controller").removeClass('climate-on climate-off climate-heat climate-ac').addClass('climate-off climate-heat');
                    }
                } else {

                    if(rangeSettings.ac === "on") {
                        $(".climate-controller").removeClass('climate-on climate-off climate-heat climate-ac').addClass('climate-on climate-ac');
                    } else {
                        $(".climate-controller").removeClass('climate-on climate-off climate-heat climate-ac').addClass('climate-off climate-ac');
                    }
                }
            }


            // ***********************
            // get the range data from the battery specific JSON
            // @batteryId => battery type [70, 70D, 85, 85D, P85D]
            // @speed => current speed selected by user
            function getRangesForBatteries(batteryId, speed) {

                var tmpRangeData = rangeData["rangedata_" + batteryId];
                var miles;

                _.each(tmpRangeData, function(v, k) {
                    if (v.ac == rangeSettings.ac && v.lights == rangeSettings.lights && v.windows == rangeSettings.windows && v.temp == rangeSettings.temp && v.wheelsize == rangeSettings.wheels) {
                        _.each(v.hwy, function(vv, kk) {
                            if (rangeSettings.speed == vv.mph) {
                                miles = vv.miles;
                            }
                        });
                    }
                });

                return Math.round(miles);
            }


            // ***********************
            // initialize the click handlers for controls
            function initButtons() {
                if ($(".range-controls--speed .spinner-controls--increase").length) {
                    $(".range-controls--speed .spinner-controls--increase").unbind("click");
                    $(".range-controls--speed .spinner-controls--increase").click(function() {
                        setSpeedIndex($(".range-controls--speed .spinner-number").data('oldvalue'), "up");
                    });
                }
                if ($(".range-controls--speed .spinner-controls--decrease").length) {
                    $(".range-controls--speed .spinner-controls--decrease").unbind("click");
                    $(".range-controls--speed .spinner-controls--decrease").click(function() {
                        setSpeedIndex($(".range-controls--speed .spinner-number").data('oldvalue'), "down");
                    });
                }
                if ($(".range-controls--climate .spinner-controls--increase").length) {
                    $(".range-controls--climate .spinner-controls--increase").unbind("click");
                    $(".range-controls--climate .spinner-controls--increase").click(function() {
                        setTemperature($(".range-controls--climate .spinner-number").data('oldvalue'), "up");
                    });
                }
                if ($(".range-controls--climate .spinner-controls--decrease").length) {
                    $(".range-controls--climate .spinner-controls--decrease").unbind("click");
                    $(".range-controls--climate .spinner-controls--decrease").click(function() {
                        setTemperature($(".range-controls--climate .spinner-number").data('oldvalue'), "down");
                    });
                }
                if ($(".climate-controller .controls-data").length) {
                    $(".climate-controller .controls-data").unbind("click");
                    $(".climate-controller .controls-data").click(function() {
                        setAC($(".climate-controller .controls-data").data('value'));
                    });
                }

                if ($(".range-controls--wheels input").length) {
                    $(".range-controls--wheels input").unbind("click");
                    $(".range-controls--wheels input").click(function() {
                        setWheels($(this));
                    });
                }
            }


            // ***********************
            // initialize default values for controls
            function initDefaultData() {
                $(".range-controls--speed .spinner-number").data('oldvalue', configJson.speedIndex);
                $(".range-controls--climate .spinner-number").data('oldvalue', configJson.temperatureIndex);

                $(".climate-controller .controls-data").data('value', rangeSettings.ac)
                $(".range-controls--wheels input").data('value', rangeSettings.wheels);
            }


            // ***********************
            // set the current speed from user selection
            function setSpeedIndex(currentSpeed, direction) {

                // set speed index
                var newSpeedIndex = direction === "up" ? parseInt(currentSpeed) + 1 : parseInt(currentSpeed) - 1;

                if (newSpeedIndex > configJson.speedRange.length - 1) {
                    newSpeedIndex = currentSpeed;
                }

                if (newSpeedIndex < 0) {
                    newSpeedIndex = 0;
                }

                rangeSettings.speedIndex = newSpeedIndex;
                $(".range-controls--speed .spinner-number").data('oldvalue', newSpeedIndex);

                updateUI();
            }


            // ***********************
            // set the current temperature based on user selection
            function setTemperature(currentTemp, direction) {

                var newTempIndex = direction === "up" ? parseInt(currentTemp) - 1 : parseInt(currentTemp) + 1;

                if (newTempIndex > configJson.outsideTemps.length - 1) {
                    newTempIndex = currentTemp;
                }
                if (newTempIndex < 0) {
                    newTempIndex = 0;
                }

                rangeSettings.tempIndex = newTempIndex;
                $(".range-controls--climate .spinner-number").data('oldvalue', newTempIndex);

                updateUI();
            }

            function setClimateLabel(climateOnOff) {
                if (climateOnOff === "off") {
                    if(rangeSettings.tempIndex >= 3) {
                        rangeSettings.climateLabel = Tesla.Smartling._heatOff;
                    } else {
                        rangeSettings.climateLabel = Tesla.Smartling._acOff;
                    }
                } else {
                    if(rangeSettings.tempIndex >= 3) {
                        rangeSettings.climateLabel = Tesla.Smartling._heatOn;
                    } else {
                        rangeSettings.climateLabel = Tesla.Smartling._acOn;
                    }
                }
            }


            // ***********************
            // set the current data based on AC button selection
            function setAC(climateOnOff) {

                if (climateOnOff === "on") {
                    $(".climate-controller .controls-data").prop('checked', false);

                    setClimateLabel(climateOnOff);

                    rangeSettings.ac = "off";
                }
                else {
                    $(".climate-controller .controls-data").prop('checked', true);
                    setClimateLabel(climateOnOff);

                    rangeSettings.ac = "on";
                }

                $(".climate-controller .controls-data").data('value', rangeSettings.ac);

                updateUI();
            }


            // ***********************
            // set the current wheels based on user selection
            function setWheels(wheelSize) {

                rangeSettings.wheels = wheelSize.val();
                $('.controls-wheelsize label').removeClass('selected');

                if(wheelSize.val() == '19') {
                    $(".wheelsize-nineteen").addClass('selected');
                } else {
                    $(".wheelsize-twentyone").addClass('selected');
                }



                updateUI();
            }
        }
    };

}(this, this.document, this.jQuery, this.Drupal));
;
(function (window, document, $, Drupal) {
    "use strict";

    Drupal.behaviors.chassis_explorer = {
        attach: function(){

            var slickOptions = {
                initialSlide: 1,
                speed: 0,
                useCSS: false,
                easing: false,
                fade: true,
                cssEase: false,
                responsive: [
                    {
                        breakpoint: 480,
                        settings: {
                            arrows: true,
                            initialSlide: 1,
                            speed: 300,
                            useCSS: false,
                            fade: false
                        }
                    }
                ],
                onAfterChange: function(e) {
                    var $activeNav = $('.nav-link[data-slide="' + e.currentSlide + '"]'),
                        toggle = $activeNav.data('toggle'),
                        $slideContainer = $('.motor-slide[data-toggle="' + toggle + '"]'),
                        $activeSlideVideo = $slideContainer.find('video');

                    $activeNav.parent().siblings().removeClass('nav-selected');
                    $activeNav.parent().addClass('nav-selected');

                    // check if browser supports video playback
                    if (Modernizr.video) {

                        // stop all videos if playing anything
                        $('.section-chassis-explorer').find('video').each(function() {
                            if (!this.paused) this.pause();
                        });

                        // play active video
                        if ($activeSlideVideo.length && $activeSlideVideo.get(0).paused) {
                            $activeSlideVideo.get(0).play();
                        }
                    }
                }
            };

            var $carousel = $('.slick-slider-container');

            if (!$carousel.hasClass('slick-initialized')) {
                $carousel.slick(slickOptions);
            }

            $('#engineering').on('click', '.nav-link', function(e) {

                var $this = $(e.target);

                // only target links, and only target those with hashes in the href.
                if ($this.is('[href]') && $this.attr('href').indexOf("#") >= 0) {
                    e.preventDefault();
                }

                var thisParent = $this.parent('.nav-item'),
                    allSiblings = thisParent.siblings(),
                    slideContent = $('.chassis-container').find('.chassis-slide, .slide-content'),
                    motorSlides = $('.motor-slide');

                if(thisParent.closest('.motortype-nav').length) {
                    for (var i = 0; i < motorSlides.length; i++) {
                        if(!$(motorSlides[i]).hasClass('hidden')) {
                            $(motorSlides[i]).addClass('hidden');
                        }
                    }
                    $('.chassis-slide').find('[data-toggle="' + $this.data('toggle') + '"]').removeClass('hidden');
                    $carousel.slickGoTo($this.data('slide'));
                }

                // only remove and add classes if necessary
                if(!thisParent.hasClass('nav-selected')) {
                    allSiblings.removeClass('nav-selected');
                    thisParent.addClass('nav-selected');
                }
            });
        }
    }

    Drupal.behaviors.local_scroll = {
        attach: function(){
            if($('body').hasClass('browser-notcar')) {
                $.localScroll({
                    queue: true,
                    hash: false
                });
            }
        }
    }

    Drupal.behaviors.toggleBatteryOptions = {
        attach: function(){
            var rwd = false;

            $('.show-rwd').click(
                function(e){
                    e.preventDefault();
                    if(!rwd){
                        $('.battery-data--60d').hide().addClass('hidden').removeAttr('style');
                        $('.battery-data--60').fadeIn('slow', function() {
                            $(this).removeClass('hidden').removeAttr('style');
                            rwd = true;
                        });
                    }
                }
            );
            $('.show-awd').click(
                function(e){
                    e.preventDefault();
                    if(rwd){
                        $('.battery-data--60').hide().addClass('hidden').removeAttr('style');
                        $('.battery-data--60d').fadeIn('slow', function() {
                            $(this).removeClass('hidden').removeAttr('style');
                            rwd = false;
                        });
                    }

                }
            );
        }
    };

    Drupal.behaviors.stickyHeader = {
        attach: function() {

            $(window).scroll(function(){

                if( $(window).scrollTop() > 42 ) {
                    $("#sticky-header").css({position: 'fixed', top: '0px'});
                } else {
                    $("#sticky-header").css({position: ''});
                }
            });
        }
    }

}(this, this.document, this.jQuery, this.Drupal));
;
/**
 * Copyright (c) 2007-2014 Ariel Flesler - aflesler<a>gmail<d>com | http://flesler.blogspot.com
 * Licensed under MIT
 * @author Ariel Flesler
 * @version 1.4.13
 */
;(function(k){'use strict';k(['jquery'],function($){var j=$.scrollTo=function(a,b,c){return $(window).scrollTo(a,b,c)};j.defaults={axis:'xy',duration:parseFloat($.fn.jquery)>=1.3?0:1,limit:!0};j.window=function(a){return $(window)._scrollable()};$.fn._scrollable=function(){return this.map(function(){var a=this,isWin=!a.nodeName||$.inArray(a.nodeName.toLowerCase(),['iframe','#document','html','body'])!=-1;if(!isWin)return a;var b=(a.contentWindow||a).document||a.ownerDocument||a;return/webkit/i.test(navigator.userAgent)||b.compatMode=='BackCompat'?b.body:b.documentElement})};$.fn.scrollTo=function(f,g,h){if(typeof g=='object'){h=g;g=0}if(typeof h=='function')h={onAfter:h};if(f=='max')f=9e9;h=$.extend({},j.defaults,h);g=g||h.duration;h.queue=h.queue&&h.axis.length>1;if(h.queue)g/=2;h.offset=both(h.offset);h.over=both(h.over);return this._scrollable().each(function(){if(f==null)return;var d=this,$elem=$(d),targ=f,toff,attr={},win=$elem.is('html,body');switch(typeof targ){case'number':case'string':if(/^([+-]=?)?\d+(\.\d+)?(px|%)?$/.test(targ)){targ=both(targ);break}targ=win?$(targ):$(targ,this);if(!targ.length)return;case'object':if(targ.is||targ.style)toff=(targ=$(targ)).offset()}var e=$.isFunction(h.offset)&&h.offset(d,targ)||h.offset;$.each(h.axis.split(''),function(i,a){var b=a=='x'?'Left':'Top',pos=b.toLowerCase(),key='scroll'+b,old=d[key],max=j.max(d,a);if(toff){attr[key]=toff[pos]+(win?0:old-$elem.offset()[pos]);if(h.margin){attr[key]-=parseInt(targ.css('margin'+b))||0;attr[key]-=parseInt(targ.css('border'+b+'Width'))||0}attr[key]+=e[pos]||0;if(h.over[pos])attr[key]+=targ[a=='x'?'width':'height']()*h.over[pos]}else{var c=targ[pos];attr[key]=c.slice&&c.slice(-1)=='%'?parseFloat(c)/100*max:c}if(h.limit&&/^\d+$/.test(attr[key]))attr[key]=attr[key]<=0?0:Math.min(attr[key],max);if(!i&&h.queue){if(old!=attr[key])animate(h.onAfterFirst);delete attr[key]}});animate(h.onAfter);function animate(a){$elem.animate(attr,g,h.easing,a&&function(){a.call(this,targ,h)})}}).end()};j.max=function(a,b){var c=b=='x'?'Width':'Height',scroll='scroll'+c;if(!$(a).is('html,body'))return a[scroll]-$(a)[c.toLowerCase()]();var d='client'+c,html=a.ownerDocument.documentElement,body=a.ownerDocument.body;return Math.max(html[scroll],body[scroll])-Math.min(html[d],body[d])};function both(a){return $.isFunction(a)||typeof a=='object'?a:{top:a,left:a}}return j})}(typeof define==='function'&&define.amd?define:function(a,b){if(typeof module!=='undefined'&&module.exports){module.exports=b(require('jquery'))}else{b(jQuery)}}));;
/**
 * Copyright (c) 2007-2014 Ariel Flesler - aflesler<a>gmail<d>com | http://flesler.blogspot.com
 * Licensed under MIT
 * @author Ariel Flesler
 * @version 1.3.5
 */
;(function(a){if(typeof define==='function'&&define.amd){define(['jquery'],a)}else{a(jQuery)}}(function($){var g=location.href.replace(/#.*/,'');var h=$.localScroll=function(a){$('body').localScroll(a)};h.defaults={duration:1000,axis:'y',event:'click',stop:true,target:window};$.fn.localScroll=function(a){a=$.extend({},h.defaults,a);if(a.hash&&location.hash){if(a.target)window.scrollTo(0,0);scroll(0,location,a)}return a.lazy?this.on(a.event,'a,area',function(e){if(filter.call(this)){scroll(e,this,a)}}):this.find('a,area').filter(filter).bind(a.event,function(e){scroll(e,this,a)}).end().end();function filter(){return!!this.href&&!!this.hash&&this.href.replace(this.hash,'')==g&&(!a.filter||$(this).is(a.filter))}};h.hash=function(){};function scroll(e,a,b){var c=a.hash.slice(1),elem=document.getElementById(c)||document.getElementsByName(c)[0];if(!elem)return;if(e)e.preventDefault();var d=$(b.target);if(b.lock&&d.is(':animated')||b.onBefore&&b.onBefore(e,elem,d)===false)return;if(b.stop)d._scrollable().stop(true);if(b.hash){var f=elem.id===c?'id':'name',$a=$('<a> </a>').attr(f,c).css({position:'absolute',top:$(window).scrollTop(),left:$(window).scrollLeft()});elem[f]='';$('body').prepend($a);location.hash=a.hash;$a.remove();elem[f]=c}d.scrollTo(elem,b).trigger('notify.serialScroll',[elem])};return h}));;
/*
     _ _      _       _
 ___| (_) ___| | __  (_)___
/ __| | |/ __| |/ /  | / __|
\__ \ | | (__|   < _ | \__ \
|___/_|_|\___|_|\_(_)/ |___/
                   |__/

 Version: 1.3.14
  Author: Ken Wheeler
 Website: http://kenwheeler.github.io
    Docs: http://kenwheeler.github.io/slick
    Repo: http://github.com/kenwheeler/slick
  Issues: http://github.com/kenwheeler/slick/issues

 */

!function(a){"use strict";"function"==typeof define&&define.amd?define(["jquery"],a):"undefined"!=typeof exports?module.exports=a(require("jquery")):a(jQuery)}(function(a){"use strict";var b=window.Slick||{};b=function(){function c(c,d){var f,g,e=this;if(e.defaults={accessibility:!0,adaptiveHeight:!1,appendArrows:a(c),appendDots:a(c),arrows:!0,asNavFor:null,prevArrow:'<button type="button" data-role="none" class="slick-prev">Previous</button>',nextArrow:'<button type="button" data-role="none" class="slick-next">Next</button>',autoplay:!1,autoplaySpeed:3e3,centerMode:!1,centerPadding:"50px",cssEase:"ease",customPaging:function(a,b){return'<button type="button" data-role="none">'+(b+1)+"</button>"},dots:!1,dotsClass:"slick-dots",draggable:!0,easing:"linear",fade:!1,focusOnSelect:!1,infinite:!0,initialSlide:0,lazyLoad:"ondemand",onBeforeChange:null,onAfterChange:null,onInit:null,onReInit:null,onSetPosition:null,pauseOnHover:!0,pauseOnDotsHover:!1,respondTo:"window",responsive:null,rtl:!1,slide:"div",slidesToShow:1,slidesToScroll:1,speed:500,swipe:!0,swipeToSlide:!1,touchMove:!0,touchThreshold:5,useCSS:!0,variableWidth:!1,vertical:!1,waitForAnimate:!0},e.initials={animating:!1,dragging:!1,autoPlayTimer:null,currentDirection:0,currentLeft:null,currentSlide:0,direction:1,$dots:null,listWidth:null,listHeight:null,loadIndex:0,$nextArrow:null,$prevArrow:null,slideCount:null,slideWidth:null,$slideTrack:null,$slides:null,sliding:!1,slideOffset:0,swipeLeft:null,$list:null,touchObject:{},transformsEnabled:!1},a.extend(e,e.initials),e.activeBreakpoint=null,e.animType=null,e.animProp=null,e.breakpoints=[],e.breakpointSettings=[],e.cssTransitions=!1,e.paused=!1,e.positionProp=null,e.respondTo=null,e.shouldClick=!0,e.$slider=a(c),e.$slidesCache=null,e.transformType=null,e.transitionType=null,e.windowWidth=0,e.windowTimer=null,e.options=a.extend({},e.defaults,d),e.currentSlide=e.options.initialSlide,e.originalSettings=e.options,f=e.options.responsive||null,f&&f.length>-1){e.respondTo=e.options.respondTo||"window";for(g in f)f.hasOwnProperty(g)&&(e.breakpoints.push(f[g].breakpoint),e.breakpointSettings[f[g].breakpoint]=f[g].settings);e.breakpoints.sort(function(a,b){return b-a})}e.autoPlay=a.proxy(e.autoPlay,e),e.autoPlayClear=a.proxy(e.autoPlayClear,e),e.changeSlide=a.proxy(e.changeSlide,e),e.clickHandler=a.proxy(e.clickHandler,e),e.selectHandler=a.proxy(e.selectHandler,e),e.setPosition=a.proxy(e.setPosition,e),e.swipeHandler=a.proxy(e.swipeHandler,e),e.dragHandler=a.proxy(e.dragHandler,e),e.keyHandler=a.proxy(e.keyHandler,e),e.autoPlayIterator=a.proxy(e.autoPlayIterator,e),e.instanceUid=b++,e.htmlExpr=/^(?:\s*(<[\w\W]+>)[^>]*)$/,e.init(),e.checkResponsive()}var b=0;return c}(),b.prototype.addSlide=function(b,c,d){var e=this;if("boolean"==typeof c)d=c,c=null;else if(0>c||c>=e.slideCount)return!1;e.unload(),"number"==typeof c?0===c&&0===e.$slides.length?a(b).appendTo(e.$slideTrack):d?a(b).insertBefore(e.$slides.eq(c)):a(b).insertAfter(e.$slides.eq(c)):d===!0?a(b).prependTo(e.$slideTrack):a(b).appendTo(e.$slideTrack),e.$slides=e.$slideTrack.children(this.options.slide),e.$slideTrack.children(this.options.slide).detach(),e.$slideTrack.append(e.$slides),e.$slides.each(function(b,c){a(c).attr("index",b)}),e.$slidesCache=e.$slides,e.reinit()},b.prototype.animateSlide=function(b,c){var d={},e=this;if(1===e.options.slidesToShow&&e.options.adaptiveHeight===!0&&e.options.vertical===!1){var f=e.$slides.eq(e.currentSlide).outerHeight(!0);e.$list.animate({height:f},e.options.speed)}e.options.rtl===!0&&e.options.vertical===!1&&(b=-b),e.transformsEnabled===!1?e.options.vertical===!1?e.$slideTrack.animate({left:b},e.options.speed,e.options.easing,c):e.$slideTrack.animate({top:b},e.options.speed,e.options.easing,c):e.cssTransitions===!1?a({animStart:e.currentLeft}).animate({animStart:b},{duration:e.options.speed,easing:e.options.easing,step:function(a){e.options.vertical===!1?(d[e.animType]="translate("+a+"px, 0px)",e.$slideTrack.css(d)):(d[e.animType]="translate(0px,"+a+"px)",e.$slideTrack.css(d))},complete:function(){c&&c.call()}}):(e.applyTransition(),d[e.animType]=e.options.vertical===!1?"translate3d("+b+"px, 0px, 0px)":"translate3d(0px,"+b+"px, 0px)",e.$slideTrack.css(d),c&&setTimeout(function(){e.disableTransition(),c.call()},e.options.speed))},b.prototype.asNavFor=function(b){var c=this,d=null!=c.options.asNavFor?a(c.options.asNavFor).getSlick():null;null!=d&&d.slideHandler(b,!0)},b.prototype.applyTransition=function(a){var b=this,c={};c[b.transitionType]=b.options.fade===!1?b.transformType+" "+b.options.speed+"ms "+b.options.cssEase:"opacity "+b.options.speed+"ms "+b.options.cssEase,b.options.fade===!1?b.$slideTrack.css(c):b.$slides.eq(a).css(c)},b.prototype.autoPlay=function(){var a=this;a.autoPlayTimer&&clearInterval(a.autoPlayTimer),a.slideCount>a.options.slidesToShow&&a.paused!==!0&&(a.autoPlayTimer=setInterval(a.autoPlayIterator,a.options.autoplaySpeed))},b.prototype.autoPlayClear=function(){var a=this;a.autoPlayTimer&&clearInterval(a.autoPlayTimer)},b.prototype.autoPlayIterator=function(){var a=this;a.options.infinite===!1?1===a.direction?(a.currentSlide+1===a.slideCount-1&&(a.direction=0),a.slideHandler(a.currentSlide+a.options.slidesToScroll)):(0===a.currentSlide-1&&(a.direction=1),a.slideHandler(a.currentSlide-a.options.slidesToScroll)):a.slideHandler(a.currentSlide+a.options.slidesToScroll)},b.prototype.buildArrows=function(){var b=this;b.options.arrows===!0&&b.slideCount>b.options.slidesToShow&&(b.$prevArrow=a(b.options.prevArrow),b.$nextArrow=a(b.options.nextArrow),b.htmlExpr.test(b.options.prevArrow)&&b.$prevArrow.appendTo(b.options.appendArrows),b.htmlExpr.test(b.options.nextArrow)&&b.$nextArrow.appendTo(b.options.appendArrows),b.options.infinite!==!0&&b.$prevArrow.addClass("slick-disabled"))},b.prototype.buildDots=function(){var c,d,b=this;if(b.options.dots===!0&&b.slideCount>b.options.slidesToShow){for(d='<ul class="'+b.options.dotsClass+'">',c=0;c<=b.getDotCount();c+=1)d+="<li>"+b.options.customPaging.call(this,b,c)+"</li>";d+="</ul>",b.$dots=a(d).appendTo(b.options.appendDots),b.$dots.find("li").first().addClass("slick-active")}},b.prototype.buildOut=function(){var b=this;b.$slides=b.$slider.children(b.options.slide+":not(.slick-cloned)").addClass("slick-slide"),b.slideCount=b.$slides.length,b.$slides.each(function(b,c){a(c).attr("index",b)}),b.$slidesCache=b.$slides,b.$slider.addClass("slick-slider"),b.$slideTrack=0===b.slideCount?a('<div class="slick-track"/>').appendTo(b.$slider):b.$slides.wrapAll('<div class="slick-track"/>').parent(),b.$list=b.$slideTrack.wrap('<div class="slick-list"/>').parent(),b.$slideTrack.css("opacity",0),b.options.centerMode===!0&&(b.options.slidesToScroll=1),a("img[data-lazy]",b.$slider).not("[src]").addClass("slick-loading"),b.setupInfinite(),b.buildArrows(),b.buildDots(),b.updateDots(),b.options.accessibility===!0&&b.$list.prop("tabIndex",0),b.setSlideClasses("number"==typeof this.currentSlide?this.currentSlide:0),b.options.draggable===!0&&b.$list.addClass("draggable")},b.prototype.checkResponsive=function(){var c,d,e,b=this,f=b.$slider.width(),g=window.innerWidth||a(window).width();if("window"===b.respondTo?e=g:"slider"===b.respondTo?e=f:"min"===b.respondTo&&(e=Math.min(g,f)),b.originalSettings.responsive&&b.originalSettings.responsive.length>-1&&null!==b.originalSettings.responsive){d=null;for(c in b.breakpoints)b.breakpoints.hasOwnProperty(c)&&e<b.breakpoints[c]&&(d=b.breakpoints[c]);null!==d?null!==b.activeBreakpoint?d!==b.activeBreakpoint&&(b.activeBreakpoint=d,b.options=a.extend({},b.originalSettings,b.breakpointSettings[d]),b.refresh()):(b.activeBreakpoint=d,b.options=a.extend({},b.originalSettings,b.breakpointSettings[d]),b.refresh()):null!==b.activeBreakpoint&&(b.activeBreakpoint=null,b.options=b.originalSettings,b.refresh())}},b.prototype.changeSlide=function(b,c){var f,g,h,i,j,d=this,e=a(b.target);switch(e.is("a")&&b.preventDefault(),h=0!==d.slideCount%d.options.slidesToScroll,f=h?0:(d.slideCount-d.currentSlide)%d.options.slidesToScroll,b.data.message){case"previous":g=0===f?d.options.slidesToScroll:d.options.slidesToShow-f,d.slideCount>d.options.slidesToShow&&d.slideHandler(d.currentSlide-g,!1,c);break;case"next":g=0===f?d.options.slidesToScroll:f,d.slideCount>d.options.slidesToShow&&d.slideHandler(d.currentSlide+g,!1,c);break;case"index":var k=0===b.data.index?0:b.data.index||a(b.target).parent().index()*d.options.slidesToScroll;if(i=d.getNavigableIndexes(),j=0,-1===i.indexOf(k))if(k>i[i.length-1])k=i[i.length-1];else for(var l in i){if(k<i[l]){k=j;break}j=i[l]}d.slideHandler(k,!1,c);default:return}},b.prototype.clickHandler=function(a){var b=this;b.shouldClick===!1&&(a.stopImmediatePropagation(),a.stopPropagation(),a.preventDefault())},b.prototype.destroy=function(){var b=this;b.autoPlayClear(),b.touchObject={},a(".slick-cloned",b.$slider).remove(),b.$dots&&b.$dots.remove(),b.$prevArrow&&"object"!=typeof b.options.prevArrow&&b.$prevArrow.remove(),b.$nextArrow&&"object"!=typeof b.options.nextArrow&&b.$nextArrow.remove(),b.$slides.parent().hasClass("slick-track")&&b.$slides.unwrap().unwrap(),b.$slides.removeClass("slick-slide slick-active slick-center slick-visible").removeAttr("index").css({position:"",left:"",top:"",zIndex:"",opacity:"",width:""}),b.$slider.removeClass("slick-slider"),b.$slider.removeClass("slick-initialized"),b.$list.off(".slick"),a(window).off(".slick-"+b.instanceUid),a(document).off(".slick-"+b.instanceUid)},b.prototype.disableTransition=function(a){var b=this,c={};c[b.transitionType]="",b.options.fade===!1?b.$slideTrack.css(c):b.$slides.eq(a).css(c)},b.prototype.fadeSlide=function(a,b,c){var d=this;d.cssTransitions===!1?(d.$slides.eq(b).css({zIndex:1e3}),d.$slides.eq(b).animate({opacity:1},d.options.speed,d.options.easing,c),d.$slides.eq(a).animate({opacity:0},d.options.speed,d.options.easing)):(d.applyTransition(b),d.applyTransition(a),d.$slides.eq(b).css({opacity:1,zIndex:1e3}),d.$slides.eq(a).css({opacity:0}),c&&setTimeout(function(){d.disableTransition(b),d.disableTransition(a),c.call()},d.options.speed))},b.prototype.filterSlides=function(a){var b=this;null!==a&&(b.unload(),b.$slideTrack.children(this.options.slide).detach(),b.$slidesCache.filter(a).appendTo(b.$slideTrack),b.reinit())},b.prototype.getCurrent=function(){var a=this;return a.currentSlide},b.prototype.getDotCount=function(){var a=this,b=0,c=0,d=0;if(a.options.infinite===!0)d=Math.ceil(a.slideCount/a.options.slidesToScroll);else for(;b<a.slideCount;)++d,b=c+a.options.slidesToShow,c+=a.options.slidesToScroll<=a.options.slidesToShow?a.options.slidesToScroll:a.options.slidesToShow;return d-1},b.prototype.getLeft=function(a){var c,d,g,b=this,e=0;return b.slideOffset=0,d=b.$slides.first().outerHeight(),b.options.infinite===!0?(b.slideCount>b.options.slidesToShow&&(b.slideOffset=-1*b.slideWidth*b.options.slidesToShow,e=-1*d*b.options.slidesToShow),0!==b.slideCount%b.options.slidesToScroll&&a+b.options.slidesToScroll>b.slideCount&&b.slideCount>b.options.slidesToShow&&(a>b.slideCount?(b.slideOffset=-1*(b.options.slidesToShow-(a-b.slideCount))*b.slideWidth,e=-1*(b.options.slidesToShow-(a-b.slideCount))*d):(b.slideOffset=-1*b.slideCount%b.options.slidesToScroll*b.slideWidth,e=-1*b.slideCount%b.options.slidesToScroll*d))):a+b.options.slidesToShow>b.slideCount&&(b.slideOffset=(a+b.options.slidesToShow-b.slideCount)*b.slideWidth,e=(a+b.options.slidesToShow-b.slideCount)*d),b.slideCount<=b.options.slidesToShow&&(b.slideOffset=0,e=0),b.options.centerMode===!0&&b.options.infinite===!0?b.slideOffset+=b.slideWidth*Math.floor(b.options.slidesToShow/2)-b.slideWidth:b.options.centerMode===!0&&(b.slideOffset=0,b.slideOffset+=b.slideWidth*Math.floor(b.options.slidesToShow/2)),c=b.options.vertical===!1?-1*a*b.slideWidth+b.slideOffset:-1*a*d+e,b.options.variableWidth===!0&&(g=b.slideCount<=b.options.slidesToShow||b.options.infinite===!1?b.$slideTrack.children(".slick-slide").eq(a):b.$slideTrack.children(".slick-slide").eq(a+b.options.slidesToShow),c=g[0]?-1*g[0].offsetLeft:0,b.options.centerMode===!0&&(g=b.options.infinite===!1?b.$slideTrack.children(".slick-slide").eq(a):b.$slideTrack.children(".slick-slide").eq(a+b.options.slidesToShow+1),c=g[0]?-1*g[0].offsetLeft:0,c+=(b.$list.width()-g.outerWidth())/2)),c},b.prototype.getNavigableIndexes=function(){for(var a=this,b=0,c=0,d=[];b<a.slideCount;)d.push(b),b=c+a.options.slidesToScroll,c+=a.options.slidesToScroll<=a.options.slidesToShow?a.options.slidesToScroll:a.options.slidesToShow;return d},b.prototype.getSlideCount=function(){var c,b=this;if(b.options.swipeToSlide===!0){var d=null;return b.$slideTrack.find(".slick-slide").each(function(c,e){return e.offsetLeft+a(e).outerWidth()/2>-1*b.swipeLeft?(d=e,!1):void 0}),c=Math.abs(a(d).attr("index")-b.currentSlide)}return b.options.slidesToScroll},b.prototype.init=function(){var b=this;a(b.$slider).hasClass("slick-initialized")||(a(b.$slider).addClass("slick-initialized"),b.buildOut(),b.setProps(),b.startLoad(),b.loadSlider(),b.initializeEvents(),b.updateArrows(),b.updateDots()),null!==b.options.onInit&&b.options.onInit.call(this,b)},b.prototype.initArrowEvents=function(){var a=this;a.options.arrows===!0&&a.slideCount>a.options.slidesToShow&&(a.$prevArrow.on("click.slick",{message:"previous"},a.changeSlide),a.$nextArrow.on("click.slick",{message:"next"},a.changeSlide))},b.prototype.initDotEvents=function(){var b=this;b.options.dots===!0&&b.slideCount>b.options.slidesToShow&&a("li",b.$dots).on("click.slick",{message:"index"},b.changeSlide),b.options.dots===!0&&b.options.pauseOnDotsHover===!0&&b.options.autoplay===!0&&a("li",b.$dots).on("mouseenter.slick",function(){b.paused=!0,b.autoPlayClear()}).on("mouseleave.slick",function(){b.paused=!1,b.autoPlay()})},b.prototype.initializeEvents=function(){var b=this;b.initArrowEvents(),b.initDotEvents(),b.$list.on("touchstart.slick mousedown.slick",{action:"start"},b.swipeHandler),b.$list.on("touchmove.slick mousemove.slick",{action:"move"},b.swipeHandler),b.$list.on("touchend.slick mouseup.slick",{action:"end"},b.swipeHandler),b.$list.on("touchcancel.slick mouseleave.slick",{action:"end"},b.swipeHandler),b.$list.on("click.slick",b.clickHandler),b.options.pauseOnHover===!0&&b.options.autoplay===!0&&(b.$list.on("mouseenter.slick",function(){b.paused=!0,b.autoPlayClear()}),b.$list.on("mouseleave.slick",function(){b.paused=!1,b.autoPlay()})),b.options.accessibility===!0&&b.$list.on("keydown.slick",b.keyHandler),b.options.focusOnSelect===!0&&a(b.options.slide,b.$slideTrack).on("click.slick",b.selectHandler),a(window).on("orientationchange.slick.slick-"+b.instanceUid,function(){b.checkResponsive(),b.setPosition()}),a(window).on("resize.slick.slick-"+b.instanceUid,function(){a(window).width()!==b.windowWidth&&(clearTimeout(b.windowDelay),b.windowDelay=window.setTimeout(function(){b.windowWidth=a(window).width(),b.checkResponsive(),b.setPosition()},50))}),a("*[draggable!=true]",b.$slideTrack).on("dragstart",function(a){a.preventDefault()}),a(window).on("load.slick.slick-"+b.instanceUid,b.setPosition),a(document).on("ready.slick.slick-"+b.instanceUid,b.setPosition)},b.prototype.initUI=function(){var a=this;a.options.arrows===!0&&a.slideCount>a.options.slidesToShow&&(a.$prevArrow.show(),a.$nextArrow.show()),a.options.dots===!0&&a.slideCount>a.options.slidesToShow&&a.$dots.show(),a.options.autoplay===!0&&a.autoPlay()},b.prototype.keyHandler=function(a){var b=this;37===a.keyCode&&b.options.accessibility===!0?b.changeSlide({data:{message:"previous"}}):39===a.keyCode&&b.options.accessibility===!0&&b.changeSlide({data:{message:"next"}})},b.prototype.lazyLoad=function(){function g(b){a("img[data-lazy]",b).each(function(){var b=a(this),c=a(this).attr("data-lazy");b.load(function(){b.animate({opacity:1},200)}).css({opacity:0}).attr("src",c).removeAttr("data-lazy").removeClass("slick-loading")})}var c,d,e,f,b=this;b.options.centerMode===!0?b.options.infinite===!0?(e=b.currentSlide+(b.options.slidesToShow/2+1),f=e+b.options.slidesToShow+2):(e=Math.max(0,b.currentSlide-(b.options.slidesToShow/2+1)),f=2+(b.options.slidesToShow/2+1)+b.currentSlide):(e=b.options.infinite?b.options.slidesToShow+b.currentSlide:b.currentSlide,f=e+b.options.slidesToShow,b.options.fade===!0&&(e>0&&e--,f<=b.slideCount&&f++)),c=b.$slider.find(".slick-slide").slice(e,f),g(c),b.slideCount<=b.options.slidesToShow?(d=b.$slider.find(".slick-slide"),g(d)):b.currentSlide>=b.slideCount-b.options.slidesToShow?(d=b.$slider.find(".slick-cloned").slice(0,b.options.slidesToShow),g(d)):0===b.currentSlide&&(d=b.$slider.find(".slick-cloned").slice(-1*b.options.slidesToShow),g(d))},b.prototype.loadSlider=function(){var a=this;a.setPosition(),a.$slideTrack.css({opacity:1}),a.$slider.removeClass("slick-loading"),a.initUI(),"progressive"===a.options.lazyLoad&&a.progressiveLazyLoad()},b.prototype.postSlide=function(a){var b=this;null!==b.options.onAfterChange&&b.options.onAfterChange.call(this,b,a),b.animating=!1,b.setPosition(),b.swipeLeft=null,b.options.autoplay===!0&&b.paused===!1&&b.autoPlay()},b.prototype.progressiveLazyLoad=function(){var c,d,b=this;c=a("img[data-lazy]",b.$slider).length,c>0&&(d=a("img[data-lazy]",b.$slider).first(),d.attr("src",d.attr("data-lazy")).removeClass("slick-loading").load(function(){d.removeAttr("data-lazy"),b.progressiveLazyLoad()}).error(function(){d.removeAttr("data-lazy"),b.progressiveLazyLoad()}))},b.prototype.refresh=function(){var b=this,c=b.currentSlide;b.destroy(),a.extend(b,b.initials),b.init(),b.changeSlide({data:{message:"index",index:c}},!0)},b.prototype.reinit=function(){var b=this;b.$slides=b.$slideTrack.children(b.options.slide).addClass("slick-slide"),b.slideCount=b.$slides.length,b.currentSlide>=b.slideCount&&0!==b.currentSlide&&(b.currentSlide=b.currentSlide-b.options.slidesToScroll),b.slideCount<=b.options.slidesToShow&&(b.currentSlide=0),b.setProps(),b.setupInfinite(),b.buildArrows(),b.updateArrows(),b.initArrowEvents(),b.buildDots(),b.updateDots(),b.initDotEvents(),b.options.focusOnSelect===!0&&a(b.options.slide,b.$slideTrack).on("click.slick",b.selectHandler),b.setSlideClasses(0),b.setPosition(),null!==b.options.onReInit&&b.options.onReInit.call(this,b)},b.prototype.removeSlide=function(a,b,c){var d=this;return"boolean"==typeof a?(b=a,a=b===!0?0:d.slideCount-1):a=b===!0?--a:a,d.slideCount<1||0>a||a>d.slideCount-1?!1:(d.unload(),c===!0?d.$slideTrack.children().remove():d.$slideTrack.children(this.options.slide).eq(a).remove(),d.$slides=d.$slideTrack.children(this.options.slide),d.$slideTrack.children(this.options.slide).detach(),d.$slideTrack.append(d.$slides),d.$slidesCache=d.$slides,d.reinit(),void 0)},b.prototype.setCSS=function(a){var d,e,b=this,c={};b.options.rtl===!0&&(a=-a),d="left"==b.positionProp?a+"px":"0px",e="top"==b.positionProp?a+"px":"0px",c[b.positionProp]=a,b.transformsEnabled===!1?b.$slideTrack.css(c):(c={},b.cssTransitions===!1?(c[b.animType]="translate("+d+", "+e+")",b.$slideTrack.css(c)):(c[b.animType]="translate3d("+d+", "+e+", 0px)",b.$slideTrack.css(c)))},b.prototype.setDimensions=function(){var b=this;if(b.options.vertical===!1?b.options.centerMode===!0&&b.$list.css({padding:"0px "+b.options.centerPadding}):(b.$list.height(b.$slides.first().outerHeight(!0)*b.options.slidesToShow),b.options.centerMode===!0&&b.$list.css({padding:b.options.centerPadding+" 0px"})),b.listWidth=b.$list.width(),b.listHeight=b.$list.height(),b.options.vertical===!1&&b.options.variableWidth===!1)b.slideWidth=Math.ceil(b.listWidth/b.options.slidesToShow),b.$slideTrack.width(Math.ceil(b.slideWidth*b.$slideTrack.children(".slick-slide").length));else if(b.options.variableWidth===!0){var c=0;b.slideWidth=Math.ceil(b.listWidth/b.options.slidesToShow),b.$slideTrack.children(".slick-slide").each(function(){c+=Math.ceil(a(this).outerWidth(!0))}),b.$slideTrack.width(Math.ceil(c)+1)}else b.slideWidth=Math.ceil(b.listWidth),b.$slideTrack.height(Math.ceil(b.$slides.first().outerHeight(!0)*b.$slideTrack.children(".slick-slide").length));var d=b.$slides.first().outerWidth(!0)-b.$slides.first().width();b.options.variableWidth===!1&&b.$slideTrack.children(".slick-slide").width(b.slideWidth-d)},b.prototype.setFade=function(){var c,b=this;b.$slides.each(function(d,e){c=-1*b.slideWidth*d,b.options.rtl===!0?a(e).css({position:"relative",right:c,top:0,zIndex:800,opacity:0}):a(e).css({position:"relative",left:c,top:0,zIndex:800,opacity:0})}),b.$slides.eq(b.currentSlide).css({zIndex:900,opacity:1})},b.prototype.setHeight=function(){var a=this;if(1===a.options.slidesToShow&&a.options.adaptiveHeight===!0&&a.options.vertical===!1){var b=a.$slides.eq(a.currentSlide).outerHeight(!0);a.$list.css("height",b)}},b.prototype.setPosition=function(){var a=this;a.setDimensions(),a.setHeight(),a.options.fade===!1?a.setCSS(a.getLeft(a.currentSlide)):a.setFade(),null!==a.options.onSetPosition&&a.options.onSetPosition.call(this,a)},b.prototype.setProps=function(){var a=this,b=document.body.style;a.positionProp=a.options.vertical===!0?"top":"left","top"===a.positionProp?a.$slider.addClass("slick-vertical"):a.$slider.removeClass("slick-vertical"),(void 0!==b.WebkitTransition||void 0!==b.MozTransition||void 0!==b.msTransition)&&a.options.useCSS===!0&&(a.cssTransitions=!0),void 0!==b.OTransform&&(a.animType="OTransform",a.transformType="-o-transform",a.transitionType="OTransition",void 0===b.perspectiveProperty&&void 0===b.webkitPerspective&&(a.animType=!1)),void 0!==b.MozTransform&&(a.animType="MozTransform",a.transformType="-moz-transform",a.transitionType="MozTransition",void 0===b.perspectiveProperty&&void 0===b.MozPerspective&&(a.animType=!1)),void 0!==b.webkitTransform&&(a.animType="webkitTransform",a.transformType="-webkit-transform",a.transitionType="webkitTransition",void 0===b.perspectiveProperty&&void 0===b.webkitPerspective&&(a.animType=!1)),void 0!==b.msTransform&&(a.animType="msTransform",a.transformType="-ms-transform",a.transitionType="msTransition",void 0===b.msTransform&&(a.animType=!1)),void 0!==b.transform&&a.animType!==!1&&(a.animType="transform",a.transformType="transform",a.transitionType="transition"),a.transformsEnabled=null!==a.animType&&a.animType!==!1},b.prototype.setSlideClasses=function(a){var c,d,e,f,b=this;b.$slider.find(".slick-slide").removeClass("slick-active").removeClass("slick-center"),d=b.$slider.find(".slick-slide"),b.options.centerMode===!0?(c=Math.floor(b.options.slidesToShow/2),b.options.infinite===!0&&(a>=c&&a<=b.slideCount-1-c?b.$slides.slice(a-c,a+c+1).addClass("slick-active"):(e=b.options.slidesToShow+a,d.slice(e-c+1,e+c+2).addClass("slick-active")),0===a?d.eq(d.length-1-b.options.slidesToShow).addClass("slick-center"):a===b.slideCount-1&&d.eq(b.options.slidesToShow).addClass("slick-center")),b.$slides.eq(a).addClass("slick-center")):a>=0&&a<=b.slideCount-b.options.slidesToShow?b.$slides.slice(a,a+b.options.slidesToShow).addClass("slick-active"):d.length<=b.options.slidesToShow?d.addClass("slick-active"):(f=b.slideCount%b.options.slidesToShow,e=b.options.infinite===!0?b.options.slidesToShow+a:a,b.options.slidesToShow==b.options.slidesToScroll&&b.slideCount-a<b.options.slidesToShow?d.slice(e-(b.options.slidesToShow-f),e+f).addClass("slick-active"):d.slice(e,e+b.options.slidesToShow).addClass("slick-active")),"ondemand"===b.options.lazyLoad&&b.lazyLoad()},b.prototype.setupInfinite=function(){var c,d,e,b=this;if(b.options.fade===!0&&(b.options.centerMode=!1),b.options.infinite===!0&&b.options.fade===!1&&(d=null,b.slideCount>b.options.slidesToShow)){for(e=b.options.centerMode===!0?b.options.slidesToShow+1:b.options.slidesToShow,c=b.slideCount;c>b.slideCount-e;c-=1)d=c-1,a(b.$slides[d]).clone(!0).attr("id","").attr("index",d-b.slideCount).prependTo(b.$slideTrack).addClass("slick-cloned");for(c=0;e>c;c+=1)d=c,a(b.$slides[d]).clone(!0).attr("id","").attr("index",d+b.slideCount).appendTo(b.$slideTrack).addClass("slick-cloned");b.$slideTrack.find(".slick-cloned").find("[id]").each(function(){a(this).attr("id","")})}},b.prototype.selectHandler=function(b){var c=this,d=parseInt(a(b.target).parents(".slick-slide").attr("index"));return d||(d=0),c.slideCount<=c.options.slidesToShow?(c.$slider.find(".slick-slide").removeClass("slick-active"),c.$slides.eq(d).addClass("slick-active"),c.options.centerMode===!0&&(c.$slider.find(".slick-slide").removeClass("slick-center"),c.$slides.eq(d).addClass("slick-center")),c.asNavFor(d),void 0):(c.slideHandler(d),void 0)},b.prototype.slideHandler=function(a,b,c){var d,e,f,g,i=null,j=this;return b=b||!1,j.animating===!0&&j.options.waitForAnimate===!0||j.options.fade===!0&&j.currentSlide===a||j.slideCount<=j.options.slidesToShow?void 0:(b===!1&&j.asNavFor(a),d=a,i=j.getLeft(d),g=j.getLeft(j.currentSlide),j.currentLeft=null===j.swipeLeft?g:j.swipeLeft,j.options.infinite===!1&&j.options.centerMode===!1&&(0>a||a>j.getDotCount()*j.options.slidesToScroll)?(j.options.fade===!1&&(d=j.currentSlide,c!==!0?j.animateSlide(g,function(){j.postSlide(d)}):j.postSlide(d)),void 0):j.options.infinite===!1&&j.options.centerMode===!0&&(0>a||a>j.slideCount-j.options.slidesToScroll)?(j.options.fade===!1&&(d=j.currentSlide,c!==!0?j.animateSlide(g,function(){j.postSlide(d)}):j.postSlide(d)),void 0):(j.options.autoplay===!0&&clearInterval(j.autoPlayTimer),e=0>d?0!==j.slideCount%j.options.slidesToScroll?j.slideCount-j.slideCount%j.options.slidesToScroll:j.slideCount+d:d>=j.slideCount?0!==j.slideCount%j.options.slidesToScroll?0:d-j.slideCount:d,j.animating=!0,null!==j.options.onBeforeChange&&a!==j.currentSlide&&j.options.onBeforeChange.call(this,j,j.currentSlide,e),f=j.currentSlide,j.currentSlide=e,j.setSlideClasses(j.currentSlide),j.updateDots(),j.updateArrows(),j.options.fade===!0?(c!==!0?j.fadeSlide(f,e,function(){j.postSlide(e)}):j.postSlide(e),void 0):(c!==!0?j.animateSlide(i,function(){j.postSlide(e)}):j.postSlide(e),void 0)))},b.prototype.startLoad=function(){var a=this;a.options.arrows===!0&&a.slideCount>a.options.slidesToShow&&(a.$prevArrow.hide(),a.$nextArrow.hide()),a.options.dots===!0&&a.slideCount>a.options.slidesToShow&&a.$dots.hide(),a.$slider.addClass("slick-loading")},b.prototype.swipeDirection=function(){var a,b,c,d,e=this;return a=e.touchObject.startX-e.touchObject.curX,b=e.touchObject.startY-e.touchObject.curY,c=Math.atan2(b,a),d=Math.round(180*c/Math.PI),0>d&&(d=360-Math.abs(d)),45>=d&&d>=0?e.options.rtl===!1?"left":"right":360>=d&&d>=315?e.options.rtl===!1?"left":"right":d>=135&&225>=d?e.options.rtl===!1?"right":"left":"vertical"},b.prototype.swipeEnd=function(){var b=this;if(b.dragging=!1,b.shouldClick=b.touchObject.swipeLength>10?!1:!0,void 0===b.touchObject.curX)return!1;if(b.touchObject.swipeLength>=b.touchObject.minSwipe)switch(b.swipeDirection()){case"left":b.slideHandler(b.currentSlide+b.getSlideCount()),b.currentDirection=0,b.touchObject={};break;case"right":b.slideHandler(b.currentSlide-b.getSlideCount()),b.currentDirection=1,b.touchObject={}}else b.touchObject.startX!==b.touchObject.curX&&(b.slideHandler(b.currentSlide),b.touchObject={})},b.prototype.swipeHandler=function(a){var b=this;if(!(b.options.swipe===!1||"ontouchend"in document&&b.options.swipe===!1||b.options.draggable===!1&&-1!==a.type.indexOf("mouse")))switch(b.touchObject.fingerCount=a.originalEvent&&void 0!==a.originalEvent.touches?a.originalEvent.touches.length:1,b.touchObject.minSwipe=b.listWidth/b.options.touchThreshold,a.data.action){case"start":b.swipeStart(a);break;case"move":b.swipeMove(a);break;case"end":b.swipeEnd(a)}},b.prototype.swipeMove=function(a){var c,d,e,f,b=this;return f=void 0!==a.originalEvent?a.originalEvent.touches:null,!b.dragging||f&&1!==f.length?!1:(c=b.getLeft(b.currentSlide),b.touchObject.curX=void 0!==f?f[0].pageX:a.clientX,b.touchObject.curY=void 0!==f?f[0].pageY:a.clientY,b.touchObject.swipeLength=Math.round(Math.sqrt(Math.pow(b.touchObject.curX-b.touchObject.startX,2))),d=b.swipeDirection(),"vertical"!==d?(void 0!==a.originalEvent&&b.touchObject.swipeLength>4&&a.preventDefault(),e=(b.options.rtl===!1?1:-1)*(b.touchObject.curX>b.touchObject.startX?1:-1),b.swipeLeft=b.options.vertical===!1?c+b.touchObject.swipeLength*e:c+b.touchObject.swipeLength*(b.$list.height()/b.listWidth)*e,b.options.fade===!0||b.options.touchMove===!1?!1:b.animating===!0?(b.swipeLeft=null,!1):(b.setCSS(b.swipeLeft),void 0)):void 0)},b.prototype.swipeStart=function(a){var c,b=this;return 1!==b.touchObject.fingerCount||b.slideCount<=b.options.slidesToShow?(b.touchObject={},!1):(void 0!==a.originalEvent&&void 0!==a.originalEvent.touches&&(c=a.originalEvent.touches[0]),b.touchObject.startX=b.touchObject.curX=void 0!==c?c.pageX:a.clientX,b.touchObject.startY=b.touchObject.curY=void 0!==c?c.pageY:a.clientY,b.dragging=!0,void 0)},b.prototype.unfilterSlides=function(){var a=this;null!==a.$slidesCache&&(a.unload(),a.$slideTrack.children(this.options.slide).detach(),a.$slidesCache.appendTo(a.$slideTrack),a.reinit())},b.prototype.unload=function(){var b=this;a(".slick-cloned",b.$slider).remove(),b.$dots&&b.$dots.remove(),b.$prevArrow&&"object"!=typeof b.options.prevArrow&&b.$prevArrow.remove(),b.$nextArrow&&"object"!=typeof b.options.nextArrow&&b.$nextArrow.remove(),b.$slides.removeClass("slick-slide slick-active slick-visible").css("width","")},b.prototype.updateArrows=function(){var b,a=this;b=Math.floor(a.options.slidesToShow/2),a.options.arrows===!0&&a.options.infinite!==!0&&a.slideCount>a.options.slidesToShow&&(a.$prevArrow.removeClass("slick-disabled"),a.$nextArrow.removeClass("slick-disabled"),0===a.currentSlide?(a.$prevArrow.addClass("slick-disabled"),a.$nextArrow.removeClass("slick-disabled")):a.currentSlide>=a.slideCount-a.options.slidesToShow&&a.options.centerMode===!1?(a.$nextArrow.addClass("slick-disabled"),a.$prevArrow.removeClass("slick-disabled")):a.currentSlide>a.slideCount-a.options.slidesToShow+b&&a.options.centerMode===!0&&(a.$nextArrow.addClass("slick-disabled"),a.$prevArrow.removeClass("slick-disabled")))},b.prototype.updateDots=function(){var a=this;null!==a.$dots&&(a.$dots.find("li").removeClass("slick-active"),a.$dots.find("li").eq(Math.floor(a.currentSlide/a.options.slidesToScroll)).addClass("slick-active"))},a.fn.slick=function(a){var c=this;return c.each(function(c,d){d.slick=new b(d,a)})},a.fn.slickAdd=function(a,b,c){var d=this;return d.each(function(d,e){e.slick.addSlide(a,b,c)})},a.fn.slickCurrentSlide=function(){var a=this;return a.get(0).slick.getCurrent()},a.fn.slickFilter=function(a){var b=this;return b.each(function(b,c){c.slick.filterSlides(a)})},a.fn.slickGoTo=function(a,b){var c=this;return c.each(function(c,d){d.slick.changeSlide({data:{message:"index",index:parseInt(a)}},b)})},a.fn.slickNext=function(){var a=this;return a.each(function(a,b){b.slick.changeSlide({data:{message:"next"}})})},a.fn.slickPause=function(){var a=this;return a.each(function(a,b){b.slick.autoPlayClear(),b.slick.paused=!0})},a.fn.slickPlay=function(){var a=this;return a.each(function(a,b){b.slick.paused=!1,b.slick.autoPlay()})},a.fn.slickPrev=function(){var a=this;return a.each(function(a,b){b.slick.changeSlide({data:{message:"previous"}})})},a.fn.slickRemove=function(a,b){var c=this;return c.each(function(c,d){d.slick.removeSlide(a,b)})},a.fn.slickRemoveAll=function(){var a=this;return a.each(function(a,b){b.slick.removeSlide(null,null,!0)})},a.fn.slickGetOption=function(a){var b=this;return b.get(0).slick.options[a]},a.fn.slickSetOption=function(a,b,c){var d=this;return d.each(function(d,e){e.slick.options[a]=b,c===!0&&(e.slick.unload(),e.slick.reinit())})},a.fn.slickUnfilter=function(){var a=this;return a.each(function(a,b){b.slick.unfilterSlides()})},a.fn.unslick=function(){var a=this;return a.each(function(a,b){b.slick&&b.slick.destroy()})},a.fn.getSlick=function(){var a=null,b=this;return b.each(function(b,c){a=c.slick}),a}});;
!function(global){"use strict";function keydown(e){var id,k=e?e.keyCode:event.keyCode;if(!held[k]){held[k]=!0;for(id in sequences)sequences[id].keydown(k)}}function keyup(e){var k=e?e.keyCode:event.keyCode;held[k]=!1}function resetHeldKeys(){var k;for(k in held)held[k]=!1}function on(obj,type,fn){obj.addEventListener?obj.addEventListener(type,fn,!1):obj.attachEvent&&(obj["e"+type+fn]=fn,obj[type+fn]=function(){obj["e"+type+fn](window.event)},obj.attachEvent("on"+type,obj[type+fn]))}var cheet,Sequence,sequences={},keys={backspace:8,tab:9,enter:13,"return":13,shift:16,"⇧":16,control:17,ctrl:17,"⌃":17,alt:18,option:18,"⌥":18,pause:19,capslock:20,esc:27,space:32,pageup:33,pagedown:34,end:35,home:36,left:37,L:37,"←":37,up:38,U:38,"↑":38,right:39,R:39,"→":39,down:40,D:40,"↓":40,insert:45,"delete":46,0:48,1:49,2:50,3:51,4:52,5:53,6:54,7:55,8:56,9:57,a:65,b:66,c:67,d:68,e:69,f:70,g:71,h:72,i:73,j:74,k:75,l:76,m:77,n:78,o:79,p:80,q:81,r:82,s:83,t:84,u:85,v:86,w:87,x:88,y:89,z:90,"⌘":91,command:91,kp_0:96,kp_1:97,kp_2:98,kp_3:99,kp_4:100,kp_5:101,kp_6:102,kp_7:103,kp_8:104,kp_9:105,kp_multiply:106,kp_plus:107,kp_minus:109,kp_decimal:110,kp_divide:111,f1:112,f2:113,f3:114,f4:115,f5:116,f6:117,f7:118,f8:119,f9:120,f10:121,f11:122,f12:123,equal:187,"=":187,comma:188,",":188,minus:189,"-":189,period:190,".":190},NOOP=function(){},held={};Sequence=function(str,next,fail,done){var i;for(this.str=str,this.next=next?next:NOOP,this.fail=fail?fail:NOOP,this.done=done?done:NOOP,this.seq=str.split(" "),this.keys=[],i=0;i<this.seq.length;++i)this.keys.push(keys[this.seq[i]]);this.idx=0},Sequence.prototype.keydown=function(keyCode){var i=this.idx;return keyCode!==this.keys[i]?void(i>0&&(this.reset(),this.fail(this.str),cheet.__fail(this.str))):(this.next(this.str,this.seq[i],i,this.seq),cheet.__next(this.str,this.seq[i],i,this.seq),void(++this.idx===this.keys.length&&(this.done(this.str),cheet.__done(this.str),this.reset())))},Sequence.prototype.reset=function(){this.idx=0},cheet=function(str,handlers){var next,fail,done;"function"==typeof handlers?done=handlers:null!==handlers&&void 0!==handlers&&(next=handlers.next,fail=handlers.fail,done=handlers.done),sequences[str]=new Sequence(str,next,fail,done)},cheet.disable=function(str){delete sequences[str]},on(window,"keydown",keydown),on(window,"keyup",keyup),on(window,"blur",resetHeldKeys),on(window,"focus",resetHeldKeys),cheet.__next=NOOP,cheet.next=function(fn){cheet.__next=null===fn?NOOP:fn},cheet.__fail=NOOP,cheet.fail=function(fn){cheet.__fail=null===fn?NOOP:fn},cheet.__done=NOOP,cheet.done=function(fn){cheet.__done=null===fn?NOOP:fn},cheet.reset=function(id){var seq=sequences[id];return seq instanceof Sequence?void seq.reset():void console.warn("cheet: Unknown sequence: "+id)},global.cheet=cheet,"function"==typeof define&&define.amd?define([],function(){return cheet}):"undefined"!=typeof module&&null!==module&&(module.exports=cheet)}(this);;
/**
 * include this file and it will make specific nav sticky
 * it attaches to elements with class .nav-sticky
 * and uses data attributes of this object:
 * data-sticky-extra="20" || data-sticky-extra-bottom="400"
 * int amount of extra pixels to add to top position before detaching to fixed position
 * data-sticky-top="#top-anchor" can be jquery selectors like:
 * #top-anchor || .top-anchor || [name=top-anchor] || "220px" || "220"
 * position of from where object needs to be detached to fixed position
 * data-sticky-bottom="#bottom-anchor" or data-sticky-disappear="#bottom-anchor"
 *
 * can be jquery selectors like:
 * #bottom-anchor || .bottom-anchor || [name=bottom-anchor] || "240px" || "240"
 *
 * stop following content at this position
 */
(function (window, document, $, Drupal) {
    "use strict";

    Drupal.behaviors.scroll_to_fixed = {
        attach: function () {
            var $win = $(window),
                $stickyObject = $(".nav-sticky"),
                animationEnabled = $stickyObject.hasClass('nav-animate'),
                extraTop = $stickyObject.data('sticky-extra') || 0,
                extraBottom = $stickyObject.data('sticky-extra-bottom') || 0;

            // if you are logged in and the admin bar is present
            if (Drupal.admin !== undefined) {
                extraTop += Drupal.admin.height();
                extraBottom += Drupal.admin.height();
            }

            var getPosition = function($obj, dataAttribute) {
                if ($obj.data(dataAttribute) === undefined) { return null; }
                if ($obj.data(dataAttribute).toString().indexOf('#') === 0 || $obj.data(dataAttribute).toString().indexOf('.') === 0 || $obj.data(dataAttribute).toString().indexOf('[') === 0) {
                    return $($obj.data(dataAttribute)).offset().top;
                } else if ($obj.data(dataAttribute).toString().indexOf('px') !== -1) {
                    return $obj.data(dataAttribute).replace('px', '');
                } else {
                    return $obj.data(dataAttribute);
                }
            };

            var reachedPageBottom = function () {
                return ($win.height() + $win.scrollTop() == $(document).height());
            };

            var scrollCallback = function () {
                var topPosition = $(window).scrollTop(),
                    disappear = false,
                    topPlaceholderPosition = getPosition($stickyObject, 'sticky-top'),
                    bottomPlaceholderPosition = getPosition($stickyObject, 'sticky-bottom');

                // do nothing if required attribute is missing
                if (!topPlaceholderPosition) { return; }

                if (bottomPlaceholderPosition === null) {
                    bottomPlaceholderPosition = getPosition($stickyObject, 'sticky-disappear');
                    if (bottomPlaceholderPosition) { disappear = true; }
                }

                if (topPosition + extraTop > topPlaceholderPosition) {
                    if (bottomPlaceholderPosition !== null
                        && topPosition > (bottomPlaceholderPosition - extraBottom)) {
                        if (!disappear) {
                            $stickyObject.css({
                                position: "fixed",
                                top: extraTop - (topPosition - bottomPlaceholderPosition + extraBottom) + "px"
                            });
                        } else {
                            if (animationEnabled && reachedPageBottom()) {
                                // disabling animation if we reached page bottom and animation was enabled
                                $stickyObject.removeClass('nav-animate');
                            } else if (animationEnabled && !reachedPageBottom()) {
                                // re-enabling animation if it was enabled before
                                $stickyObject.addClass('nav-animate');
                            }

                            $stickyObject.css({position: "fixed", top: "-100px"});
                            $stickyObject.addClass('nav-animate-away');
                        }
                    } else {
                        $stickyObject.css({position: "fixed", top: extraTop + "px"});
                        $stickyObject.addClass('is-stuck').removeClass('nav-animate-away');
                    }
                } else {
                    $stickyObject.css({position: "absolute", top: ""});
                    $stickyObject.removeClass('nav-animate-away').removeClass('is-stuck');
                }
            };
            $(window).scroll(scrollCallback);
            $(window).resize(scrollCallback);
            scrollCallback();
        }
    };
}(this, this.document, this.jQuery, this.Drupal));
;
