(function($) {
    // if ($(".loader").css("display") === "block") {
    //     console.log("YESYESYESYESYESYES");
    // }
    console.log("IT IS WORKING BLYAAAAAAT");
    $(".loader").delay().fadeOut("");
    $(document).ready(function(){
        $("#clickHandler").on("click", function() {
            $(".create__post-body").addClass("active");
            $(".modal__overlay").addClass("active");
            $("body").css("overflow", "hidden");
        });
        $(".close__popup").on("click", function() {
            $(".create__post-body").removeClass("active");
            $(".modal__overlay").removeClass("active");
            $("body").css("overflow", "auto");
        });
        $(".profile nav ul li").each( function(element) {
            $(`.profile nav ul li:nth-child(${element + 1}) a`).on("click", function() {
                $(($(this).parent()).children()[1]).toggleClass("active");
            });
        });
        $(document).click(function (e) {
            let menu = $(".profile nav");
            let menuElement = $(".profile nav ul li a");
            if (!menuElement.is(e.target) && !menu.is(e.target) && menu.has(e.target).length === 0) {
                $(".profile nav ul li .card").removeClass("active");
            };

            let user_requests = $("li.user__requests .card");
            let user_messages = $("li.user__messages .card");
            let user_profile = $("li.user__profile .card");
            let nextElement = ($(e.target).parent()).next()[0];
            if (user_requests.is(nextElement)) {
                $(user_messages).removeClass("active");
                $(user_profile).removeClass("active");
            } else if (user_messages.is(nextElement)) {
                $(user_requests).removeClass("active");
                $(user_profile).removeClass("active");
            }else if (user_profile.is(nextElement)) {
                $(user_messages).removeClass("active");
                $(user_requests).removeClass("active");
            }
        });
    });
    $(document).ready(function() {
        $(".tabs__content-wrapper:first-child").addClass("active");
        $(".tabs ul li:first-child a").addClass("active");

        $(".tabs ul li").click(function(event) {
            let index = $(this).index();
            $(".tabs ul li a").removeClass("active");
            $($(`.tabs ul li:nth-child(${index + 1}) a`)[0]).addClass("active");

            $(".tabs__content-wrapper").removeClass("active");
            $(".tabs__content-wrapper").eq(index).addClass("active");
        });
    });
})(jQuery);