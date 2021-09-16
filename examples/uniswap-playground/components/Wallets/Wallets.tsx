import React from 'react';
import cl from 'classnames';
import { observer } from 'mobx-react-lite';
import { store } from 'store';
import { Loading } from 'components';
import { cutString } from 'utils/helpers';
import s from './Wallet.module.scss';

const walletsOwners = ['Alice', 'Bob', 'Charlie', 'Mary'];

const Wallets = observer(({ className }: { className: string }) => {
  const { wallets, currentWalletId } = store;

  return (
    <div className={cl(s.root, className)}>
      <h2 className={s.title}>Wallets: </h2>
      {!currentWalletId ? (
        <Loading />
      ) : (
        <div className={s.wallets}>
          {wallets.map(({ id: walletId }, i) => (
            <label
              key={walletId}
              className={cl(s.wallet, { [s.walletSelected]: walletId === currentWalletId })}
            >
              {walletsOwners[i] || 'Some user'}
              <small className={s.text}>{cutString(walletId, 3, 3)}</small>
              <input
                type='radio'
                name='wallet'
                value={walletId}
                checked={walletId === currentWalletId}
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
