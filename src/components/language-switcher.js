import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { Link, useI18next } from 'gatsby-plugin-react-i18next';

const StyledLanguageSwitcher = styled.ul`
  display: flex;
  align-items: center;
  margin: 0;
  padding: 0;
  list-style: none;
  font-family: var(--font-mono);
  font-size: var(--fz-xs);

  li {
    display: flex;
    align-items: center;
    margin: 0;
  }

  .separator {
    color: var(--slate);
    font-size: var(--fz-xxs);
    user-select: none;
  }

  a {
    padding: 5px;
    color: var(--slate);
    text-decoration: none;
    transition: var(--transition);

    &:hover,
    &:focus-visible {
      color: var(--green);
      outline: none;
    }

    &.active {
      color: var(--green);
    }
  }

  ${({ $mobile }) =>
    $mobile &&
    css`
      justify-content: center;
      margin: 0 auto 25px;
      font-size: var(--fz-sm);

      a {
        padding: 10px 12px;
      }
    `}
`;

const LanguageSwitcher = ({ mobile = false }) => {
  const { language, languages, originalPath, t } = useI18next();

  return (
    <StyledLanguageSwitcher $mobile={mobile} aria-label={t('nav.language')}>
      {languages.map((lng, i) => (
        <li key={lng}>
          {i > 0 && (
            <span className="separator" aria-hidden="true">
              /
            </span>
          )}
          <Link
            to={originalPath}
            language={lng}
            className={lng === language ? 'active' : ''}
            aria-current={lng === language ? 'true' : undefined}>
            {lng.toUpperCase()}
          </Link>
        </li>
      ))}
    </StyledLanguageSwitcher>
  );
};

LanguageSwitcher.propTypes = {
  mobile: PropTypes.bool,
};

export default LanguageSwitcher;
