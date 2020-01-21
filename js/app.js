/**
 *
 * Manipulating the DOM exercise.
 * Exercise programmatically builds navigation,
 * scrolls to anchors from navigation,
 * and highlights section in viewport upon scrolling.
 *
 * Dependencies: None
 *
 * JS Version: ES2015/ES6
 *
 * JS Standard: ESlint
 *
 */

/**
 * Define Global Variables
 *
 */
const header = document.querySelector('.page__header'),
  navbarList = document.querySelector('#navbar__list'),
  allSections = document.querySelectorAll('section'),
  sections = Array.from(allSections),
  upButton = document.querySelector('#button');
/**
 * End Global Variables
 * Start Helper Functions
 *
 */
// TODO: set active class to elements and remove from the sibllings
const setActive = el => {
  [...el.parentElement.children].forEach(sib => sib.classList.remove('active'));
  el.classList.add('active');
};

// TODO: check if element is visible in the viewport
const isInViewport = el => {
  let headerHeight = header.offsetHeight;
  let rect = el.getBoundingClientRect(); //get element position
  const windowHeight =
    window.innerHeight || document.documentElement.clientHeight;
  const windowWidth = window.innerWidth || document.documentElement.clientWidth;
  // TODO: check element is visible in vertical view
  const vertInView =
    rect.top <= windowHeight &&
    rect.top + rect.height >= 0 &&
    rect.bottom <= rect.height + headerHeight;
  // TODO: check element is visible in horizontal view
  const horInView = rect.left <= windowWidth && rect.left + rect.width >= 0;
  return vertInView && horInView;
};

// TODO: button will apper whwn scroll below the page
const scrollUpButton = () => {
  if (
    document.body.scrollTop > 500 ||
    document.documentElement.scrollTop > 500 // For Chrome, Firefox, IE and Opera
  ) {
    upButton.style.display = 'block';
  } else {
    upButton.style.display = 'none';
  }
};

// TODO: on click button go up page
function toTopPage() {
  let top = 0;
  window.scrollTo({ top, behavior: 'smooth' });
}

//TODO: set active class to nav when section in the viewport
const setActiveNav = () => {
  let navLinks = document.querySelectorAll('.menu__link');
  let headerHeight = header.offsetHeight;
  let fromTop = window.pageYOffset + headerHeight;
  navLinks.forEach(link => {
    let currentSection = document.querySelector(link.hash);
    if (
      currentSection.offsetTop <= fromTop &&
      currentSection.offsetTop + currentSection.offsetHeight > fromTop
    ) {
      setActive(link);
    } else {
      link.classList.remove('active');
    }
  });
};
const activeNav = () => {
  window.addEventListener('scroll', setActiveNav);
};

/**
 * End Helper Functions
 * Begin Main Functions
 *
 */

// build the nav
const buildNav = () => {
  for (let section of sections) {
    const newLi = document.createElement('li');
    const newAnchor = document.createElement('a');
    let navContent = section.dataset.nav; //content from data attribute of section
    newAnchor.textContent = navContent;
    newAnchor.classList.add('menu__link'); //add class to created anchor
    newAnchor.setAttribute(
      'href',
      '#' + navContent.replace(/\s+/g, '').toLowerCase()
    ); //set attribute href from data attribute of section
    newAnchor.onclick = scrollToSection; // Scroll to section on link click
    newLi.appendChild(newAnchor);
    navbarList.appendChild(newLi);
    activeNav();
  }
};

// Add class 'active' to section when near top of viewport

const activeSection = () => {
  for (let section of sections) {
    if (isInViewport(section)) {
      setActive(section);
    }
  }
};

// Scroll to anchor ID using scrollTO event
function scrollToSection(e) {
  e.preventDefault();
  let headerHeight = header.offsetHeight,
    hashVal = this.getAttribute('href'),
    target = document.querySelector(hashVal),
    top = target.offsetTop * 1.01 - headerHeight;
  window.scrollTo({
    top,
    behavior: 'smooth'
  });
  history.pushState(null, null, hashVal);
}

/**
 * End Main Functions
 * Begin Events
 *
 */

// Build menu
window.addEventListener('DOMContentLoaded', buildNav);

// Set sections as active
let isScrolling;
window.addEventListener(
  'scroll',
  function() {
    activeSection();
    scrollUpButton();
    header.style.display = 'block';
    window.clearTimeout(isScrolling); // Clear our timeout throughout the scroll

    // Set a timeout to run after scrolling ends
    isScrolling = setTimeout(() => {
      header.style.display = 'none'; // Run the callback
    }, 5000);
  },
  false
);

// go up button
upButton.addEventListener('click', toTopPage);
