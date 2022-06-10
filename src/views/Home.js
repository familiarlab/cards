
import React, { Suspense } from 'react';

const HomeContainer = React.lazy(() => import('../features/home/HomeContainer'));

export const Home = (props) => {
  return (
    <>
      <Suspense fallback={<div></div>}>
        <HomeContainer />
      </Suspense>
    </>
  );
}
