import React from 'react';
import cl from 'classnames';
import { observer } from 'mobx-react-lite';
import { store } from 'store';
import s from './Wallet.module.scss';

const wallets = [
  {
    number: 1,
    owner: 'Alice',
  },
  {
    number: 2,
    owner: 'Bob',
  },
  {
    number: 3,
    owner: 'Charlie',
  },
  {
    number: 4,
    owner: 'Mary',
  },
];

const Wallets = observer(({ className }: { className: string }) => {
  const { currentWallet } = store;

  return (
    <div className={cl(s.root, className)}>
      <h2 className={s.title}>Wallets: </h2>
      <div className={s.wallets}>
        {wallets.map(({ number: wallet, owner }) => (
          <label
            key={wallet}
            className={cl(s.wallet, { [s.walletSelected]: wallet === currentWallet })}
          >
            {wallet} ({owner})
            <input
              type='radio'
              name='wallet'
              value={wallet}
              checked={wallet === currentWallet}
              onChange={(ev) => store.selectWallet(Number(ev.target.value))}
            />
          </label>
        ))}
      </div>
    </div>
  );
});

export { Wallets };
