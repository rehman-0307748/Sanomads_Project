
  const hamburger = document.querySelector('.header_hamburger');
  const cancel = document.querySelector('.cancel_icon');
  const mobileNav = document.querySelector('.mobile_nav_container');
  const overlay = document.querySelector('.mobile_out_lay');
  
  // Function to open the mobile menu
  const openMenu = () => {
    mobileNav.classList.add('active');
  };
  
  // Function to close the mobile menu
  const closeMenu = () => {
    mobileNav.classList.remove('active');
  };
  
  // Open when clicking hamburger
  if (hamburger) {
    hamburger.addEventListener('click', openMenu);
  }
  
  // Close when clicking the cancel (X) icon
  if (cancel) {
    cancel.addEventListener('click', closeMenu);
  }
  
  // Close when clicking the dark overlay (out_lay) - THIS IS WHAT YOU WANTED
  if (overlay) {
    overlay.addEventListener('click', closeMenu);
  }
  
  
  const menuPanel = document.querySelector('.mobile_wrapper');
  if (menuPanel) {
    menuPanel.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }
