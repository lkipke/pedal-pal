import React, { ChangeEventHandler } from 'react';

interface SliderProps {
  value: number;
  onChange?: ChangeEventHandler<HTMLInputElement>;
}

const Slider: React.FC<SliderProps> = ({ onChange, value }) => (
  <input
    type='range'
    min='25'
    max='800'
    step='25'
    onChange={onChange}
    value={value}
  />
);

export default Slider;
