import React from 'react';

import './Button.css';

const Button = ({ children, loading, ClassName, ...props }) => (
    <button className={`btn ${ClassName}`} disabled={loading} {...props}>
        {loading ? 'Loading...' : children}
    </button>
);


export default Button;
