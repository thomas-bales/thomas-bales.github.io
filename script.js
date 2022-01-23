'use strict'
const items = document.querySelectorAll('.item');
const modalWindow = document.querySelector('.modal-window');

const leftImgBtn = document.querySelector('.left-btn');
const rightImgBtn = document.querySelector('.right-btn');




// Handle Modal Window *******************************************************************
const openModalWindow = function() {
    modalWindow.classList.add('open');

    const newScreenshotsName = '.' + 'screenshots' + this.classList[1].slice(-1);
    const newInfoName = '.' + 'info' + this.classList[1].slice(-1);

    const currentScreenshots = document.querySelector('.screenshots-active');
    const currentInfo = document.querySelector('.info-active');
    const nextScreenshots = document.querySelector(newScreenshotsName);
    const nextInfo = document.querySelector(newInfoName);

    if (currentScreenshots.classList[1] !== nextScreenshots.classList[1]) {
        currentScreenshots.classList.remove('screenshots-active');
        nextScreenshots.classList.add('screenshots-active');
    }
    if (currentInfo.classList[1] !== nextInfo.classList[1]) {
        currentInfo.classList.remove('info-active');
        nextInfo.classList.add('info-active');
    }

    highlightCircle();

    setTimeout(() => {
        document.addEventListener('click', checkToCloseModalWindow);
    }, 50); 
}

const checkToCloseModalWindow = function (event) {
    if (!event.target.closest('.inner-modal-window')) closeModalWindow();
}
const closeModalWindow = function() {
    modalWindow.classList.remove('open');
    document.removeEventListener('click', checkToCloseModalWindow);
}

items.forEach(item => item.addEventListener('click', openModalWindow));
modalWindow.querySelector('.close-btn').addEventListener('click', closeModalWindow);





// Handle Image Scroller *******************************************************************

const scrollImageLeft = function() {
    const images = document.querySelector('.screenshots-active');
    let hasTwoImages = true;
    if (images.children.length > 2) hasTwoImages = false;

    const centerImg = images.querySelector('.image-active');
    let leftImg = images.querySelector('.image-left');
    let rightImg = images.querySelector('.image-right');
    let nextleftImg ;
    if (!hasTwoImages) nextleftImg = images.querySelector(getNextImage('left', leftImg));

    // Handle image wrap-around w/ 2 images
    if (!leftImg) {
        leftImg = document.querySelector('.image-right')
        if (!leftImg) return;

        leftImg.classList.remove('image-right');
        leftImg.classList.add('image-left');
    }
    else if (!hasTwoImages) rightImg.classList.remove('image-right');

    setTimeout(() => {
        // Animate Images
        leftImg.classList.add('image-transition');
        centerImg.classList.add('image-transition');
        centerImg.classList.add('image-right');
        leftImg.classList.add('image-anim');

        // Make new image the 'active' class
        centerImg.classList.remove('image-active');
        leftImg.classList.add('image-active');
        leftImg.classList.remove('image-left');
        leftImg.classList.remove('image-anim');

        // Set new 'image-left'
        if (!hasTwoImages) nextleftImg.classList.add('image-left');
        highlightCircle();
    }, 10)

    

    // Remove transitions
    setTimeout(() => {
        leftImg.classList.remove('image-transition');
        centerImg.classList.remove('image-transition');
    }, 250); 
}

const scrollImageRight = function() {
    const images = document.querySelector('.screenshots-active');
    let hasTwoImages = true;
    if (images.children.length > 2) hasTwoImages = false;

    let centerImg = images.querySelector('.image-active');
    let rightImg = images.querySelector('.image-right')
    const leftImg = images.querySelector('.image-left');
    let nextRightImg;
    if (!hasTwoImages) nextRightImg = images.querySelector(getNextImage('right', rightImg));

    // Handle image wrap-around
    if (!rightImg) {
        rightImg = document.querySelector('.image-left')
        if (!rightImg) return;

        rightImg.classList.remove('image-left');
        rightImg.classList.add('image-right');
    }
    else if (!hasTwoImages) leftImg.classList.remove('image-left');

    setTimeout(() => {
    // Animate Images
        rightImg.classList.add('image-transition');
        centerImg.classList.add('image-transition');
        centerImg.classList.add('image-left');
        rightImg.classList.add('image-anim');

        // Make new image the 'active' class
        centerImg.classList.remove('image-active');
        rightImg.classList.add('image-active');
        rightImg.classList.remove('image-right');
        rightImg.classList.remove('image-anim');

        // Set new 'image-right'
        if (!hasTwoImages) nextRightImg.classList.add('image-right');
        highlightCircle();
    }, 10)

    // Remove transitions
    setTimeout(() => {
        rightImg.classList.remove('image-transition');
        centerImg.classList.remove('image-transition');
    }, 250); 
}

const getNextImage = function(direction, img) {

    let name = img.classList[1];
    let currentIndex = Number(name.slice(-1));
    const maxIndex = Number(name.slice(1, 2));

    if (direction === 'right') {
       if (currentIndex === maxIndex) currentIndex = 1;
       else currentIndex++;

       return '.' + name.slice(0, -1) + currentIndex;
    }
    else if (direction === 'left') {
        if (currentIndex === 1) currentIndex = maxIndex;
        else currentIndex--;

        return '.' + name.slice(0, -1) + currentIndex;
    }
    else console.error('Error: getNextImg() failed: Not a valid "direction"!');
}

//Change Higlighted Circle
const highlightCircle = function() {
    const index = document.querySelector('.screenshots-active .image-active').classList[1].slice(-1);
    const currentCircle = document.querySelector('.circle-active');
    
    const newName = '.' + currentCircle.classList[1].slice(0, -1) + index;
    const nextCircle = document.querySelector(newName);

    // Switch active circle classes
    currentCircle.classList.remove('circle-active');
    nextCircle.classList.add('circle-active');
}

leftImgBtn.addEventListener('click', scrollImageLeft);
rightImgBtn.addEventListener('click', scrollImageRight);


// Known Issues:
    // Image Scroller:
        // NOTE: wrap-around code is only necessary for two images
        // NOTE: 'm4image3': 'm4' indicates max # of images, '3' indicates index of current image
        // NOTE: w/ two imgs, only need 'image-active' and 'image-right' class. Otherwise, need 'image-left' class
        // Clicking too fast messes w/ image animations. Should wait until anim finishes before registering new clicks
        // 'scrollImageLeft' and 'scrollImageRight' have a lot of repeated code. Refactor into one function w/ a 'direction' parameter that specifies which way to scroll
        // max-index of images is 9, double digits will mess w/ the return value of 'getNextImage'
            //currently, having anything other than 5 images cause circles to not deactivate
        // circles should adapt to the number of images in the current image-scroller
    // Modal Window
        // When selecting the active 'info' and 'screenshots' class, it only checks for a single-digit #. This means a max of 9 projects
