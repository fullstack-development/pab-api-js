import React, { useState, ChangeEvent } from 'react';
import { observer } from 'mobx-react-lite';
import cl from 'classnames';
import { store } from 'store';
import { Button, TextField, Select, Loading } from 'components';
import { Token, Action } from 'types';
import s from './Actions.module.scss';

const options: Token[] = ['A', 'B', 'C', 'D'];

const Actions = observer(({ className }: { className: string }) => {
  const { loadings } = store;
  const [openAction, setOpenAction] = useState<null | Action>(null);
  const [token1, setToken1] = useState<Token>('A');
  const [token1Amount, setToken1Amount] = useState<number>();
  const [token2, setToken2] = useState<Token>('B');
  const [token2Amount, setToken2Amount] = useState<number>();
  const [tokensNumber, setTokensNumber] = useState<number>();

  const getSelectProps = (value: Token, setValue: (v: Token) => void) => ({
    options: options,
    value,
    onChange: (ev: ChangeEvent<HTMLSelectElement>) => setValue(ev.target.value as Token),
  });

  const getInputProps = (value: number | undefined, setValue: (v: number | undefined) => void) => ({
    type: 'number',
    required: true,
    value: typeof value === 'number' ? value : '',
    onChange: (ev: ChangeEvent<HTMLInputElement>) =>
      setValue(ev.target.value === '' ? undefined : Number(ev.target.value)),
  });

  const token1View = <Select label='Token 1' {...getSelectProps(token1, setToken1)} />;
  const token2View = <Select label='Token 2' {...getSelectProps(token2, setToken2)} />;
  const token1AmountView = (
    <TextField label='Amount' {...getInputProps(token1Amount, setToken1Amount)} />
  );
  const token2AmountView = (
    <TextField label='Amount' {...getInputProps(token2Amount, setToken2Amount)} />
  );
  const tokensNumberView = (
    <TextField label='Tokens number' {...getInputProps(tokensNumber, setTokensNumber)} />
  );

  const actionsConfig = {
    create: {
      description: 'Create a liquidity pool for 2 tokens',
      content: (
        <>
          <div>
            {token1View}
            {token1AmountView}
          </div>
          <div>
            {token2View}
            {token2AmountView}
          </div>
        </>
      ),
    },
    swap: {
      description: 'Swap a certain amount of one token for another',
      content: (
        <>
          <div>
            {token1View}
            {token1AmountView}
          </div>
          <div>{token2View}</div>
        </>
      ),
    },
    add: {
      description: 'Add tokens to the liquidity pool',
      content: (
        <>
          <div>
            {token1View}
            {token1AmountView}
          </div>
          <div>
            {token2View}
            {token2AmountView}
          </div>
        </>
      ),
    },
    remove: {
      description: 'Remove a certain amount of liquidity tokens from the pool',
      content: (
        <>
          <div>
            {token1View}
            {token2View}
          </div>
          <div>{tokensNumberView}</div>
        </>
      ),
    },
    close: {
      description: 'Close the pool',
      content: (
        <>
          <div>
            {token1View}
            {token2View}
          </div>
        </>
      ),
    },
  };

  const handleActionClick = (action: Action) => {
    if (action === openAction) {
      setOpenAction(null);
    } else {
      setOpenAction(action);
    }
  };

  const handleSubmit = (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    if (!openAction) return;
    store.callAction(openAction, { token1, token1Amount, token2, token2Amount, tokensNumber });
  };

  return (
    <div className={cl(s.root, className)}>
      <h2 className={s.title}>Actions{loadings.actions ? <Loading /> : null}</h2>
      <div className={s.actions}>
        {(Object.keys(actionsConfig) as Action[]).map((action) => {
          const { description, content } = actionsConfig[action];
          return (
            <div key={action} className={cl(s.action, { [s.actionOpen]: action === openAction })}>
              <h3 className={s.actionTitle} onClick={() => handleActionClick(action)}>
                {action}
              </h3>
              {openAction === action && (
                <>
                  <div className={s.description}>{description}</div>
                  <form className={s.form} onSubmit={handleSubmit}>
                    {content}
                    <Button className={s.submit} type='submit'>
                      Send
                    </Button>
                  </form>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
});

export { Actions };
