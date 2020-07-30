const sliderSettings = {
    item: 1,
    slideMove: 1,
    loop: true,
    enableDrag: false,
    pager: false,
    keyPress: true,
    controls: false,
    mode: 'fade',
    auto: true,
    pause: 3000,
    speed: 900,
    pauseOnHover: true
};


$('.scroll_top').click(function () {
    $('html, body').animate({ scrollTop: 0 }, 1000);
});

$(window).scroll(function () {
    if ($(window).scrollTop() > 0) {
        $('.scroll_bottom').addClass('active');
    }
    if ($(window).scrollTop() > 300) {
        $('.scroll_top').addClass('active');
    }
    else {
        $('.scroll_top').removeClass('active');
    }

    navScroll();

});

let nav = $('nav'),
    sticky = nav.offset().top;

function navScroll() {
    if (window.pageYOffset > sticky) {
        nav.addClass('sticky');
    } else {
        nav.removeClass('sticky');
    }
}

let animate = 'animate__animated animate__';
let cat;
let postID = 0;
let catVal;
let color;
let sort;
let chosenCat = false, chosenCol = false;
let qty = $('.qty').text();
let qtynum = parseInt(qty);



$(function () {

    $('#loginlink').click(function () {
        Swal.fire({
            title: 'Log in',
            showConfirmButton: false,
            showClass: {
                popup: animate + 'fadeIn',
                backdrop: animate + 'fadeIn swal2-backdrop-show'
            },
            hideClass: {
                popup: animate + 'fadeOut',
                backdrop: animate + 'fadeOut swal2-backdrop-show'
            },
            html: `
                <form method="POST" id="loginform">
                    <input type="email" class="login-field" placeholder="Email">
                    <input type="password" class="login-field" placeholder="Password">
                    <button type="button">Submit</button>
                </form>
            `
        });
    });

    $('#imageGallery').lightSlider({
        gallery:true,
        item:1,
        vertical:true,
        loop: true,
        enableDrag: false,
        keyPress: true,
        controls: false,
        addClass: 'itemgallery',
        //verticalHeight:295,
        vThumbWidth:80,
        thumbItem:4,
        thumbMargin:5,
        slideMargin:0
    });

    $('.itemgallery').css("padding", "0 0 0 180px");

    $('.select').niceSelect();

    $('.starrr').starrr({
        rating: 4
    });

    $('.qtyplus').click(function () {
        qtynum++;
        $('.qty').text(qtynum);
    });

    $('.qtyminus').click(function () {
        if (qtynum > 1) {
            qtynum--;
        } else {
            qtynum = 1;
        }
        $('.qty').text(qtynum);
    });

    $('input[name=cat]').click(function () {
        cat = $(this).val();
        drawPosts();
    });

    $('.hamburger--minus').click(function () {
        $(this).toggleClass('is-active');
        $("#submenu").toggleClass('is-active-nav');
    });

    $('#bottom').click(function () {
        $('html, body').animate({ scrollTop: $(document).height() }, 1000);
        return false;
    });

    let hotSlider = $('#hotproducts').lightSlider(sliderSettings),
        shopSlider = $('#showrooms').lightSlider(sliderSettings),
        saleSlider = $('#saleslider').lightSlider(sliderSettings);

    $('#goprev').click(function () {
        hotSlider.goToPrevSlide();
        return false;
    });
    $('#gonext').click(function () {
        hotSlider.goToNextSlide();
        return false;
    });

    $('#shop_prev').click(function () {
        shopSlider.goToPrevSlide();
        return false;
    });
    $('#shop_next').click(function () {
        shopSlider.goToNextSlide();
        return false;
    });

    $('#sale_prev').click(function () {
        saleSlider.goToPrevSlide();
        return false;
    });
    $('#sale_next').click(function () {
        saleSlider.goToNextSlide();
        return false;
    });

    let lazyLoadInstance = new LazyLoad({
        elements_selector: ".lazy"
    });

    $('input').focus(function () {
        $(this).data('placeholder', $(this).attr('placeholder'))
            .attr('placeholder', '');
    }).blur(function () {
        $(this).attr('placeholder', $(this).data('placeholder'));
    });

    $('#tabs').on('click', 'li:not(.active)', function () {
        $(this)
            .addClass('active').siblings().removeClass('active')
            .closest('div.tabs_wrap').find('div.content_wrap').removeClass('current animate__animated animate__fadeIn').eq($(this).index()).addClass('current animate__animated animate__fadeIn');
    });

    $('#open-modal').click(function (e) {
        e.preventDefault();
        $('#loginlink').click();
    });

    lightbox.option({
        wrapAround: true,
        albumLabel: '',
        disableScrolling: true
    })

    new WOW().init();

    $('.catitem').click(function (e) {
        e.preventDefault();
        catVal = $(this).data('value');
        color = undefined;
        drawCatalog();
    });
    $('.colitem').click(function (e) {
        e.preventDefault();
        color = $(this).data('value');
        drawCatalog();
    });

    $('#catlist').on('click', 'li:not(.cat-active)', function () {
        $(this).addClass('cat-active').siblings().removeClass('cat-active');
    });

    $('#colorlist').on('click', 'li:not(.color-choice)', function () {
        $(this).addClass('color-choice').siblings().removeClass('color-choice');
    });

    $('.sortlnk').click(function (e) {
        e.preventDefault();
        sort = $(this).data('value');
        drawCatalog();
    });

    $('.sortby').on('click', 'a:not(.sort-active)', function () {
        $(this).addClass('sort-active').siblings().removeClass('sort-active');
    });

    drawCatalog();
    drawPosts();
    drawMap();
});

