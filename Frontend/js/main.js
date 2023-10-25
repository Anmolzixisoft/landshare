(function ($) {
    "use strict";

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner();


    // Initiate the wowjs
    new WOW().init();


    // Fixed Navbar
    $(window).scroll(function () {
        if ($(window).width() > 20) {
            if ($(this).scrollTop() > 45) {
                $('.fixed-top').addClass('bg-dark shadow');
            } else {
                $('.fixed-top').removeClass('bg-dark shadow');
            }
        } else {
            if ($(this).scrollTop() > 45) {
                $('.fixed-top').addClass('bg-dark shadow').css('top', 0);
            } else {
                $('.fixed-top').removeClass('bg-dark shadow').css('top', 0);
            }
        }
    });


    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({ scrollTop: 0 }, 1500, 'easeInOutExpo');
        return false;
    });
    // Facts counter
    $('[data-toggle="counter-up"]').counterUp({
        delay: 10,
        time: 2000
    });


    // Causes progress
    $('.causes-progress').waypoint(function () {
        $('.progress .progress-bar').each(function () {
            $(this).css("width", $(this).attr("aria-valuenow") + '%');
        });
    }, { offset: '80%' });


    // Portfolio isotope and filter
    var portfolioIsotope = $('.portfolio-container').isotope({
        itemSelector: '.portfolio-item',
        layoutMode: 'fitRows'
    });
    $('#portfolio-flters li').on('click', function () {
        $("#portfolio-flters li").removeClass('active');
        $(this).addClass('active');

        portfolioIsotope.isotope({ filter: $(this).data('filter') });
    });



    // Testimonials carousel
    $(".testimonial-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1000,
        dots: false,
        loop: true,
        items: 3, // Display only 1 item
        margin: 30,
        nav: false,
        navText: [
            '<i class="bi bi-chevron-left"></i>',
            '<i class="bi bi-chevron-right"></i>'
        ],
        responsive: {
            // Responsive breakpoints
            0: {
                items: 1 // Display 1 item on small screens (less than 576px)
            },
            576: {
                items: 2 // Display 1 item on medium screens (576px and above)
            },
            995: {
                items: 3 // Display 1 item on large screens (995px and above)
            }
            // You can add more breakpoints as needed
        }
    });

    // Menu.
    var $menu = $('#menu');

    $menu.wrapInner('<div class="inner"></div>');

    $menu._locked = false;

    $menu._lock = function () {

        if ($menu._locked)
            return false;

        $menu._locked = true;

        window.setTimeout(function () {
            $menu._locked = false;
        }, 350);

        return true;

    };

    $menu._show = function () {

        if ($menu._lock())
            $body.addClass('is-menu-visible');

    };

    $menu._hide = function () {

        if ($menu._lock())
            $body.removeClass('is-menu-visible');

    };

    $menu._toggle = function () {

        if ($menu._lock())
            $body.toggleClass('is-menu-visible');

    };

    $menu
        .appendTo($body)
        .on('click', function (event) {
            event.stopPropagation();
        })
        .on('click', 'a', function (event) {

            var href = $(this).attr('href');

            event.preventDefault();
            event.stopPropagation();

            // Hide.
            $menu._hide();

            // Redirect.
            if (href == '#menu')
                return;

            window.setTimeout(function () {
                window.location.href = href;
            }, 350);

        })
        .append('<a class="close" href="#menu">Close</a>');

    $body
        .on('click', 'a[href="#menu"]', function (event) {

            event.stopPropagation();
            event.preventDefault();

            // Toggle.
            $menu._toggle();

        })
        .on('click', function (event) {

            // Hide.
            $menu._hide();

        })
        .on('keydown', function (event) {

            // Hide on escape.
            if (event.keyCode == 27)
                $menu._hide();

        });



})(jQuery);




