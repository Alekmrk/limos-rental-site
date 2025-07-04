// Utility function to scroll to reservation card (works for both desktop and mobile)
export const scrollToReservationCard = () => {
  // Check if we're on mobile (screen width < 768px which is md breakpoint)
  const isMobile = window.innerWidth < 768;
  
  if (isMobile) {
    // On mobile, look for the mobile reservation card first
    // Find elements that have both 'reservation' class and are visible on mobile
    const allReservationCards = document.querySelectorAll('.reservation');
    const mobileCard = Array.from(allReservationCards).find(card => {
      const styles = window.getComputedStyle(card);
      return styles.display !== 'none' && !card.classList.contains('hidden');
    });
    
    if (mobileCard) {
      // Scroll a bit higher for better positioning
      const rect = mobileCard.getBoundingClientRect();
      const offsetTop = window.pageYOffset + rect.top - 100; // 100px offset from top
      
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
      return;
    }
  }
  
  // On desktop, find the reservation card that's positioned absolutely (the desktop one)
  const allReservationCards = document.querySelectorAll('.reservation');
  let desktopCard = null;
  
  Array.from(allReservationCards).forEach(card => {
    const styles = window.getComputedStyle(card);
    // Look for the card that's positioned absolutely or has md:block class
    if (styles.position === 'absolute' || card.classList.contains('md:block')) {
      desktopCard = card;
    }
  });
  
  // Fallback to any reservation card
  if (!desktopCard) {
    desktopCard = document.querySelector('.reservation');
  }
  
  if (desktopCard) {
    // Scroll higher up for better positioning
    const rect = desktopCard.getBoundingClientRect();
    const offsetTop = window.pageYOffset + rect.top - 150; // 150px offset from top for desktop
    
    window.scrollTo({
      top: offsetTop,
      behavior: 'smooth'
    });
  }
};