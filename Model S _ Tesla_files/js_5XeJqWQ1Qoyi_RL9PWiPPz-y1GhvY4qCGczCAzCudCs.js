function cache_buster_set_cookie(days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime()+(days*24*60*60*1000));
        var expires = "expires="+date.toGMTString()+";";
    }
    else var expires = "";
    document.cookie = "NO_CACHE=Y;"+expires+"path=/";
};
/*!
	Colorbox v1.5.9 - 2014-04-25
	jQuery lightbox and modal window plugin
	(c) 2014 Jack Moore - http://www.jacklmoore.com/colorbox
	license: http://www.opensource.org/licenses/mit-license.php
*/
(function(t,e,i){function n(i,n,o){var r=e.createElement(i);return n&&(r.id=Z+n),o&&(r.style.cssText=o),t(r)}function o(){return i.innerHeight?i.innerHeight:t(i).height()}function r(e,i){i!==Object(i)&&(i={}),this.cache={},this.el=e,this.value=function(e){var n;return void 0===this.cache[e]&&(n=t(this.el).attr("data-cbox-"+e),void 0!==n?this.cache[e]=n:void 0!==i[e]?this.cache[e]=i[e]:void 0!==X[e]&&(this.cache[e]=X[e])),this.cache[e]},this.get=function(e){var i=this.value(e);return t.isFunction(i)?i.call(this.el,this):i}}function h(t){var e=W.length,i=(z+t)%e;return 0>i?e+i:i}function a(t,e){return Math.round((/%/.test(t)?("x"===e?E.width():o())/100:1)*parseInt(t,10))}function s(t,e){return t.get("photo")||t.get("photoRegex").test(e)}function l(t,e){return t.get("retinaUrl")&&i.devicePixelRatio>1?e.replace(t.get("photoRegex"),t.get("retinaSuffix")):e}function d(t){"contains"in x[0]&&!x[0].contains(t.target)&&t.target!==v[0]&&(t.stopPropagation(),x.focus())}function c(t){c.str!==t&&(x.add(v).removeClass(c.str).addClass(t),c.str=t)}function g(e){z=0,e&&e!==!1?(W=t("."+te).filter(function(){var i=t.data(this,Y),n=new r(this,i);return n.get("rel")===e}),z=W.index(_.el),-1===z&&(W=W.add(_.el),z=W.length-1)):W=t(_.el)}function u(i){t(e).trigger(i),ae.triggerHandler(i)}function f(i){var o;if(!G){if(o=t(i).data("colorbox"),_=new r(i,o),g(_.get("rel")),!$){$=q=!0,c(_.get("className")),x.css({visibility:"hidden",display:"block",opacity:""}),L=n(se,"LoadedContent","width:0; height:0; overflow:hidden; visibility:hidden"),b.css({width:"",height:""}).append(L),D=T.height()+k.height()+b.outerHeight(!0)-b.height(),j=C.width()+H.width()+b.outerWidth(!0)-b.width(),A=L.outerHeight(!0),N=L.outerWidth(!0);var h=a(_.get("initialWidth"),"x"),s=a(_.get("initialHeight"),"y"),l=_.get("maxWidth"),f=_.get("maxHeight");_.w=(l!==!1?Math.min(h,a(l,"x")):h)-N-j,_.h=(f!==!1?Math.min(s,a(f,"y")):s)-A-D,L.css({width:"",height:_.h}),J.position(),u(ee),_.get("onOpen"),O.add(I).hide(),x.focus(),_.get("trapFocus")&&e.addEventListener&&(e.addEventListener("focus",d,!0),ae.one(re,function(){e.removeEventListener("focus",d,!0)})),_.get("returnFocus")&&ae.one(re,function(){t(_.el).focus()})}v.css({opacity:parseFloat(_.get("opacity"))||"",cursor:_.get("overlayClose")?"pointer":"",visibility:"visible"}).show(),_.get("closeButton")?B.html(_.get("close")).appendTo(b):B.appendTo("<div/>"),w()}}function p(){!x&&e.body&&(V=!1,E=t(i),x=n(se).attr({id:Y,"class":t.support.opacity===!1?Z+"IE":"",role:"dialog",tabindex:"-1"}).hide(),v=n(se,"Overlay").hide(),S=t([n(se,"LoadingOverlay")[0],n(se,"LoadingGraphic")[0]]),y=n(se,"Wrapper"),b=n(se,"Content").append(I=n(se,"Title"),R=n(se,"Current"),P=t('<button type="button"/>').attr({id:Z+"Previous"}),K=t('<button type="button"/>').attr({id:Z+"Next"}),F=n("button","Slideshow"),S),B=t('<button type="button"/>').attr({id:Z+"Close"}),y.append(n(se).append(n(se,"TopLeft"),T=n(se,"TopCenter"),n(se,"TopRight")),n(se,!1,"clear:left").append(C=n(se,"MiddleLeft"),b,H=n(se,"MiddleRight")),n(se,!1,"clear:left").append(n(se,"BottomLeft"),k=n(se,"BottomCenter"),n(se,"BottomRight"))).find("div div").css({"float":"left"}),M=n(se,!1,"position:absolute; width:9999px; visibility:hidden; display:none; max-width:none;"),O=K.add(P).add(R).add(F),t(e.body).append(v,x.append(y,M)))}function m(){function i(t){t.which>1||t.shiftKey||t.altKey||t.metaKey||t.ctrlKey||(t.preventDefault(),f(this))}return x?(V||(V=!0,K.click(function(){J.next()}),P.click(function(){J.prev()}),B.click(function(){J.close()}),v.click(function(){_.get("overlayClose")&&J.close()}),t(e).bind("keydown."+Z,function(t){var e=t.keyCode;$&&_.get("escKey")&&27===e&&(t.preventDefault(),J.close()),$&&_.get("arrowKey")&&W[1]&&!t.altKey&&(37===e?(t.preventDefault(),P.click()):39===e&&(t.preventDefault(),K.click()))}),t.isFunction(t.fn.on)?t(e).on("click."+Z,"."+te,i):t("."+te).live("click."+Z,i)),!0):!1}function w(){var e,o,r,h=J.prep,d=++le;if(q=!0,U=!1,u(he),u(ie),_.get("onLoad"),_.h=_.get("height")?a(_.get("height"),"y")-A-D:_.get("innerHeight")&&a(_.get("innerHeight"),"y"),_.w=_.get("width")?a(_.get("width"),"x")-N-j:_.get("innerWidth")&&a(_.get("innerWidth"),"x"),_.mw=_.w,_.mh=_.h,_.get("maxWidth")&&(_.mw=a(_.get("maxWidth"),"x")-N-j,_.mw=_.w&&_.w<_.mw?_.w:_.mw),_.get("maxHeight")&&(_.mh=a(_.get("maxHeight"),"y")-A-D,_.mh=_.h&&_.h<_.mh?_.h:_.mh),e=_.get("href"),Q=setTimeout(function(){S.show()},100),_.get("inline")){var c=t(e);r=t("<div>").hide().insertBefore(c),ae.one(he,function(){r.replaceWith(c)}),h(c)}else _.get("iframe")?h(" "):_.get("html")?h(_.get("html")):s(_,e)?(e=l(_,e),U=new Image,t(U).addClass(Z+"Photo").bind("error",function(){h(n(se,"Error").html(_.get("imgError")))}).one("load",function(){d===le&&setTimeout(function(){var e;t.each(["alt","longdesc","aria-describedby"],function(e,i){var n=t(_.el).attr(i)||t(_.el).attr("data-"+i);n&&U.setAttribute(i,n)}),_.get("retinaImage")&&i.devicePixelRatio>1&&(U.height=U.height/i.devicePixelRatio,U.width=U.width/i.devicePixelRatio),_.get("scalePhotos")&&(o=function(){U.height-=U.height*e,U.width-=U.width*e},_.mw&&U.width>_.mw&&(e=(U.width-_.mw)/U.width,o()),_.mh&&U.height>_.mh&&(e=(U.height-_.mh)/U.height,o())),_.h&&(U.style.marginTop=Math.max(_.mh-U.height,0)/2+"px"),W[1]&&(_.get("loop")||W[z+1])&&(U.style.cursor="pointer",U.onclick=function(){J.next()}),U.style.width=U.width+"px",U.style.height=U.height+"px",h(U)},1)}),U.src=e):e&&M.load(e,_.get("data"),function(e,i){d===le&&h("error"===i?n(se,"Error").html(_.get("xhrError")):t(this).contents())})}var v,x,y,b,T,C,H,k,W,E,L,M,S,I,R,F,K,P,B,O,_,D,j,A,N,z,U,$,q,G,Q,J,V,X={html:!1,photo:!1,iframe:!1,inline:!1,transition:"elastic",speed:300,fadeOut:300,width:!1,initialWidth:"600",innerWidth:!1,maxWidth:!1,height:!1,initialHeight:"450",innerHeight:!1,maxHeight:!1,scalePhotos:!0,scrolling:!0,opacity:.9,preloading:!0,className:!1,overlayClose:!0,escKey:!0,arrowKey:!0,top:!1,bottom:!1,left:!1,right:!1,fixed:!1,data:void 0,closeButton:!0,fastIframe:!0,open:!1,reposition:!0,loop:!0,slideshow:!1,slideshowAuto:!0,slideshowSpeed:2500,slideshowStart:"start slideshow",slideshowStop:"stop slideshow",photoRegex:/\.(gif|png|jp(e|g|eg)|bmp|ico|webp|jxr|svg)((#|\?).*)?$/i,retinaImage:!1,retinaUrl:!1,retinaSuffix:"@2x.$1",current:"image {current} of {total}",previous:"previous",next:"next",close:"close",xhrError:"This content failed to load.",imgError:"This image failed to load.",returnFocus:!0,trapFocus:!0,onOpen:!1,onLoad:!1,onComplete:!1,onCleanup:!1,onClosed:!1,rel:function(){return this.rel},href:function(){return t(this).attr("href")},title:function(){return this.title}},Y="colorbox",Z="cbox",te=Z+"Element",ee=Z+"_open",ie=Z+"_load",ne=Z+"_complete",oe=Z+"_cleanup",re=Z+"_closed",he=Z+"_purge",ae=t("<a/>"),se="div",le=0,de={},ce=function(){function t(){clearTimeout(h)}function e(){(_.get("loop")||W[z+1])&&(t(),h=setTimeout(J.next,_.get("slideshowSpeed")))}function i(){F.html(_.get("slideshowStop")).unbind(s).one(s,n),ae.bind(ne,e).bind(ie,t),x.removeClass(a+"off").addClass(a+"on")}function n(){t(),ae.unbind(ne,e).unbind(ie,t),F.html(_.get("slideshowStart")).unbind(s).one(s,function(){J.next(),i()}),x.removeClass(a+"on").addClass(a+"off")}function o(){r=!1,F.hide(),t(),ae.unbind(ne,e).unbind(ie,t),x.removeClass(a+"off "+a+"on")}var r,h,a=Z+"Slideshow_",s="click."+Z;return function(){r?_.get("slideshow")||(ae.unbind(oe,o),o()):_.get("slideshow")&&W[1]&&(r=!0,ae.one(oe,o),_.get("slideshowAuto")?i():n(),F.show())}}();t.colorbox||(t(p),J=t.fn[Y]=t[Y]=function(e,i){var n,o=this;if(e=e||{},t.isFunction(o))o=t("<a/>"),e.open=!0;else if(!o[0])return o;return o[0]?(p(),m()&&(i&&(e.onComplete=i),o.each(function(){var i=t.data(this,Y)||{};t.data(this,Y,t.extend(i,e))}).addClass(te),n=new r(o[0],e),n.get("open")&&f(o[0])),o):o},J.position=function(e,i){function n(){T[0].style.width=k[0].style.width=b[0].style.width=parseInt(x[0].style.width,10)-j+"px",b[0].style.height=C[0].style.height=H[0].style.height=parseInt(x[0].style.height,10)-D+"px"}var r,h,s,l=0,d=0,c=x.offset();if(E.unbind("resize."+Z),x.css({top:-9e4,left:-9e4}),h=E.scrollTop(),s=E.scrollLeft(),_.get("fixed")?(c.top-=h,c.left-=s,x.css({position:"fixed"})):(l=h,d=s,x.css({position:"absolute"})),d+=_.get("right")!==!1?Math.max(E.width()-_.w-N-j-a(_.get("right"),"x"),0):_.get("left")!==!1?a(_.get("left"),"x"):Math.round(Math.max(E.width()-_.w-N-j,0)/2),l+=_.get("bottom")!==!1?Math.max(o()-_.h-A-D-a(_.get("bottom"),"y"),0):_.get("top")!==!1?a(_.get("top"),"y"):Math.round(Math.max(o()-_.h-A-D,0)/2),x.css({top:c.top,left:c.left,visibility:"visible"}),y[0].style.width=y[0].style.height="9999px",r={width:_.w+N+j,height:_.h+A+D,top:l,left:d},e){var g=0;t.each(r,function(t){return r[t]!==de[t]?(g=e,void 0):void 0}),e=g}de=r,e||x.css(r),x.dequeue().animate(r,{duration:e||0,complete:function(){n(),q=!1,y[0].style.width=_.w+N+j+"px",y[0].style.height=_.h+A+D+"px",_.get("reposition")&&setTimeout(function(){E.bind("resize."+Z,J.position)},1),i&&i()},step:n})},J.resize=function(t){var e;$&&(t=t||{},t.width&&(_.w=a(t.width,"x")-N-j),t.innerWidth&&(_.w=a(t.innerWidth,"x")),L.css({width:_.w}),t.height&&(_.h=a(t.height,"y")-A-D),t.innerHeight&&(_.h=a(t.innerHeight,"y")),t.innerHeight||t.height||(e=L.scrollTop(),L.css({height:"auto"}),_.h=L.height()),L.css({height:_.h}),e&&L.scrollTop(e),J.position("none"===_.get("transition")?0:_.get("speed")))},J.prep=function(i){function o(){return _.w=_.w||L.width(),_.w=_.mw&&_.mw<_.w?_.mw:_.w,_.w}function a(){return _.h=_.h||L.height(),_.h=_.mh&&_.mh<_.h?_.mh:_.h,_.h}if($){var d,g="none"===_.get("transition")?0:_.get("speed");L.remove(),L=n(se,"LoadedContent").append(i),L.hide().appendTo(M.show()).css({width:o(),overflow:_.get("scrolling")?"auto":"hidden"}).css({height:a()}).prependTo(b),M.hide(),t(U).css({"float":"none"}),c(_.get("className")),d=function(){function i(){t.support.opacity===!1&&x[0].style.removeAttribute("filter")}var n,o,a=W.length;$&&(o=function(){clearTimeout(Q),S.hide(),u(ne),_.get("onComplete")},I.html(_.get("title")).show(),L.show(),a>1?("string"==typeof _.get("current")&&R.html(_.get("current").replace("{current}",z+1).replace("{total}",a)).show(),K[_.get("loop")||a-1>z?"show":"hide"]().html(_.get("next")),P[_.get("loop")||z?"show":"hide"]().html(_.get("previous")),ce(),_.get("preloading")&&t.each([h(-1),h(1)],function(){var i,n=W[this],o=new r(n,t.data(n,Y)),h=o.get("href");h&&s(o,h)&&(h=l(o,h),i=e.createElement("img"),i.src=h)})):O.hide(),_.get("iframe")?(n=e.createElement("iframe"),"frameBorder"in n&&(n.frameBorder=0),"allowTransparency"in n&&(n.allowTransparency="true"),_.get("scrolling")||(n.scrolling="no"),t(n).attr({src:_.get("href"),name:(new Date).getTime(),"class":Z+"Iframe",allowFullScreen:!0}).one("load",o).appendTo(L),ae.one(he,function(){n.src="//about:blank"}),_.get("fastIframe")&&t(n).trigger("load")):o(),"fade"===_.get("transition")?x.fadeTo(g,1,i):i())},"fade"===_.get("transition")?x.fadeTo(g,0,function(){J.position(0,d)}):J.position(g,d)}},J.next=function(){!q&&W[1]&&(_.get("loop")||W[z+1])&&(z=h(1),f(W[z]))},J.prev=function(){!q&&W[1]&&(_.get("loop")||z)&&(z=h(-1),f(W[z]))},J.close=function(){$&&!G&&(G=!0,$=!1,u(oe),_.get("onCleanup"),E.unbind("."+Z),v.fadeTo(_.get("fadeOut")||0,0),x.stop().fadeTo(_.get("fadeOut")||0,0,function(){x.hide(),v.hide(),u(he),L.remove(),setTimeout(function(){G=!1,u(re),_.get("onClosed")},1)}))},J.remove=function(){x&&(x.stop(),t.colorbox.close(),x.stop().remove(),v.remove(),G=!1,x=null,t("."+te).removeData(Y).removeClass(te),t(e).unbind("click."+Z))},J.element=function(){return t(_.el)},J.settings=X)})(jQuery,document,window);;
(function ($) {

Drupal.behaviors.initColorbox = {
  attach: function (context, settings) {
    if (!$.isFunction($.colorbox) || typeof settings.colorbox === 'undefined') {
      return;
    }

    if (settings.colorbox.mobiledetect && window.matchMedia) {
      // Disable Colorbox for small screens.
      var mq = window.matchMedia("(max-device-width: " + settings.colorbox.mobiledevicewidth + ")");
      if (mq.matches) {
        return;
      }
    }

    $('.colorbox', context)
      .once('init-colorbox')
      .colorbox(settings.colorbox);

    $(context).bind('cbox_complete', function () {
      Drupal.attachBehaviors('#cboxLoadedContent');
    });
  }
};

})(jQuery);
;
(function ($) {

Drupal.behaviors.initColorboxDefaultStyle = {
  attach: function (context, settings) {
    $(context).bind('cbox_complete', function () {
      // Only run if there is a title.
      if ($('#cboxTitle:empty', context).length == false) {
        $('#cboxLoadedContent img', context).bind('mouseover', function () {
          $('#cboxTitle', context).slideDown();
        });
        $('#cboxOverlay', context).bind('mouseover', function () {
          $('#cboxTitle', context).slideUp();
        });
      }
      else {
        $('#cboxTitle', context).hide();
      }
    });
  }
};

})(jQuery);
;
(function (window, document, $, Drupal) {
    "use strict";

    Drupal.behaviors.tesla_user = {
        checkPassEmailField: function (origin) {
            var email = $('#edit-name').val();
            var form_error = 0;

            // if (!origin && Drupal.behaviors.common.checkEmail(email) == false) {
            //     form_error = 1;
            // }

            if (form_error === 0) {
                if (origin && origin === 'login') {
                    return Drupal.behaviors.tesla_user.submitLoginForm('login');
                }
                return Drupal.behaviors.tesla_user.submitPassForm();
            }
            return false;
        },
        submitLoginForm: function (mode, destination) {
            var form_error         = 0;
            var username_error     = 0;
            var username_error_msg = '';
            var pass_error         = 0;
            var pass_error_msg     = '';
            var display_msg        = '';
            // var top_offset = -30;

            if (mode === 'join') {
                window.location.href = destination;

            } else {
                if ($('#edit-name')) {
                    if ($('#edit-name').val() === '') {
                        form_error = 1;
                        username_error = 1;
                        username_error_msg = 'Please enter a username';
                        if (Drupal.settings.tesla.country === 'DE') {
                            username_error_msg = 'Benutzername eingeben.';

                        } else if (Drupal.settings.tesla.country === 'FR') {
                            username_error_msg = 'Veuillez entrer un username.';

                        } else if (Drupal.settings.tesla.country === 'IT') {
                            username_error_msg = 'Per favore inserisci uno username.';

                        } else if (Drupal.settings.tesla.country === 'NL') {
                            username_error_msg = 'Geef een gebruikersnaam in.';

                        } else if (Drupal.settings.tesla.country === 'JP') {
                            username_error_msg = 'ユーザー名を入力してください。';
                        }
                    }
                }

                if ($('#edit-pass')) {
                    if ($('#edit-pass').val() === '') {
                        form_error = 1;
                        pass_error = 1;
                        pass_error_msg = 'Please enter a password';
                        if (Drupal.settings.tesla.country === 'DE') {
                            pass_error_msg = 'Bitte geben Sie ein gültiges Passwort ein.';

                        } else if (Drupal.settings.tesla.country === 'FR') {
                            pass_error_msg = 'Veuiller entrer un mot de passe valide.';

                        } else if (Drupal.settings.tesla.country === 'IT') {
                            pass_error_msg = 'Per favore inserisci una password valida.';

                        } else if (Drupal.settings.tesla.country === 'NL') {
                            pass_error_msg = 'Geef een wachtwoord in.';

                        } else if (Drupal.settings.tesla.country === 'JP') {
                            pass_error_msg = '有効なパスワードを入力してください。';
                        }
                    }
                }

                if (form_error > 0) {

                    if ($('#messages-wrapper').length) {
                        if ($('#messages-wrapper').css('display') === 'block') {
                            $('#messages-wrapper').remove();
                        }
                    }

                    if (username_error === 1) {
                        $('label.edit-name').attr('class', 'label-error');
                        display_msg = username_error_msg;
                    }

                    if (pass_error === 1) {
                        $('label.edit-pass').attr('class', 'label-error');
                        display_msg = pass_error_msg;
                          // top_offset = 55;
                    }

                    if (username_error === 1 && pass_error === 1) {
                        display_msg = username_error_msg + '<br>' + pass_error_msg;
                        // top_offset = -26;
                    }

                    Drupal.behaviors.tesla_user.displayError($('.my-form-wrapper'), 'prepend', display_msg);

                } else {
                    // create username for all cases
                    var tmp_cookie_val = $('#edit-name').val();
                    tmp_cookie_val = encodeURIComponent(tmp_cookie_val);
                    Drupal.behaviors.common.createCookie('tesla_username', tmp_cookie_val, 360);
                    document.forms['user-login'].submit();
                }
            }
        },
        submitPassForm: function (method) {
            if (method && method === 'cancel') {
                var dest          = $('#destination').val();
                var locale_prefix = '';
                if (Drupal.settings.tesla.locale !== 'en_US') {
                    locale_prefix = Drupal.settings.tesla.locale;
                    if (locale_prefix === 'ja_JP') {
                        locale_prefix = 'jp';
                    }
                    if (locale_prefix === 'zh_CN') {
                        locale_prefix = 'cn';
                    }
                    locale_prefix = '/' + locale_prefix;
                }

                dest = locale_prefix + '/user/login';
                window.location.href = dest;

            } else {
                var email = $('#edit-name').val();
                var form_error = 0;
                var $msgErr = '';
                if (!email.length) {
                    form_error = 1;
                    $msgErr = Drupal.t('Username or e-mail address field is required.');
                }
                if (form_error === 0) {
                    document.forms['user-pass'].submit();

                } else {
                    Drupal.behaviors.tesla_user.displayError($('.my-form-wrapper'), 'prepend', $msgErr);
                }
            }
        },
        displayError: function (insert, position, message) {
            $('.messages.error').remove();
            if (position === 'prepend') {
                insert.prepend('<div class="messages error">' + message + '</div>');
            }
            if (position === 'append') {
                insert.append('<div class="messages error">' + message + '</div>');
            }
            if (position === 'html') {
                insert.html('<div class="messages error">' + message + '</div>');
            }
        },
        useremailCheck: function (emailField) {
            var loginField     = emailField;
            var $locale_prefix =  Drupal.settings.tesla.localePrefix;
            Drupal.useremailCheckUseremail = loginField.val();
            var $error = $('.messages');

            if (!$error.hasClass('error')) {
                $error.addClass('error');
            }
            if (Drupal.useremailCheckUseremail.length) {
                $.ajax({
                    url: $locale_prefix + '/useremail_check/isunique',
                    data: {
                        useremail: Drupal.useremailCheckUseremail
                    },
                    dataType: 'json',
                    beforeSend: function () {
                        loginField.removeClass('useremail-check-accepted')
                            .removeClass('useremail-check-rejected')
                            .addClass('useremail-check-progress');
                    },
                    success: function (ret) {
                        if (ret['allowed']) {
                            $error.empty().hide();
                            loginField.addClass('useremail-check-accepted'); // DDS-1595

                        } else {
                            Drupal.behaviors.tesla_user.displayError($('.my-form-wrapper'), 'prepend', ret['msg']);
                            loginField.addClass('useremail-check-rejected'); // DDS-1595
                        }
                        // checkCreateAcctFields('usermail_check_unique');
                    }
                });
            }
        },
        // check fields on each key input & only activate continue button when fields are filled
        checkCreateAcctFields: function (origin) {
            var form_error = 0;

            if (origin) {
                var fname            = $('#edit-first-name').val();
                var lname            = $('#edit-last-name').val();
                var password         = $('#edit-pass-pass1').val();
                var password_confirm = $('#edit-pass-pass2').val();

                // WEB-8822 / TFM
                // --------------
                if ($("#recaptcha_widget").length) {
                    var captcha = $('#recaptcha_response_field').val();
                }
                // --------------

                if (fname === '') {
                    form_error = 1;

                } else if (lname === '') {
                    form_error = 1;

                } else if (password === '') {
                    form_error = 1;

                } else if (password_confirm === '') {
                    form_error = 1;

                // WEB-8822 / TFM
                // --------------
                } else if (captcha === '') {
                    form_error = 1;
                }
                // --------------

                if ($('.password-description').length &&
                        $('.password-description').css('display') === 'block' &&
                        $('#edit-pass-pass2').length &&
                        $('#edit-pass-pass2').val() !== '') {
                    $('.password-description').css('display', 'none');
                }
            }

            if (form_error === 0) {
                // ------------------------
                Drupal.behaviors.tesla_user.submitCreateAcctForm(origin);
                // $('#btnCreateAccount').keyup(function(event) {
                //     Drupal.behaviors.common.checkKeyPressed(event);
                // });
            }
        },
        submitCreateAcctForm: function (origin) {
            var form_error = 0;
            var error_msg  = '';

            // WEB-8822 / TFM
            // --------------
            var uname = $('#edit-name').val();
            // --------------

            var email    = $('#edit-mail').val();
            var is_shell = $('#edit-is-shell').val();
            if (origin) {
                var fname            = $('#edit-first-name').val();
                var lname            = $('#edit-last-name').val();
                var password         = $('#edit-pass-pass1').val();
                var password_confirm = $('#edit-pass-pass2').val();

                var hasLetters     = password.match(/[a-zA-Z]+/);
                var hasNumbers     = password.match(/[0-9]+/);
                var hasPunctuation = password.match(/[^a-zA-Z0-9]+/);
                var hasCasing      = password.match(/[a-z]+.*[A-Z]+|[A-Z]+.*[a-z]+/);

                if (fname === '') {
                    form_error = 1;
                }
                if (lname === '') {
                    form_error = 1;
                }
                if (password === '') {
                    form_error = 1;
                }
                if (password_confirm === '') {
                    form_error = 1;
                }
            }

            if (Drupal.behaviors.common.checkEmail(email) === false) {
                form_error = 1;
                error_msg = 'This is not a valid email address format. Please try again.';
            }
            if (password !== password_confirm) {
                form_error = 1;
            }
            if (form_error === 0) {
                if (password.length < 8) {
                    error_msg = Drupal.t('For your security, please provide a password at least eight characters long that contains at least one number and one letter.');
                    form_error = 1;

                } else if (password === uname) {
                    error_msg = Drupal.t('For your security, please provide a password at least eight characters long that contains at least one number and one letter.');
                    form_error = 1;

                } else {
                    var count = (hasLetters ? 1 : 0) + (hasNumbers ? 1 : 0);
                    var strength_pass = count > 1 ? 'pass' : 'fail';
                    if (strength_pass === 'fail') {
                        error_msg = Drupal.t('For your security, please provide a password at least eight characters long that contains at least one number and one letter.');
                        form_error = 1;
                    }
                }
            }

            if (form_error === 1) {
                Drupal.behaviors.tesla_user.displayError($('.my-form-wrapper'), 'prepend' , error_msg);

            } else {
                // create login and username cookies
                var tesla_username_cookie = Drupal.behaviors.common.readCookie('tesla_username');
                var tesla_email_cookie = Drupal.behaviors.common.readCookie('tesla_email');

                // create username save cookie
                // in all cases
                if (tesla_username_cookie) {
                    Drupal.behaviors.common.eraseCookie('tesla_username');
                }
                var tmp_cookie_val = $('#edit-name').val();
                tmp_cookie_val = encodeURIComponent(tmp_cookie_val);
                Drupal.behaviors.common.createCookie('tesla_username',tmp_cookie_val);

                // create email save cookie
                // in all cases
                if (tesla_email_cookie) {
                    Drupal.behaviors.common.eraseCookie('tesla_email');
                }
                var tmp_cookie_val = $('#edit-mail').val();
                tmp_cookie_val = encodeURIComponent(tmp_cookie_val);
                Drupal.behaviors.common.createCookie('tesla_email', tmp_cookie_val);

                if (is_shell && is_shell === 'true') {
                    debug.log('set the form action');
                    var form_action = $('#edit-shell-url').val();
                    $('#user-register').attr('action', form_action);
                }
                document.forms['user-register-form'].submit();
            }
        },
        checkResetPasswordFields: function (action) {
            $('#user-pass-reset').submit(function () {
                return false;
            });
            var $error           = $('.messages').addClass('error');
            var form_error       = 0;
            var password         = $('#edit-pass-pass1').val();
            var password_confirm = $('#edit-pass-pass2').val();
            var username         = $('#edit-username').val();
            var url_array        = $('#edit-request_url').val().split('/');
            var timestamp        = url_array.slice(-2)[0];
            var hash             = url_array.slice(-2)[1];

            var error_msg = Drupal.t('For your security, please provide a password at least eight characters long that contains at least one number and one letter.');

            $('label[for="edit-pass"]').css('color', '#666666');
            $('label[for="edit-pass-confirm"]').css('color', '#666666');

            if (password === '' || password === null) {
                form_error = 1;
            }
            if (password_confirm === '' || password_confirm === null) {
                form_error = 1;
            }

            if (action === 'submit') {
                var hasLetters     = password.match(/[a-zA-Z]+/);
                var hasNumbers     = password.match(/[0-9]+/);
                var hasPunctuation = password.match(/[^a-zA-Z0-9]+/);
                var hasCasing      = password.match(/[a-z]+.*[A-Z]+|[A-Z]+.*[a-z]+/);

                if (password.length < 8) {
                    form_error = 1;

                } else if (password === username) {
                    error_msg = Drupal.t('Your password cannot be the same as your username.');
                    form_error = 1;

                } else {
                    var count = (hasLetters ? 1 : 0) + (hasNumbers ? 1 : 0);
                    var strength_pass = count > 1 ? "pass" : "fail";

                    if (strength_pass === 'fail') {
                        error_msg = Drupal.t('For your security, please provide a password at least eight characters long that contains at least one number and one letter.');
                        form_error = 1;
                    }
                }

            }

            if (form_error === 0) {
                if (action === 'submit') {
                    var userid        = $('#edit-uid').val();
                    var page_origin   = 'reset';
                    var locale_prefix =  Drupal.settings.tesla.localePrefix;

                    $.post(locale_prefix + '/user/reset-password', {
                        uid: userid,
                        pass: password,
                        origin: page_origin,
                        hash: hash,
                        timestamp: timestamp
                    }, function (response) {
                        if (!response.success) {
                            Drupal.behaviors.tesla_user.displayError($('.my-form-wrapper'), 'prepend', response.message);

                        } else {
                            Gatekeeper.Helpers.setCookies(name);
                            Gatekeeper.Helpers.startSession(response.auth.data, response.auth.region);
                        }
                    });
                }
            } else {
                if (!$error.hasClass('error')) {
                    $error.addClass('error');
                }
                Drupal.behaviors.tesla_user.displayError($('.my-form-wrapper'), 'prepend', error_msg);
            }
        }
    };
}(this, this.document, this.jQuery, this.Drupal));
;
