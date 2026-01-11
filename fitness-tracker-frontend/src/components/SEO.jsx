import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, name, type }) => {
    return (
        <Helmet>
            {/* Standard metadata tags */}
            <title>{title}</title>
            <meta name='description' content={description} />

            {/* End standard metadata tags */}

            {/* Facebook tags */}
            <meta property="og:type" content={type} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            {/* End Facebook tags */}

            {/* Twitter tags */}
            <meta name="twitter:creator" content={name} />
            <meta name="twitter:card" content={type} />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            {/* End Twitter tags */}
        </Helmet>
    );
}

SEO.propTypes = {
    title: PropTypes.string,
    description: PropTypes.string,
    name: PropTypes.string,
    type: PropTypes.string,
};

SEO.defaultProps = {
    title: 'Fitness Tracker - Track Your Progress',
    description: 'Track your workouts, set goals, and monitor your fitness journey with our comprehensive fitness tracker application.',
    name: 'Fitness Tracker',
    type: 'website'
};

export default SEO;
