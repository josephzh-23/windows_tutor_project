import { useState, useEffect, useRef } from 'react';

export default function useComponentVisible(initialIsVisible) {
    const [isComponentVisible, setIsComponentVisible] = useState(initialIsVisible);
    const ref = useRef(null);

    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsComponentVisible(false);
      }
    };

    useEffect(() => {
      const filterFormContainer = document.querySelector('.filter-form-container');
      const contentCover = document.querySelector('.content-cover');
      if (ref.current.contains(filterFormContainer) && contentCover) {
        isComponentVisible ? contentCover.classList.add('cover-active') : contentCover.classList.remove('cover-active');
      }

      const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
      const pageCover = document.querySelector('.page-cover');
      if (ref.current.contains(mobileMenuBtn)) {
        isComponentVisible ? pageCover.classList.add('cover-active') : pageCover.classList.remove('cover-active');
      }

      document.addEventListener('click', handleClickOutside, true);
      return () => {
        document.removeEventListener('click', handleClickOutside, true);
      };
    });

    return { ref, isComponentVisible, setIsComponentVisible };
}