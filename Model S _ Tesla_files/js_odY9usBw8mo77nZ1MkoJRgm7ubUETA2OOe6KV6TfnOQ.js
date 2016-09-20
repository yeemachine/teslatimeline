/**
 * @file
 * A JavaScript file for the theme.
 *
 *
 */
(function (window, document, $, Drupal) {
    "use strict";

    Drupal.behaviors.search_box = {
        attach: function (context) {
            $('#search-expandable').once('expandableSearchBox',
                function(){
                    var self   = $('#search-expandable'),
                        input  = self.find('input[type="text"]'),
                        form   = self.find('form'),
                        button = self.find('input[type="submit"]'),
                        header = $('#second_header'),
                        inputDefaultValue = $(input).defaultValue,
                        timeoutID,
                        stayOpen = false,
                        isiPad = navigator.userAgent.match(/iPad/i) != null,
                        isinCar = navigator.userAgent.toLowerCase().indexOf('qtcarbrowser') != -1;
                    if ($(input[0]).val() !== '') {
                        open_box_no_animation();
                    }
                    if (input.length > 0) {
                        button.attr('disabled', 'disabled');

                        if (isiPad || isinCar) {
                          open_box_no_animation();
                        }
                        self.on('mouseenter', function (event) {
                            event.stopPropagation();
                            window.clearTimeout(timeoutID);
                            open_box();
                        });
                        self.mouseleave(function(event) {
                            if ($(input[0]).val() !== '') {
                                stayOpen = true;
                            } else {
                                stayOpen = false;
                                timeoutID = window.setTimeout(function () {
                                    close_box();
                                }, 8000);
                            }

                        });
                        input.keypress(function (event) {
                            if (event.keyCode != 13 || event.which != 13) {
                                stayOpen = true;
                            }
                        });

                        button.click(
                            function(e){
                                e.preventDefault();
                                if(input.val() != ''){
                                    form.submit();
                                }
                            }
                        );
                    }
                    function open_box() {
                        button.css({'opacity':1});
                            form.stop().animate( { 'opacity': 1 }, 150, function () {
                                header.addClass('expanded-search');
                                self.addClass('box').stop().animate( { width: "220px" }, 300, function () {
                                    input.stop().animate( { 'opacity': 1 }, 150, function () {
                                        $(this).focus();
                                        button.show().removeAttr('disabled');
                                    });
                                });
                            });
                    }
                    function open_box_no_animation() {
                        button.show().css('opacity', 1);
                        form.css('opacity', 1);
                        header.addClass('expanded-search');
                        self.addClass('box').css('width', '220px');
                        input.css('opacity', 1);
                    }

                    function close_box() {
                      // do not collapse on touch screens;
                      if (isiPad || isinCar) return;
                      if (input.val() == '') {

                        button.stop().animate( { 'opacity': 0 }, 500, function () {
                            self.stop().animate( { width: "32px" }, 400, function () {
                                header.removeClass('expanded-search');
                                $(this).removeClass('box');
                            });
                            input.stop().animate( { 'opacity': 0 }, 200);
                        }).hide();
                        $(this).blur();
                      }

                    }

                }
            );
        }
    };

    Drupal.behaviors.findusFilter = function() {
        var $inputs = $('.findus-autocomplete'),
            locale  = Drupal.settings.tesla.localePrefix,
            autocomplete = [],
            items = [],
            geocoder;

        /**
         * Configure google autocomplete and geocoder
         */
        function init() {
            items = document.getElementsByClassName('findus-autocomplete');
            geocoder = new google.maps.Geocoder();
            $.each(items, function(index, val) {
                autocomplete[index] = new google.maps.places.Autocomplete(items[index], { types: ['geocode'] });
                  google.maps.event.addListener(autocomplete[index], 'place_changed', function() {
                    redirectTo(index);
                });
            });
        }

        /**
         * Performs redirect to findus map
         *
         * @param  {integer} index textbox index
         */
        function redirectTo(index) {
            var $this  = $($inputs[index]),
                filter = $this.data('findus-filter');

            var request = $.get('/sites/all/modules/custom/tesla_findus_map/proxy.php?address=' + $this.val());

            request.done(function(response) {
                try {
                    var bounds = response.results[0].geometry.bounds.northeast.lat + ',' +
                    response.results[0].geometry.bounds.northeast.lng + ',' +
                    response.results[0].geometry.bounds.southwest.lat + ',' +
                    response.results[0].geometry.bounds.southwest.lng;
                    window.location.href = locale + '/findus#/bounds/' + bounds + '?search=' + filter;
                } catch(e) {
                    window.location.href = locale + '/findus';
                }
            }).error(function(response) {
                window.location.href = locale + '/findus';
            });
        }

        /**
         * Update autocomplete labels
         *  - commented out for the time being... we may use it again. <eritchey 2014-09-25>
         */
        // function geolocate() {
        //     var request = $.get('/sites/all/modules/custom/tesla_findus_map/proxy.php?ip=true');
        //     request.done(function(response) {
        //         try {
        //             var data   = $.parseJSON(response);
        //             var $label = $('.findus-autocomplete').siblings('span');
        //             $label.find('.your-city').html(data.city + ', ' + data.country);
        //         } catch(e) {
        //         }
        //     });
        // }
        // if ($inputs.length) {
        //     init();
        //     geolocate();
        // }
    },

    Drupal.behaviors.close_mobile_by_clicking_cover = {
        attach: function (context) {
          $('body').once('mobileMenu', function(){
            $(this).on('click', '.mobile-nav-close', function (e) {
                $('#hamburger').trigger('click');
            });
          });

        }
    };

    Drupal.behaviors.mobile_menu = {
        attach: function (context) {
            var $menu_button = $('#hamburger'),
            events = 'click.fndtn';
            if ($menu_button.length > 0) {
                //Bind events only once in case ajax calls attach and detach
                $menu_button.once('mobileMenu',function(){
                    $(this).on(events, function (e) {
                        e.preventDefault();
                        if($('html').hasClass('js-nav')) {
                            $('.mobile-nav-close').remove();
                            $('html').removeClass('js-nav');
                        } else {
                            $('html').addClass('js-nav');
                            $('#page > .outer').after('<div class="mobile-nav-close" />');
                        }
                    });
                });
            }
        }
    };

    Drupal.behaviors.flexslider_height = {
        attach: function (context) {
            var $window = $(window),
                flexslider,
                $thumbnail = $('#thumbnail_slider').find('.flexslider'),
                $flexslider = $('#hero_slider').find('.flexslider'),
                $loader = $('.loader');

            $window.load(function () {
                $loader.hide();
                //$thumbnail.hide();
                if ($flexslider.length > 0) {
                    $loader.show();
                    $flexslider.on('start', function () {
                        $loader.hide();
                        $thumbnail.show();
                    });
                }
            });

            if ($thumbnail.length > 0) {
                $thumbnail.flexslider({
                    asNavFor: '#hero_slider',
                    animation: "slide",
                    controlNav: false,
                    animationLoop: false,
                    slideshow: false,
                    itemWidth: checkWidth(),
                    itemMargin: 10,
                    start: function (slider) {
                        flexslider = slider;
                        var gridSize = checkWidth();
                        flexslider.vars.itemWidth = gridSize;
                    }
                });
            }

            function checkWidth() {
                if (window.innerWidth < 640) {
                    return 110;
                }
                else if (window.innerWidth < 960) {
                    return 157;
                } else {
                    return 177;
                }
            }

            $window.resize(function () {
                if ($thumbnail.length > 0) {
                    var gridSize = checkWidth();
                    flexslider.vars.itemWidth = gridSize;
                }
            });
        }
    };

    Drupal.behaviors.toggle_modal = {
        attach: function (context) {
            $('#page').on('click', '.modal-link', function (e) {
                var $this = $(this),
                    modalTarget = $this.data('target'),
                    sliderDoo = $(modalTarget);

                if (sliderDoo.hasClass('slidedown')) {
                    sliderDoo.removeAttr('style').removeClass('slidedown').addClass('slideup');
                } else {
                    sliderDoo.removeAttr('style').removeClass('slideup').addClass('slidedown');
                }
                $('html, body').animate({scrollTop:$(document).height()}, 'slow');
            });
        }
    };


    /**
     * Author:      Eric Ritchey
     * Updated:     2015-03-25
     * Description: Add class to header of pages with skinny footer
     *              to keep it at the bottom of the browser's window
     *
     * At the default zoom level, there is only 1 page that need this "footer-fixed" class:
     *   1. Five Minute Credit app - content hidden until you make some selections
     *
     * As such, removing the "check every 250ms" functionality in favor of targeting only
     * these specific pages. The code for the Credit App has been moved to the module
     * (tesla_five_minute_credit.module) for initial load, then added/removed as necessary
     * via that module's javascript.
     */
    Drupal.behaviors.set_footer_position_as_necessary = {
        attach: function(context) {


            var $html = $('html');

            // Detect whether device supports orientationchange event, otherwise fall back to
            // the resize event.
            var supportsOrientationChange = "onorientationchange" in window,
                orientationEvent          = supportsOrientationChange ? "orientationchange" : "resize",
                eventListener = window.addEventListener || window.attachEvent;

            eventListener(orientationEvent, function() {
                Drupal.behaviors.set_footer_position_as_necessary.stickyFooter();
            }, false);

            Drupal.behaviors.findusFilter();

            $(window).load(function(){

                if( $html.hasClass('page-has-skinny-footer') ) {
                    Drupal.behaviors.set_footer_position_as_necessary.stickyFooter();
                }

                $( window ).resize(function() {
                    Drupal.behaviors.set_footer_position_as_necessary.stickyFooter();
                });

            });
        },
        stickyFooter: function () {
            var $html = $('html'),
                body = document.body,
                html = document.documentElement,
                $outer = $('.outer'),
                documentHeight = Math.max( body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight, $outer.height() );

            if ( documentHeight <= window.innerHeight ) {
                $html.addClass('footer-fixed');

            } else {
                $html.removeClass('footer-fixed');
            }
        }
    };

    Drupal.behaviors.views_load_more = {
        attach: function(context){

            $('.view-comments').once('newContent', function(){
                $(this).on('views_load_more.new_content', function(e, new_content){
                    if($(this).find('.pager').length == 0){
                        $(this).find('.views-row-last').addClass('final-row');
                    }

                })
            });
        }
    };

    /**
     * Swap the logged-in class based on the tesla_logged_in cookie.
     *
     * Some pages have cookies stripped before serving by Drupal/Varnish. This
     * allows authenticated users to be served anonymous content. We toggle
     * the body class to accurately reflect if the user is logged-in, allowing
     * authenticated or anonymous-only content to toggle based on this body
     * class.
     */
    $(document).ready(function() {
      var tesla_logged_in = Drupal.behaviors.common.readCookie('tesla_logged_in');
      if (tesla_logged_in === 'Y') {
        $('body').removeClass('not-logged-in').addClass('logged-in');
      }
    });

}(this, this.document, this.jQuery, this.Drupal));
;
/*
 * IP detection to reroute customers to their locale
 * https://issues.teslamotors.com/browse/WEB-31125
 *
 * For new sessions, automatically open the change country dialog if the IP country != locale
 * Remember (i.e., don’t ask again) for the remainder of the session
 * Store in cookie and automatically route once for future sessions
 * Limit to homepage for now, but we may extend it to all pages if it works well
 */
