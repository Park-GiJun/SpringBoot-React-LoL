import React from 'react';
import PropTypes from 'prop-types';

function Modal({ isOpen, onClose, children }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-gray-800 dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md">
                <button onClick={onClose} className="float-right text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                    ✕
                </button>
                {children}
            </div>
        </div>
    );
}

Modal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,
};

export default Modal;