import React, { useEffect, useRef } from 'react';
import { StaticImage } from 'gatsby-plugin-image';
import styled from 'styled-components';
import { srConfig } from '@config';
import sr from '@utils/sr';
import { usePrefersReducedMotion } from '@hooks';

const StyledAboutSection = styled.section`
  max-width: 900px;

  .inner {
    display: grid;
    grid-template-columns: 3fr 2fr;
    grid-gap: 50px;

    @media (max-width: 768px) {
      display: block;
    }
  }
`;
const StyledText = styled.div`
  .tech-categories {
    margin-top: 25px;

    .tech-category {
      margin-bottom: 15px;

      h4 {
        font-family: var(--font-mono);
        font-size: var(--fz-xs);
        color: var(--green);
        margin-bottom: 5px;
        text-transform: uppercase;
        letter-spacing: 1px;
      }

      p {
        font-family: var(--font-mono);
        font-size: var(--fz-xs);
        color: var(--slate-light);
        line-height: 1.7;
      }
    }
  }
`;
const StyledPic = styled.div`
  position: relative;
  max-width: 300px;

  @media (max-width: 768px) {
    margin: 50px auto 0;
    width: 70%;
  }

  .wrapper {
    ${({ theme }) => theme.mixins.boxShadow};
    display: block;
    position: relative;
    width: 100%;
    border-radius: var(--border-radius);
    background-color: var(--green);

    &:hover,
    &:focus {
      outline: 0;
      transform: translate(-4px, -4px);

      &:after {
        transform: translate(8px, 8px);
      }

      .img {
        filter: none;
        mix-blend-mode: normal;
      }
    }

    .img {
      position: relative;
      border-radius: var(--border-radius);
      mix-blend-mode: multiply;
      filter: grayscale(100%) contrast(1);
      transition: var(--transition);
    }

    &:before,
    &:after {
      content: '';
      display: block;
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: var(--border-radius);
      transition: var(--transition);
    }

    &:before {
      top: 0;
      left: 0;
      background-color: var(--navy);
      mix-blend-mode: screen;
    }

    &:after {
      border: 2px solid var(--green);
      top: 14px;
      left: 14px;
      z-index: -1;
    }
  }
`;

const About = () => {
  const revealContainer = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    sr.reveal(revealContainer.current, srConfig());
  }, []);

  const techCategories = [
    {
      title: 'Backend',
      items: ['Java', 'Spring Boot', 'Node.js', 'REST APIs', 'PostgreSQL'],
    },
    {
      title: 'Frontend',
      items: ['TypeScript', 'React', 'Next.js', 'Angular'],
    },
    {
      title: 'Infrastructure',
      items: ['Linux', 'Docker', 'Git', 'Networking', 'Cloud'],
    },
  ];

  return (
    <StyledAboutSection id="about" ref={revealContainer}>
      <h2 className="numbered-heading">About Me</h2>

      <div className="inner">
        <StyledText>
          <div>
            <p>
              I'm a Computer Science student at{' '}
              <a href="https://www.ulaval.ca/" target="_blank" rel="noreferrer">
                Université Laval
              </a>{' '}
              with a growing focus on backend engineering, system architecture, and infrastructure
              — alongside a deep interest in cybersecurity and building secure systems.
            </p>

            <p>
              I enjoy building APIs, working with databases, designing software systems, and
              understanding what happens behind the applications we use every day. My current
              journey is centered around Java, Spring Boot, PostgreSQL, Linux, Docker, networking,
              and cloud technologies — and I'm always exploring ways to make those systems more
              secure, from threat modeling to hardening infrastructure.
            </p>

            <p>
              I learn by building, experimenting, and sharing what I discover — while documenting
              my growth publicly through content creation and live coding on{' '}
              <a href="https://www.youtube.com/@licode30" target="_blank" rel="noreferrer">
                YouTube
              </a>{' '}
              and{' '}
              <a href="https://www.twitch.tv/dereal_ismael" target="_blank" rel="noreferrer">
                Twitch
              </a>
              .
            </p>

            <p>
              Outside of tech, you'll usually find me playing video games, watching anime, drawing,
              listening to music, or exploring new ideas.
            </p>
          </div>

          <div className="tech-categories">
            {techCategories.map((category, i) => (
              <div key={i} className="tech-category">
                <h4>{category.title}</h4>
                <p>{category.items.join(' · ')}</p>
              </div>
            ))}
          </div>
        </StyledText>

        <StyledPic>
          <div className="wrapper">
            <StaticImage
              className="img"
              src="../../images/me.jpg"
              width={500}
              quality={95}
              formats={['AUTO', 'WEBP', 'AVIF']}
              alt="Headshot"
            />
          </div>
        </StyledPic>
      </div>
    </StyledAboutSection>
  );
};

export default About;