function showMore() {
    let diff = totalItems - itemsToShow;
    itemsToShow += diff;
    drawCatalog();
}
let itemsToShow = 12,
    totalItems = 0;

function drawCatalog() {
    $.ajax({
        type: "GET",
        url: "data/data.json",
        dataType: "json",
        success: function (json) {
            let img, html = '', item, price, id;
            totalItems = json.products.length;
            let finded = $('body').find('.newitems');
            let liclass = 'newitem', newclass = 'newitem wow animate__animated animate__fadeIn';
            if (finded.length != 0) {
                for (let i = 0; i < itemsToShow; i++) {
                    img = json.products[i].img;
                    item = json.products[i].itemname;
                    price = json.products[i].price;
                    id = json.products[i].itemID;
                    if (i > 12) {
                        liclass = newclass;
                    }
                    if (id == localStorage.getItem('item')) {
                        setProdData(id, img, item, price);
                    }
                    html += drawProdHTML(liclass, img, item, price, id);
                }
                $('#catalog').html(html);
                $('#catalog').append('<li aria-hidden="true" class="hidden"></li>');
                checkDisplay();
            } else {
                let newArray = json.products.filter(function (el) {
                    return el.category == catVal;
                });
                let filterArray = json.products.filter(function (el) {
                    return el.color == color;
                });
                if (color != undefined) {
                    newArray = [];
                }
                if (sort == 'low') {
                    json.products.sort((a, b) => {
                        return a.price - b.price;
                    })
                    newArray.sort((a, b) => {
                        return a.price - b.price;
                    })
                    filterArray.sort((a, b) => {
                        return a.price - b.price;
                    })
                } else if (sort == 'high') {
                    json.products.sort((a, b) => {
                        return b.price - a.price;
                    })
                    newArray.sort((a, b) => {
                        return b.price - a.price;
                    })
                    filterArray.sort((a, b) => {
                        return b.price - a.price;
                    })
                }
                if (newArray.length == 0 && filterArray.length == 0) {
                    for (let n = 0; n < totalItems; n++) {
                        img = json.products[n].img;
                        item = json.products[n].itemname;
                        price = json.products[n].price;
                        id = json.products[n].itemID;
                        html += drawProdHTML(liclass, img, item, price, id);
                    }
                }
                else if (newArray.length != 0) {
                    for (let a = 0; a < newArray.length; a++) {
                        img = newArray[a].img;
                        item = newArray[a].itemname;
                        price = newArray[a].price;
                        id = newArray[a].itemID;
                        html += drawProdHTML(newclass, img, item, price, id);
                    }
                }
                else if (filterArray.length != 0) {
                    for (let f = 0; f < filterArray.length; f++) {
                        img = filterArray[f].img;
                        item = filterArray[f].itemname;
                        price = filterArray[f].price;
                        id = filterArray[f].itemID;
                        html += drawProdHTML(newclass, img, item, price, id);
                    }
                }

                $('#productslist').html(html);
                $('#productslist').append('<li aria-hidden="true" class="hidden"></li>');
            }
        }
    });
}

function drawProdHTML(li = 'newitem', img, item, price, id) {
    let html = `
        <li class="${li}">
            <picture>
                <source type="image/webp" srcset="img/${img}.webp">
                <source type="image/jpeg" srcset="img/${img}.jpg">
                <img src="img/${img}.jpg" alt="item">
            </picture>
        <div class="short-info">
            <p class="itemname">${item}</p>
            <p class="itemprice">$${price}</p>
        </div>
        <div class="customer-action">
            <a href="javasript:void(0)" class="btnadd actbtn" data-price="${price}">Buy</a>
            <a href="product.html" target="_blank" class="btninfo actbtn" data-id="${id}" onclick="setProdID($(this))">Details</a>
        </div>
    </li>
    `;
    return html;
}

