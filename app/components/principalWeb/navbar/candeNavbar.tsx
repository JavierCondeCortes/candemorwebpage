'use client';

import { useState } from 'react';
import styles from './navbar.module.css';
import { NavItem, Colors } from '@/app/lib/configManager';

interface CandeNavbarProps {
  navigation: NavItem[];
  colors: Colors;
}

export function CandeNavbar({ navigation, colors }: CandeNavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [hoverDropdown, setHoverDropdown] = useState<number | null>(null);

  const toggleHamburger = () => {
    setIsOpen(!isOpen);
    setOpenDropdown(null);
  };

  const toggleDropdown = (id: number) => {
    setOpenDropdown(openDropdown === id ? null : id);
  };

  const handleNavItemClick = () => {
    setIsOpen(false);
    setOpenDropdown(null);
  };

  // Dividir navegación: logo en centro, resto distribuido
  const navItems = navigation;

  return (
    <>
      <nav 
        className={styles.navbar}
        style={{
          backgroundColor: colors.navbar_bg,
          color: colors.navbar_text,
        }}
      >
        <div className={styles.navbarContainer}>
          {/* Menu Izquierda */}
          <ul className={styles.navMenuLeft}>
            {navItems.slice(0, Math.ceil(navItems.length / 2)).map((item) => (
              <li 
                key={item.id} 
                className={styles.navItem}
                onMouseEnter={() => item.subitems.length > 0 && setHoverDropdown(item.id)}
                onMouseLeave={() => setHoverDropdown(null)}
              >
                <a href={item.url}>{item.label}</a>
                {item.subitems.length > 0 && (
                  <button
                    className={styles.dropdownToggle}
                    onClick={() => toggleDropdown(item.id)}
                  >
                    ▼
                  </button>
                )}
              </li>
            ))}
          </ul>

          {/* Logo - Centro */}
          <div className={styles.navbarLogo}>
            <p style={{ fontFamily: 'var(--cande_font)', fontSize: '2rem' }} >Candemor</p>
          </div>

          {/* Menu Derecha */}
          <ul className={styles.navMenuRight}>
            {navItems.slice(Math.ceil(navItems.length / 2)).map((item) => (
              <li 
                key={item.id} 
                className={styles.navItem}
                onMouseEnter={() => item.subitems.length > 0 && setHoverDropdown(item.id)}
                onMouseLeave={() => setHoverDropdown(null)}
              >
                <a href={item.url}>{item.label}</a>
                {item.subitems.length > 0 && (
                  <button
                    className={styles.dropdownToggle}
                    onClick={() => toggleDropdown(item.id)}
                  >
                    ▼
                  </button>
                )}
              </li>
            ))}
          </ul>

          {/* Hamburger - Mobile */}
          <button 
            className={`${styles.hamburger} ${isOpen ? styles.active : ''}`}
            onClick={toggleHamburger}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>

      {/* Dropdowns desktop - Ancho completo */}
      {navigation.map((item) => (
        item.subitems.length > 0 && (
          <div
            key={`dropdown-${item.id}`}
            className={`${styles.desktopDropdown} ${hoverDropdown === item.id ? styles.show : ''}`}
            style={{
              backgroundColor: colors.navbar_text,
              color: '#000',
            }}
            onMouseEnter={() => setHoverDropdown(item.id)}
            onMouseLeave={() => setHoverDropdown(null)}
          >
            <div className={styles.dropdownContent}>
              <div className={styles.dropdownTitle}>{item.label}</div>
              <div className={styles.dropdownSubitems}>
                {item.subitems.map((subitem, idx) => (
                  <a 
                    key={idx}
                    href={subitem.url}
                    className={styles.dropdownSubitem}
                    onClick={handleNavItemClick}
                  >
                    {subitem.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        )
      ))}

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div 
          className={styles.navDropdown}
          style={{
            backgroundColor: colors.navbar_bg,
            color: colors.navbar_text,
          }}
        >
          {navigation.map((item) => (
            <div key={item.id} className={styles.dropdownItem}>
              <div 
                className={styles.dropdownTitle}
                onClick={() => {
                  if (item.subitems.length > 0) {
                    toggleDropdown(item.id);
                  } else {
                    handleNavItemClick();
                  }
                }}
              >
                {item.label}
                {item.subitems.length > 0 && (
                  <span className={`${styles.chevron} ${openDropdown === item.id ? styles.open : ''}`}>
                    ▼
                  </span>
                )}
              </div>

              {item.subitems.length > 0 && openDropdown === item.id && (
                <div className={styles.dropdownSubitems}>
                  {item.subitems.map((subitem, idx) => (
                    <a 
                      key={idx}
                      href={subitem.url}
                      className={styles.dropdownSubitem}
                      onClick={handleNavItemClick}
                    >
                      {subitem.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
}
