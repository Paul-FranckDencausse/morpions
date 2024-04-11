import React from 'react';
import './Container.scss';

const Container = ({ children }) => (
  <div className="uk-flex uk-flex-middle uk-animation-fade">
    <div className='uk-margin uk-width-large uk-margin-auto uk-card uk-card-default uk-card-body container'>
      {children}
    </div>
  </div>
);

export default Container