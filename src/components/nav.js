import React, { useState, useEffect, useRef } from 'react';
import { Link, useI18next } from 'gatsby-plugin-react-i18next';
import PropTypes from 'prop-types';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import styled, { css } from 'styled-components';
import { navLinks, resumes } from '@config';
import { loaderDelay } from '@utils';
import { useScrollDirection, usePrefersReducedMotion, useOnClickOutside } from '@hooks';
import { Menu } from '@components';
import LanguageSwitcher from './language-switcher';
import { IconLogo, IconHex } from '@components/icons';

const StyledHeader = styled.header`
  ${({ theme }) => theme.mixins.flexBetween};
  position: fixed;
  top: 0;
  z-index: 11;
  padding: 0px 50px;
  width: 100%;
  height: var(--nav-height);
  background-color: rgba(10, 25, 47, 0.85);
  filter: none !important;
  pointer-events: auto !important;
  user-select: auto !important;
  backdrop-filter: blur(10px);
  transition: var(--transition);

  @media (max-width: 1080px) {
    padding: 0 40px;
  }
  @media (max-width: 768px) {
    padding: 0 25px;
  }

  @media (prefers-reduced-motion: no-preference) {
    ${props =>
    props.scrollDirection === 'up' &&
      !props.scrolledToTop &&
      css`
        height: var(--nav-scroll-height);
        transform: translateY(0px);
        background-color: rgba(10, 25, 47, 0.85);
        box-shadow: 0 10px 30px -10px var(--navy-shadow);
      `};

    ${props =>
    props.scrollDirection === 'down' &&
      !props.scrolledToTop &&
      css`
        height: var(--nav-scroll-height);
        transform: translateY(calc(var(--nav-scroll-height) * -1));
        box-shadow: 0 10px 30px -10px var(--navy-shadow);
      `};
  }
`;

const StyledNav = styled.nav`
  ${({ theme }) => theme.mixins.flexBetween};
  position: relative;
  width: 100%;
  color: var(--lightest-slate);
  font-family: var(--font-mono);
  counter-reset: item 0;
  z-index: 12;

  .logo {
    ${({ theme }) => theme.mixins.flexCenter};

    a {
      color: var(--green);
      width: 42px;
      height: 42px;
      position: relative;
      z-index: 1;

      .hex-container {
        position: absolute;
        top: 0;
        left: 0;
        z-index: -1;
        @media (prefers-reduced-motion: no-preference) {
          transition: var(--transition);
        }
      }

      .logo-container {
        position: relative;
        z-index: 1;
        svg {
          fill: none;
          user-select: none;
          @media (prefers-reduced-motion: no-preference) {
            transition: var(--transition);
          }
          polygon {
            fill: var(--navy);
          }
        }
      }

      &:hover,
      &:focus {
        outline: 0;
        transform: translate(-4px, -4px);
        .hex-container {
          transform: translate(4px, 3px);
        }
      }
    }
  }
`;

const StyledLinks = styled.div`
  display: flex;
  align-items: center;

  @media (max-width: 768px) {
    display: none;
  }

  ol {
    ${({ theme }) => theme.mixins.flexBetween};
    padding: 0;
    margin: 0;
    list-style: none;

    li {
      margin: 0 5px;
      position: relative;
      counter-increment: item 1;
      font-size: var(--fz-xs);

      a {
        padding: 10px;

        &:before {
          content: '0' counter(item) '.';
          margin-right: 5px;
          color: var(--green);
          font-size: var(--fz-xxs);
          text-align: right;
        }
      }
    }
  }

  .nav-actions {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-left: 15px;
  }

  .resume-dropdown {
    position: relative;
  }

  .resume-button {
    ${({ theme }) => theme.mixins.smallButton};
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: var(--fz-xs);
    cursor: pointer;

    .chevron {
      font-size: 0.6rem;
      line-height: 1;
      transition: var(--transition);
    }

    &[aria-expanded='true'] .chevron {
      transform: rotate(180deg);
    }
  }

  .resume-menu {
    position: absolute;
    top: calc(100% + 10px);
    right: 0;
    z-index: 20;
    min-width: 150px;
    margin: 0;
    padding: 6px;
    list-style: none;
    background-color: var(--light-navy);
    border: 1px solid var(--green-tint);
    border-radius: var(--border-radius);
    box-shadow: 0 10px 30px -10px var(--navy-shadow);
    opacity: 0;
    visibility: hidden;
    transform: translateY(-8px);
    transition: var(--transition);

    &.open {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
    }

    li {
      margin: 0;
    }

    a {
      display: block;
      padding: 8px 12px;
      border-radius: var(--border-radius);
      color: var(--lightest-slate);
      font-size: var(--fz-xs);
      text-align: left;
      white-space: nowrap;

      &:hover,
      &:focus-visible {
        color: var(--green);
        background-color: var(--green-tint);
        outline: none;
      }
    }
  }
`;

