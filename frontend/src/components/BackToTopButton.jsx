import React, { useEffect, useState } from 'react';

function BackToTopButton() {

  const [showButton, setShowButton] = useState(false);


  useEffect(() => {

    const handleScroll = () => {

      if (window.scrollY > 300) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }

    };


    window.addEventListener('scroll', handleScroll);


    return () => {
      window.removeEventListener('scroll', handleScroll);
    };

  }, []);


  const handleBackToTop = () => {

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });

  };


  return (
    <section id="backtop">

      <div className="row mx-0">

        <div className="col-lg-12">

          {showButton && (
            <button
              className="back-btn"
              onClick={handleBackToTop}
              aria-label="Back to top"
            >
              <i class="bi bi-arrow-up"></i>
            </button>
          )}

        </div>

      </div>

    </section>
  );
}

export default BackToTopButton;
