// AchievementsList.jsx

import React from 'react';
import Image from 'next/image';

const AchievementsList = ({ results }) => {
  const achievements = [
    { name: 'first', limit: 0 },
    { name: 'second', limit: 2 },
    { name: 'third', limit: 4 },
    { name: 'fourth', limit: 6 },
    { name: 'fifth', limit: 8 },
    { name: 'sixth', limit: 12 },
  ];

  return (
    <div className="my-achv">
      {achievements.map(({ name, limit }, index) => (
        <div key={index} className="my">
          <Image
            className={`my ease-in duration-100 hover:scale-105 ${
              results.win < limit ? 'grayscale blur-[3px]' : 'grayscale-0'
            }`}
            alt=""
            src={`/assets/${name}.jpg`}
            width="200"
            height="200"
          />
        </div>
      ))}
    </div>
  );
};

export default AchievementsList;
