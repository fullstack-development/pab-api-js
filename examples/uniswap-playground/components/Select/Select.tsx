import React from 'react';
import cl from 'classnames';
import s from './Select.module.scss';

type Props = {
  options: string[];
  label?: string;
};

const Select = (props: React.SelectHTMLAttributes<HTMLSelectElement> & Props) => {
  const { className, options, label = '', ...selectProps } = props;

  return (
    <label className={cl(s.root, className)}>
      {label && <div>{label}</div>}
      <select className={s.select} {...selectProps}>
        {options.map((option) => (
          <option key={option} className={s.option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
};

export { Select };
