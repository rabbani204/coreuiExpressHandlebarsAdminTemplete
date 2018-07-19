var innerMove = false;

window.owl = {};
var converter = new Converter();

function removeItem(id) {
    converter.deleteFile(id);
}
$(document).ready(function ($) {
    "use strict";

    /*==================================
    * Author        : "-------"
    * Template Name : Image-converter
    * Version       : 1.0
    ==================================== */




    /*=========== TABLE OF CONTENTS ===========
    1. Scroll To Top
    2. navBar animation 
    3. owl-carousel.js 
    4. niceSelect
    5. clipboaed.js
    6. wow js
    ======================================*/

    // 1. Scroll To Top 

    $(window).on('scroll', function () {

        if ($(this).scrollTop() > 100) {

            $('.return-to-top').fadeIn();

        } else {

            $('.return-to-top').fadeOut();

        }

    });

    $('.return-to-top').on('click', function () {

        $('html, body').animate({

            scrollTop: 0

        }, 1000);

        return false;

    });

    // 2. navBar animation 

    // navBar animation on scroll

    function activeNavBar() {

        if ($(window).scrollTop() > 0) {

            $(".appsLand-navbar").addClass("active-navbar");

        } else {

            $(".appsLand-navbar").removeClass("active-navbar");

        }

    }

    activeNavBar();

    // End navBar animation on scroll



    // mobile menu

    $(".menu-toggle").on("click", function () {

        $('.appsLand-navbar').toggleClass("mobile-menu-active");

    });

    // close the mobile menu



    // [ On Window Scroll ] 

    $(window).on("scroll", function () {

        // navBar active on scroll

        activeNavBar();

    });

    // [ On Window Scroll ] 


    // 3. owl-carousel 
    
    owl = $('.convert-download-card-contents');
    owl.owlCarousel({
        loop: false,

        //  nav & navText

        nav: true,
        navText: ["<i class='fa fa-angle-left'></i>", "<i class='fa fa-angle-right'></i>"],
        margin: 10,
        responsive: {
            0: {
                items: 1
            },
            480: {
                items: 2
            },
            580: {
                items: 3
            },
            767: {
                items: 3
            },
            1200: {
                items: 4
            }
        }
    });
    // owl.on('mousewheel', '.owl-stage', function (e) {
    //     if (e.deltaY>0) {
    //         owl.trigger('prev.owl');
    //     } else {
    //         owl.trigger('next.owl');
    //     }
    //     e.preventDefault();
    // });


    // 4. niceSelect
    $('.converter-select select').niceSelect();


    // 5.  clipboaed.js

    var clip = new Clipboard('.convert-copy');

    clip.on('success', function (e) {
        $('.copied').show();
        $('.copied').fadeOut(1000);
    });


    // 6. wow js active
    new WOW().init();


    $.navigation = $('nav ul.nav');
    // Add class .active to current link
    $.navigation.find('a').each(function () {

        var cUrl = String(window.location).split('?')[0];

        if (cUrl.substr(cUrl.length - 1) == '#') {
            cUrl = cUrl.slice(0, -1);
        }

        if ($($(this))[0].href == cUrl) {
            $(this).parent('li').addClass('active');
        }
    });


    var addFiles = function (files) {
        if (files.length > 0) {
            for (var f in Object.keys(files)) {
                var srcfile = files[f];
                if (srcfile instanceof File) {
                    setTimeout(function () {
                        converter.addFile(['jpg'], 'png', srcfile, 1, null);
                    }, 200);
                }
            }
        }
    }

    if ($("div#computer")[0] !== undefined) {
        converter.reloadFiles();
        $("div#computer").fileDrop({
            onFileRead: function (fileCollection) {
                addFiles(fileCollection);
            },
            decodebase64: false
        });
        $(".closeModal").click(function () {
            $("#invalid-pop-up").slideUp();
        })
    }
    
    window.onbeforeunload = function(e) {
        if(!innerMove) {
            localStorage.removeItem('files');
        }
    };

    $("a").click(function(){
        innerMove = true;
        setTimeout(function(){
            innerMove = false;
        }, 200)
    })
});