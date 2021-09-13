/* eslint-disable @next/next/no-page-custom-font */
import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import type { NextPage } from 'next';
import Head from 'next/head';
import { store } from 'store';
import { Actions, Assets, Logs, Wallets } from 'components';
import s from '../styles/Home.module.scss';

const Home: NextPage = observer(() => {
  const { pabExists } = store;

  useEffect(() => {
    store.initProject();
  }, []);

  return (
    <>
      <Head>
        <title>Example for pab-api-js</title>
        <meta name='description' content='Example for pab-api-js' />
        <link rel='icon' href='/favicon.ico' />
        <link
          href='https://fonts.googleapis.com/css2?family=Montserrat:wght@300;500;700&display=swap'
          rel='stylesheet'
        />
      </Head>
      <div className={s.content}>
        <div className={s.titleWrap}>
          <h1 className={s.title}>Uniswap</h1>
          {pabExists === false && <h2 className={s.error}>PAB not found</h2>}
        </div>
        <Wallets className={s.wallets} />
        <Actions className={s.actions} />
        <Assets className={s.assets} />
        <Logs className={s.logs} />
      </div>
    </>
  );
});

export default Home;
