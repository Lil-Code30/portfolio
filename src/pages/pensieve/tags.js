import React from 'react';
import { graphql } from 'gatsby';
import { Link, useI18next } from 'gatsby-plugin-react-i18next';
import kebabCase from 'lodash/kebabCase';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import { Layout } from '@components';

const StyledTagsContainer = styled.main`
  max-width: 1000px;

  h1 {
    margin-bottom: 50px;
  }
  ul {
    color: var(--light-slate);

    li {
      font-size: var(--fz-xxl);

      a {
        color: var(--light-slate);

        .count {
          color: var(--slate);
          font-family: var(--font-mono);
          font-size: var(--fz-md);
        }
      }
    }
  }
`;

const TagsPage = ({
  data: {
    allMarkdownRemark: { group },
  },
  location,
}) => {
  const { t } = useI18next();

  return (
    <Layout location={location}>
      <Helmet title={t('pensieve.tagsTitle')} />

      <StyledTagsContainer>
        <span className="breadcrumb">
          <span className="arrow">&larr;</span>
          <Link to="/pensieve">{t('pensieve.allMemories')}</Link>
        </span>

        <h1>{t('pensieve.tagsTitle')}</h1>
        <ul className="fancy-list">
          {group.map(tag => (
            <li key={tag.fieldValue}>
              <Link to={`/pensieve/tags/${kebabCase(tag.fieldValue)}/`} className="inline-link">
                {tag.fieldValue} <span className="count">({tag.totalCount})</span>
              </Link>
            </li>
          ))}
        </ul>
      </StyledTagsContainer>
    </Layout>
  );
};

TagsPage.propTypes = {
  data: PropTypes.shape({
    allMarkdownRemark: PropTypes.shape({
      group: PropTypes.arrayOf(
        PropTypes.shape({
          fieldValue: PropTypes.string.isRequired,
          totalCount: PropTypes.number.isRequired,
        }).isRequired,
      ),
    }),
    site: PropTypes.shape({
      siteMetadata: PropTypes.shape({
        title: PropTypes.string.isRequired,
      }),
    }),
  }),
  location: PropTypes.object,
};

export default TagsPage;

export const pageQuery = graphql`
  query ($language: String!) {
    allMarkdownRemark(
      limit: 2000
      filter: { fields: { language: { eq: $language } } }
    ) {
      group(field: {frontmatter: {tags: SELECT}}) {
        fieldValue
        totalCount
      }
    }
    locales: allLocale(filter: { language: { eq: $language } }) {
      edges {
        node {
          ns
          data
          language
        }
      }
    }
  }
`;