const Nav = ({ isHome }) => {
  const { t } = useI18next();
  const [isMounted, setIsMounted] = useState(!isHome);
  const scrollDirection = useScrollDirection('down');
  const [scrolledToTop, setScrolledToTop] = useState(true);
  const [resumeOpen, setResumeOpen] = useState(false);
  const resumeRef = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useOnClickOutside(resumeRef, () => setResumeOpen(false));

  const handleScroll = () => {
    setScrolledToTop(window.pageYOffset < 50);
  };

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    const timeout = setTimeout(() => {
      setIsMounted(true);
    }, 100);

    window.addEventListener('scroll', handleScroll);

    return () => {
      clearTimeout(timeout);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const timeout = isHome ? loaderDelay : 0;
  const fadeClass = isHome ? 'fade' : '';
  const fadeDownClass = isHome ? 'fadedown' : '';

  const Logo = (
    <div className="logo" tabIndex="-1">
      <Link to="/" aria-label={t('nav.home')}>
        <div className="hex-container">
          <IconHex />
        </div>
        <div className="logo-container">
          <IconLogo />
        </div>
      </Link>
    </div>
  );

  const ResumeLink = (
    <div
      className="resume-dropdown"
      ref={resumeRef}
      onKeyDown={e => e.key === 'Escape' && setResumeOpen(false)}>
      <button
        type="button"
        className="resume-button"
        aria-haspopup="true"
        aria-expanded={resumeOpen}
        onClick={() => setResumeOpen(open => !open)}>
        {t('nav.resume')}
        <span className="chevron" aria-hidden="true">
          ▾
        </span>
      </button>

      <ul className={`resume-menu${resumeOpen ? ' open' : ''}`}>
        {resumes.map(({ label, url }) => (
          <li key={label}>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setResumeOpen(false)}>
              {label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <StyledHeader scrollDirection={scrollDirection} scrolledToTop={scrolledToTop}>
      <StyledNav>
        {prefersReducedMotion ? (
          <>
            {Logo}

            <StyledLinks>
              <ol>
                {navLinks &&
                  navLinks.map(({ url, key, name }, i) => (
                    <li key={i}>
                      <Link to={url}>{t(`nav.${key}`, name)}</Link>
                    </li>
                  ))}
              </ol>
              <div className="nav-actions">
                <LanguageSwitcher />
                {ResumeLink}
              </div>
            </StyledLinks>

            <Menu />
          </>
        ) : (
          <>
            <TransitionGroup component={null}>
              {isMounted && (
                <CSSTransition classNames={fadeClass} timeout={timeout}>
                  <>{Logo}</>
                </CSSTransition>
              )}
            </TransitionGroup>

            <StyledLinks>
              <ol>
                <TransitionGroup component={null}>
                  {isMounted &&
                    navLinks &&
                    navLinks.map(({ url, key, name }, i) => (
                      <CSSTransition key={i} classNames={fadeDownClass} timeout={timeout}>
                        <li key={i} style={{ transitionDelay: `${isHome ? i * 100 : 0}ms` }}>
                          <Link to={url}>{t(`nav.${key}`, name)}</Link>
                        </li>
                      </CSSTransition>
                    ))}
                </TransitionGroup>
              </ol>

              <TransitionGroup component={null}>
                {isMounted && (
                  <CSSTransition classNames={fadeDownClass} timeout={timeout}>
                    <div
                      className="nav-actions"
                      style={{ transitionDelay: `${isHome ? navLinks.length * 100 : 0}ms` }}>
                      <LanguageSwitcher />
                      {ResumeLink}
                    </div>
                  </CSSTransition>
                )}
              </TransitionGroup>
            </StyledLinks>

            <TransitionGroup component={null}>
              {isMounted && (
                <CSSTransition classNames={fadeClass} timeout={timeout}>
                  <Menu />
                </CSSTransition>
              )}
            </TransitionGroup>
          </>
        )}
      </StyledNav>
    </StyledHeader>
  );
};

Nav.propTypes = {
  isHome: PropTypes.bool,
};

export default Nav;