$(function() {
    var parsed_url = Drupal.behaviors.common.parseURL(location.href);
    if(parsed_url.params.redirect == 'no') {
        Drupal.behaviors.common.createCookie('ip_lookup_desired_locale', Drupal.settings.tesla.locale, 360);
        Drupal.behaviors.common.createCookie('ip-lookup-have-i-asked', 'Y', .04);
    }
    else {
        IPlookup.init();
    }
});

(function(IPlookup, $, undefined) {
    "use strict";

    IPlookup.init = function() {
        var desired_locale = Drupal.behaviors.common.readCookie('ip_lookup_desired_locale');
        var actual_locale = Drupal.settings.tesla.locale;

        if(desired_locale == null && typeof geoip2 !== 'undefined') {
            geoip2.city(IPlookup.createCookies, IPlookup.onError);
        }

        if(actual_locale != desired_locale && desired_locale != null) {
            IPlookup.rerouteToSavedLocale(desired_locale);
        }
        else {
            if(typeof geoip2 !== 'undefined') {
                geoip2.city(IPlookup.onSuccess, IPlookup.onError);
            }
        }
    }
    IPlookup.createCookies = function(data) {
        var detected_country = data.country.iso_code;
        var website_country = Drupal.settings.tesla.country;

        if(detected_country == website_country) {
            Drupal.behaviors.common.createCookie('ip_lookup_desired_locale', Drupal.settings.tesla.locale, 360);
            Drupal.behaviors.common.createCookie('ip-lookup-have-i-asked', 'Y', .04);
        }
    }
    IPlookup.onSuccess = function(data) {
        var detected_country = data.country.iso_code;
        var website_country = Drupal.settings.tesla.country;
        // Store Basic Geographic Info In Cookie
        var ipInfo = {
            'ip': data.ip,
            'location': {
                'latitude': data.location.latitude,
                'longitude': data.location.longitude 
            },
            'city': data.city.names.en,
            'country': data.country.names.en
        };
        Drupal.behaviors.common.createCookie('ip_info', JSON.stringify(ipInfo), .04); 
        if(detected_country != website_country) {
            if(!IPlookup.haveIAlreadyAsked()) {
                IPlookup.toggleLocaleSelector();
            }
        }
    }
    IPlookup.onError = function(data) {
        debug.log('could not detect country, do nothing');
    }
    IPlookup.toggleLocaleSelector = function() {
        $("#locale-modal").modal();
    }
    IPlookup.haveIAlreadyAsked = function() {
        var response = false;
        if(Drupal.behaviors.common.readCookie('ip-lookup-have-i-asked') == 'Y') {
            response = true;
        }
        else {
            Drupal.behaviors.common.createCookie('ip-lookup-have-i-asked', 'Y', .04);
        }
        return response;
    }
    IPlookup.rerouteToSavedLocale = function(prefix) {
        if(prefix == 'en_US') {
            prefix = '/';
        }
        else if(prefix == 'ja_JP') {
            prefix = '/jp/';
        }
        else {
            prefix = '/' + prefix + '/';
        }

        if(Drupal.settings.tesla.isFront) {
            var url = Drupal.settings.tesla.baseUrl + prefix;
        }
        else {
            var url = Drupal.settings.tesla.baseUrl + prefix + Drupal.settings.tesla.pathAlias;
        }

        var parsed_url = Drupal.behaviors.common.parseURL(window.location);
        if(parsed_url.query == '') {
            url = url + '?redirect=no';
        }
        else {
            url = url + parsed_url.query + '&redirect=no';
        }
        window.location.assign(url);
    }

} (window.IPlookup = window.IPlookup || {}, jQuery));;
