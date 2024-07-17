import React from 'react';
import PropTypes from 'prop-types';

function Button({ onClick, children, className }) {
    return (
        <button
            onClick={onClick}
            className={`${className} transition duration-300`}
        >
            {children}
        </button>
    );
}

Button.propTypes = {
    onClick: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
};

export default Button;