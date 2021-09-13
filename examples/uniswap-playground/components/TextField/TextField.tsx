import React from 'react';
import cl from 'classnames';
import s from './TextField.module.scss';

type Props = {
  isSmall?: true;
  label?: string;
};

const TextField = (props: React.InputHTMLAttributes<HTMLInputElement> & Props) => {
  const { className, isSmall = false, label = '', ...inputProps } = props;

  return (
    <label className={cl(s.root, className, { [s.small]: isSmall })}>
      {label && <div>{label}</div>}
      <input type='text' {...inputProps} className={s.input} />
    </label>
  );
};

export { TextField };
