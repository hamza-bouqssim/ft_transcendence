import React from 'react';

interface Props {
    type: string;
    name: string;
    displayName: string;
    id: string;
    image: string;
  }
const ListUser: React.FC<Props> = ({ type,name,displayName,id,image}) => {
  return (
    <div></div>
  );
};

export default ListUser;
