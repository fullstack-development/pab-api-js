import React from 'react';
import cl from 'classnames';
import s from './Button.module.scss';

type Props = {
  isOutlined?: true;
};

const Button = (props: React.ButtonHTMLAttributes<HTMLButtonElement> & Props) => {
  const { isOutlined = false, className, ...buttonProps } = props;
  const classes = cl(className, s.root, { [s.outlined]: isOutlined });

  return <button type='button' className={classes} {...buttonProps}></button>;
};

export { Button };