function checkDisplay() {
    if (itemsToShow == totalItems) {
        $('#showmore').hide();
    }
}


function sortProducts(arr) {
    arr.sort((a, b) => {
        return a - b
    })
}

function drawMap() {
    let map = L.map('map', {
        scrollWheelZoom: false,
        fullscreenControl: true,
        fullscreenControlOptions: {
            position: 'topleft'
        }
    }).setView([57.729535, -106.420245], 2);

    let myFilter = [
        'grayscale:90%',
        'contrast:70%',
        'brightness:110%'
    ];

    L.tileLayer = L.tileLayer.colorFilter('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        filter: myFilter
    }).addTo(map);

    map.dispMap = function () {
        map.plotMap();
        map.map.invalidateSize();
    };

    L.control.locate({
        strings: {
            title: "Your location"
        },
        icon: "icon-location-control"
    }).addTo(map);

    let markers = L.markerClusterGroup({
        removeOutsideVisibleBounds: true,
        disableClusteringAtZoom: 16
    });

    $.ajax({
        type: "GET",
        url: "data/data.json",
        dataType: "json",
        success: function (json) {
            for (let i = 0; i < json.stores.length; i++) {
                let popup_data =
                    `<div class="mr_general">
                        <p class="mr_city">${json.stores[i].city}</p>
                        <p class="mr_add">${json.stores[i].address}</p>
                        <p class="mr_loc">${json.stores[i].location}</p>
                    </div>
                    <div class="mr_additional">
                        <p class="mr_hours">${json.stores[i].ophours}</p>
                `;
                if (json.stores[i].phone != null) {
                    popup_data += `<a href="tel:${json.stores[i].phone}" class="phonelink"><i class="icon-phone"></i>${json.stores[i].phone}</a>`
                }
                if (json.stores[i].web != null) {
                    popup_data += `<a href="${json.stores[i].web}" target="_blank" class="storelink"><i class="icon-web"></i>Website</a>`
                }
                markers.addLayer(L.marker([json.stores[i].lat, json.stores[i].lng])
                    .bindPopup(popup_data)
                )
            }
            map.addLayer(markers);
        }
    });
}

function drawPosts() {
    $.ajax({
        type: "GET",
        url: "data/data.json",
        dataType: "json",
        success: function (json) {
            let html = '';
            let newArray = json.posts.filter(function (el) {
                return el.category == cat
            });
            if (newArray.length == 0) {
                for (let i = 0; i < json.posts.length; i++) {
                    let img = json.posts[i].img,
                        title = json.posts[i].title,
                        id = json.posts[i].id,
                        author = json.posts[i].author,
                        date = json.posts[i].date;
                    html += drawHTML(img, title, true, id);
                    if (id == localStorage.getItem('id')) {
                        setData(id, img, title, author, date);
                    }
                }
            } else {
                for (let c = 0; c < newArray.length; c++) {
                    let img = newArray[c].img,
                        title = newArray[c].title,
                        id = newArray[c].id;
                    html += drawHTML(img, title, true, id);
                }
            }
            $('#postslist').html(html);
            drawSingle();
        }
    });
}
function drawHTML(img, title, lorem, id) {
    lorem = `Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam aliquid provident
    quas optio dolor quaerat.`;
    let html = `
    <li class="animate__animated animate__fadeIn">
        <div class="blogimg_wrap">
            <picture>
                <source type="image/webp" srcset="img/${img}.webp">
                <source type="image/jpeg" srcset="img/${img}.jpg">
                <img src="img/${img}.jpg" alt="post">
            </picture>
            <div class="overlay"></div>
        </div>
        <div class="blogtext_wrap">
            <h2 class="post-title">${title}</h2>
            <p class="post-preview">${lorem}</p>
            <a href="single.html" class="post-read" data-id="${id}" onclick="getID($(this))" target="_blank">Read more</a>
        </div>
    </li>
`;
    return html;
}

function getID($lnk) {
    postID = $lnk.data("id");
    localStorage.setItem('id', postID)
}
function setData(id, img, title, author, date) {
    if (id = localStorage.getItem('id')) {
        let postData = {
            img: img,
            title: title,
            author: author,
            date: date
        };
        localStorage.setItem('data', JSON.stringify(postData));
    }
}

function drawSingle() {
    let DATA = JSON.parse(localStorage.getItem('data'));
    let bg = `url(img/${DATA.img}-lg.jpg)`, title = DATA.title, author = DATA.author, date = DATA.date;
    let views = parseInt(Math.random() * 10000);

    $('#single-head').css("background-image", bg);
    $('#post-title').text(title);

    $('#author').text(author);
    $("#date").text(date);
    $('#views').text(views);
}