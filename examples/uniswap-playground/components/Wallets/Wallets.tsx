import React from 'react';
import cl from 'classnames';
import { observer } from 'mobx-react-lite';
import { store } from 'store';
import { Loading } from 'components';
import { cutString } from 'utils/helpers';
import s from './Wallet.module.scss';

const owners = ['Alice', 'Bob', 'Charlie', 'Mary'];

const Wallets = observer(({ className }: { className: string }) => {
  const { wallets, currentWallet } = store;

  return (
    <div className={cl(s.root, className)}>
      <h2 className={s.title}>Wallets: </h2>
      {!currentWallet ? (
        <Loading />
      ) : (
        <div className={s.wallets}>
          {wallets.map((wallet, i) => (
            <label
              key={wallet}
              className={cl(s.wallet, { [s.walletSelected]: wallet === currentWallet })}
            >
              {owners[i] || 'Some user'}
              <small className={s.text}>{cutString(wallet, 3, 3)}</small>
              <input
                type='radio'
                name='wallet'
                value={wallet}
                checked={wallet === currentWallet}
                onChange={(ev) => store.switchWallet(ev.target.value)}
              />
            </label>
          ))}
        </div>
      )}
    </div>
  );
});

export { Wallets };
